import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Category.css'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import { Network, Urls } from '../../../api-config'

const AddCategories = () => {
  const [formData, setFormData] = useState({
    headCategory: '',
    category_name: '',
    symbol: '',
    description: '',
    addSubCategory: true,
    pc_name: '', // This stores the Parent Category ID
    status: 'active',
    attType: [],
    attribute_group: [],
    attribute_id: '',
  })

  const [headCategories, setHeadCategories] = useState([])
  const [parentCategories, setParentCategories] = useState([])
  const [attTypes, setAttTypes] = useState([])
  const [variationsGroup, setVariationsGroup] = useState([])
  const [categories, setCategories] = useState([]) // To store added categories
  const [message, setMessage] = useState('')
  const [editMode, setEditMode] = useState(false) // To track if we are editing an existing category
  const [editCategoryId, setEditCategoryId] = useState(null) // Store category id being edited

  const [tableData, setTableData] = useState([]) // For table rows
  const [id, setId] = useState(1) // Tracks the dynamic ID, default set to 1
  const [selectedGroup, setSelectedGroup] = useState([])
  const [selectedAttributeType, setSelectedAttributeType] = useState(null)
  const [selectedAttributeId, setSelectedAttributeId] = useState(null)
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [selectedParentCategory, setSelectedParentCategory] = useState('')
  const [selectedHeadCategory, setSelectedHeadCategory] = useState('')

  useEffect(() => {
    const fetchInitialData = async () => {
      const shopId = localStorage.getItem('shop_id')
      try {
        // Use Promise.all to fetch all endpoints simultaneously
        const [headResponse, parentResponse, attTypesResponse, categoriesResponse] =
          await Promise.all([
            Network.get(`${Urls.addHeadCategory}${shopId}`),
            Network.get(`${Urls.addParentCategory}${shopId}`),
            Network.get(`${Urls.addAttributeTypes}/${shopId}`),
            Network.get(`${Urls.addCategory}/${shopId}`),
          ])

        // Update state with fetched data
        setHeadCategories(headResponse.data.results)
        setParentCategories(parentResponse.data.results)
        setAttTypes(attTypesResponse.data.results)
        setCategories(categoriesResponse.data.results)
      } catch (error) {
        console.error('Error in fetchInitialData:', error)

        // Attempt to fetch each endpoint individually in case of failure
        try {
          const headResponse = await Network.get(`${Urls.addHeadCategory}${shopId}`)
          setHeadCategories(headResponse.data.results)
        } catch (headError) {
          console.error('Error fetching Head Categories:', headError)
        }

        try {
          const parentResponse = await Network.get(`${Urls.addParentCategory}${shopId}`)
          setParentCategories(parentResponse.data.results)
        } catch (parentError) {
          console.error('Error fetching Parent Categories:', parentError)
        }

        try {
          const attTypesResponse = await Network.get(`${Urls.addAttributeTypes}/${shopId}`)
          setAttTypes(attTypesResponse.data.results)
        } catch (attError) {
          console.error('Error fetching Attribute Types:', attError)
        }

        try {
          const categoriesResponse = await Network.get(`${Urls.addCategory}/${shopId}`)
          setCategories(categoriesResponse.data.results)
        } catch (categoriesError) {
          console.error('Error fetching Categories:', categoriesError)
        }
      }
    }

    fetchInitialData()
  }, [])

  const fetchCategories = async () => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.get(`${Urls.addCategory}/${shopId}`)
    if (!response.ok) return consoe.log(response.data.error)
    setCategories(response.data.results)
  }

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchCategories()
  }, [])

  // Fetch Attribute Types
  useEffect(() => {
    const fetchAttTypes = async () => {
      const shopId = localStorage.getItem('shop_id')
      const response = await Network.get(`${Urls.addAttributeTypes}/${shopId}`)
      if (!response.ok) return consoe.log(response.data.error)
      setAttTypes(response.data.results)
    }
    fetchAttTypes()
  }, [])

  useEffect(() => {
    fetchHeadCategories()
  }, [])

  // Fetch Head Categories
  const fetchHeadCategories = async () => {
    const shopId = localStorage.getItem('shop_id')

    const response = await Network.get(`${Urls.addHeadCategory}${shopId}`)
    if (!response.ok) return console.log(response.data.error)
    setHeadCategories(response.data.results)
  }

  const handleHeadCategoryChange = async (e) => {
    const headCategoryId = e.target.value // This will now hold the numeric ID

    setSelectedHeadCategory(headCategoryId) // Save selected head category

    // Update formData with selected head category ID
    setFormData({
      ...formData,
      headCategory: headCategoryId,
    })

    // Reset dependent dropdowns
    setParentCategories([])
    // setCategories([]);
    setSelectedParentCategory('')

    if (headCategoryId) {
      // try {
      //   const response = await axios.get(
      //     `http://195.26.253.123/pos/products/fetch_head_to_parent_category/${headCategoryId}/`,
      //   )
      //   setParentCategories(response.data) // Populate parent categories
      // } catch (error) {
      //   console.error(
      //     `Error fetching parent categories for Head Category ID: ${headCategoryId}`,
      //     error,
      //   )
      //   // Optional: Display error message to user
      // }

      const response = await Network.get(`${Urls.fetchHeadtoParentCategory}${headCategoryId}/`)
      if (!response.ok) return console.log(response.data.error)
      setParentCategories(response.data)
    }
  }

  //Fetch attributes and variations
  useEffect(() => {
    if (formData.attType.length > 0) {
      const fetchAttributes = async () => {
        try {
          const responses = await Promise.all(
            formData.attType.map((typeId) => Network.get(`${Urls.fetchVariationGroup}/${typeId}`)),
          )

          // Check if all responses are successful
          const isSuccess = responses.every((res) => res && res.data)
          if (!isSuccess) throw new Error('Failed to fetch some attributes.')

          const data = responses.flatMap((res) => res.data || [])
          const groupedData = data.map((group) => ({
            att_type: group.att_type || 'Unnamed Group',
            attribute_id: Array.isArray(group.attribute_name) ? group.attribute_name : [],
            variation: Array.isArray(group.variation) ? group.variation : [],
          }))

          console.log('Fetched Attributes for Table:', groupedData)
          setTableData(groupedData)
        } catch (error) {
          console.error('Error fetching attributes:', error)
        }
      }

      fetchAttributes()
    } else {
      // setTableData([]); // Clear table when no Attribute Type is selected
    }
  }, [formData.attType])

  // Fetch Groups Based on Selected Attribute Types
  useEffect(() => {
    if (formData.attType.length > 0) {
      const fetchGroups = async () => {
        try {
          const responses = await Promise.all(
            formData.attType.map((typeId) => Network.get(`${Urls.fetchVariationGroup}/${typeId}`)),
          )

          // Check if all responses are successful
          const isSuccess = responses.every((res) => res && res.data)
          if (!isSuccess) throw new Error('Failed to fetch some groups.')

          const data = responses.flatMap((res) => res.data || [])
          setTableData(data)
        } catch (error) {
          console.error('Error fetching groups:', error)
        }
      }

      fetchGroups()
    } else {
      setTableData([])
    }
  }, [formData.attType])

  // Handle Multi-select Attribute Type Change
  const handleMultiSelectChange = (selectedOption) => {
    const selectedIds = selectedOption ? selectedOption.map((option) => option.value) : []
    setFormData((prevState) => ({
      ...prevState,
      attType: selectedIds,
    }))
    setSelectedGroup([]) // Reset selected groups when attribute types change
  }

  const handleGroupSelection = (attType, attributeName, attributeId, event) => {
    const { value, checked } = event.target

    // Update selectedGroup for the current att_type
    setSelectedGroup((prevState) => ({
      ...prevState,
      [attType]: attributeId,
    }))

    // Update formData with the selected attribute_id and attribute_name
    setFormData((prevState) => ({
      ...prevState,
      attribute_id: attributeId,
      attribute_name: attributeName,
    }))

    // Manage selectedAttributes array
    setSelectedAttributes((prevState) => {
      // Filter out previous entries with the same att_type
      const filteredAttributes = prevState.filter((attr) => !attr.startsWith(attType))

      if (checked) {
        // Add the new selection for the current att_type
        return [...filteredAttributes, `${attType}:${value}`]
      }
      return filteredAttributes // If unchecked, just return filtered array
    })

    console.log('selectedGroup', selectedGroup)
    console.log('selectedAttributes', selectedAttributes)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    console.log(name, value, type)

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        type === 'checkbox' // If it's a checkbox, set the value based on its checked state
          ? checked
          : name === 'pc_name' // Handle the special case for `pc_name`
            ? value || null // Store `null` if no value is provided
            : value, // Default behavior for other inputs
    }))
  }

  useEffect(() => {
    console.log({ selectedGroup })
  }, [selectedGroup])

  // const handleSubmit = async (e) => {
  //   e.preventDefault()

  //   const payload = {
  //     category_name: formData.category_name,
  //     symbol: formData.symbol,
  //     subcategory_option: formData.addSubCategory ? 'True' : 'false',
  //     description: formData.description,
  //     status: formData.status,
  //     pc_name: formData.pc_name ? parseInt(formData.pc_name, 10) : null,
  //     attribute_group: selectedAttributes.map((attr) => attr.split(':')[1]), // Extract only the attribute_id
  //   }

  //   try {
  //     if (editMode) {
  //       // Update existing category
  //       await axios.put(`${API_UPDATE_CATEGORY}/${editCategoryId}`, payload)
  //       setMessage('Category updated successfully.')
  //     } else {
  //       // Add new category
  //       await axios.post(API_ADD_CATEGORIES, payload)
  //       setMessage('Category added successfully.')
  //     }

  //     // Refetch categories to refresh the table
  //     fetchCategories()
  //   } catch (error) {
  //     console.error('Error in handleSubmit:', error)
  //     setMessage('Failed to submit category.')
  //   }

  //   // Reset form and exit edit mode
  //   setFormData({
  //     headCategory: '',
  //     pc_name: '',
  //     category_name: '',
  //     symbol: '',
  //     description: '',
  //     addSubCategory: false,
  //     status: 'active',
  //     attType: [],
  //     attribute_group: [],
  //     attribute_id: '',
  //   })

  //   setEditMode(false)
  //   setEditCategoryId(null)
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prepare the payload
    const payload = {
      category_name: formData.category_name,
      symbol: formData.symbol,
      subcategory_option: formData.addSubCategory ? 'True' : 'false',
      description: formData.description,
      status: formData.status,
      pc_name: formData.pc_name ? parseInt(formData.pc_name, 10) : null,
      attribute_group: selectedAttributes.map((attr) => attr.split(':')[1]), // Extract only the attribute_id
    }

    try {
      if (editMode) {
        // Update existing category
        await Network.put(`${Urls.updateCategory}/${editCategoryId}`, payload)
        setMessage('Category updated successfully.')
      } else {
        // Add new category
        await Network.post(Urls.addCategory, payload)
        setMessage('Category added successfully.')
      }

      // Refetch categories to refresh the table
      fetchCategories()
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setMessage('Failed to submit category.')
    }

    // Reset form and exit edit mode
    setFormData({
      headCategory: '',
      pc_name: '',
      category_name: '',
      symbol: '',
      description: '',
      addSubCategory: false,
      status: 'active',
      attType: [],
      attribute_group: [],
      attribute_id: '',
    })

    setEditMode(false)
    setEditCategoryId(null)
  }

  const handleEdit = async (category) => {
    try {
      // Fetch category details from API

      // const response = await axios.get(`${API_UPDATE_CATEGORY}/${category.id}`)
      // const categoryData = response.data

      const response = await Network.get(`${Urls.updateCategory}/${category.id}`)
      const categoryData = response.data

      //console.log(categoryData[0].category_name, 'bb');
      console.log({ categoryData })
      console.log(categoryData.att_type, 'att_type data')

      // Extract attType IDs
      const attTypeIds = categoryData.att_type.map((type) => type.id)

      // Pre-fill form fields, including `att_type`
      setFormData({
        headCategory: categoryData?.head_id, // Update if necessary
        category_name: categoryData.category_name || '',
        symbol: categoryData.symbol || '',
        addSubCategory: categoryData.subcategory_option === 'True',
        description: formData.description || '',
        status: categoryData.status || 'active',
        pc_name: categoryData?.parent_id, // Update if necessary
        attribute_group: categoryData.attribute_group, // Array of selected attributes
        attType: attTypeIds, // Populate attType with IDs
      })

      //Pre-fill table's selected attributes

      const initialSelectedGroup = {}

      categoryData.attribute_group.map((group, index) => {
        // if (group.att_type && group.attribute_id) {
        //     initialSelectedGroup[group.att_type] = group.attribute_id; // Map `att_type` to `attribute_id`
        // }
      })

      const transformArray = (arr) => {
        const result = {}

        categoryData.attribute_group.forEach((item) => {
          result[item.att_type_name] = item.id
        })

        return result
      }

      setSelectedGroup(transformArray)

      // const responses = await Promise.all(
      //   categoryData.att_type.map((id) => axios.get(`${API_FETCH_VARIATIONS_GROUP}/${id.id}`)),
      // )
      const responses = await Promise.all(
        categoryData.att_type.map((id) => Network.get(`${Urls.fetchVariationGroup}/${id.id}`)),
      )
      const data = responses.flatMap((res) => res.data)
      setTableData(data)
      setEditMode(true)
      setEditCategoryId(categoryData.id) // Store the ID for updating
      fetchCategories() // Refresh categories after editing
    } catch (error) {
      setMessage('Failed to fetch category details.')
    }
    fetchCategories() // Refresh categories after editing
  }

  const handleDelete = async (categoryId) => {
    // try {
    //   await axios.delete(`${API_UPDATE_CATEGORY}/${categoryId}`)
    //   setCategories(categories.filter((category) => category.id !== categoryId))
    //   setMessage('Category deleted successfully.')
    //   fetchCategories() // Refresh categories after editing
    // } catch (error) {
    //   console.error('Error deleting category:', error)
    //   setMessage('Failed to delete category.')
    // }

    const response = await Network.delete(`${Urls.updateCategory}/${categoryId}`)
    if (!response.ok) return console.log(response.data.error)
    setCategories(categories.filter((category) => category.id !== categoryId))
    setMessage('Category deleted successfully.')
    fetchCategories() // Refresh categories after editing
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Add Categories</h2>
      {message && <p className="form-message">{message}</p>}
      <form className="form" onSubmit={handleSubmit}>
        {/* Head Category Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Head Category: *</label>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <select
              name="headCategory"
              value={formData.headCategory}
              onChange={handleHeadCategoryChange}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ced4da', // Matches input field border
                borderRadius: '4px', // Adds consistent rounded corners
                backgroundColor: '#fff', // Matches input field background
              }}
            >
              <option value="">Select</option>
              {headCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.hc_name}
                </option>
              ))}
            </select>
            <Link to="/Product/AddHeadCategory">
              <button
                style={{
                  padding: '8px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </Link>
          </div>
        </div>

        {/* Parent Category Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Parent Category: *</label>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <select
              name="pc_name"
              value={formData.pc_name}
              onChange={(e) => {
                const selectedOptionId = e.target.value // Get the ID of the selected option
                setFormData({
                  ...formData,
                  pc_name: selectedOptionId, // Store the selected ID instead of the name
                })
              }}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ced4da', // Matches input field border
                borderRadius: '4px', // Adds consistent rounded corners
                backgroundColor: '#fff', // Matches input field background
              }}
            >
              <option value="">Select Parent Category</option> {/* Default option */}
              {parentCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.pc_name}
                </option>
              ))}
            </select>
            <Link to="/Product/AddParentCategory">
              <button
                style={{
                  padding: '8px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </Link>
          </div>
        </div>

        {/* Category Name */}
        <div className="form-group">
          <label>Category Name:</label>
          <input
            type="text"
            name="category_name"
            value={formData.category_name}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        {/* Short Form */}
        <div className="form-group">
          <label>Short Form:</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
          />
        </div>

        {/* Subcategory Checkbox */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="addSubCategory"
              checked={formData.addSubCategory}
              onChange={handleInputChange}
            />
            Add Subcategory
          </label>
        </div>

        {/* Status Radio Buttons */}
        <div className="form-group">
          <label>Status:</label>
          <div>
            <label>
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={handleInputChange}
              />
              Active
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === 'inactive'}
                onChange={handleInputChange}
              />
              Inactive
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="pending"
                checked={formData.status === 'pending'}
                onChange={handleInputChange}
              />
              Pending
            </label>
          </div>
        </div>
        {/* Conditional Rendering for Attribute Types and Table */}
        {!formData.addSubCategory && (
          <>
            <div>
              <label>Attribute Types</label>
              <Select
                isMulti
                options={attTypes.map((type) => ({ value: type.id, label: type.att_type }))}
                value={formData.attType
                  .map((id) => {
                    const matchedType = attTypes.find((type) => type.id === id) // Match ID with options
                    return matchedType
                      ? { value: matchedType.id, label: matchedType.att_type }
                      : null
                  })
                  .filter(Boolean)} // Pre-fill selected options
                onChange={handleMultiSelectChange}
              />
            </div>
            <div>
              {/* Table for Attributes */}
              <table
                border="1"
                style={{
                  borderCollapse: 'collapse',
                  width: '100%',
                  marginTop: '20px',
                  border: '1px solid black',
                }}
              >
                <thead>
                  {/* Conditionally render headers based on selection */}

                  <tr>
                    <th style={{ border: '1px solid black' }}>#</th>
                    <th style={{ border: '1px solid black' }}>Attribute Type</th>
                    <th style={{ border: '1px solid black' }}>Attribute Group</th>
                    <th style={{ border: '1px solid black' }}>Variations</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.values(
                    tableData.reduce((acc, item) => {
                      if (!acc[item.att_type]) {
                        console.log('checking here 678')
                        acc[item.att_type] = { ...item, groups: [] }
                      }
                      acc[item.att_type].groups.push(item)
                      return acc
                    }, {}),
                  ).map((typeGroup, groupIndex) =>
                    typeGroup.groups.map((item, index) => (
                      <tr
                        key={`${item.att_id}-${index}`}
                        style={{ borderBottom: '1px solid black' }}
                      >
                        {/* Row Number Column */}
                        {index === 0 && (
                          <td
                            style={{
                              border: '1px solid black',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                            }}
                            rowSpan={typeGroup.groups.length}
                          >
                            {groupIndex + 1}
                          </td>
                        )}

                        {/* Attribute Type Column */}
                        {index === 0 && (
                          <td
                            style={{
                              border: '1px solid black',
                              textAlign: 'center',
                              verticalAlign: 'middle',
                            }}
                            rowSpan={typeGroup.groups.length}
                          >
                            {item.att_type}
                          </td>
                        )}
                        {/* Attribute Name Column */}
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '10px',
                            }}
                          >
                            <input
                              type="radio"
                              name={item.att_type}
                              value={item.attribute_id}
                              checked={selectedGroup[item.att_type] === item.attribute_id}
                              onChange={(e) =>
                                handleGroupSelection(
                                  item.att_type,
                                  item.attribute_name,
                                  item.attribute_id,
                                  e,
                                )
                              }
                            />
                            {item.attribute_name}
                          </label>
                        </td>

                        {/* Variations Column */}
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                          {item.variation && item.variation.length > 0 ? (
                            <ul
                              style={{
                                listStyleType: 'none',
                                margin: 0,
                                padding: 0,
                                textAlign: 'left',
                              }}
                            >
                              {item.variation.map((varName, varIndex) => (
                                <li key={varIndex}>{varName}</li>
                              ))}
                            </ul>
                          ) : (
                            'No Variations'
                          )}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit" className="submit-button">
            {editMode ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </form>

      {/* Categories Table */}
      <div className="form-group">
        <h3>Categories List</h3>
        <table className="categories-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Short Form</th>
              <th>Status</th>
              <th>Attribute Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id || index}>
                <td>{category.category_name}</td>
                <td>{category.symbol}</td>
                <td>{category.status}</td>
                <td>
                  {Array.isArray(category.attribute_group)
                    ? category.attribute_group.join(', ') // If it's an array, join with commas
                    : category.attribute_group && category.attribute_group.split
                      ? category.attribute_group.split(' ').join(', ') // If it's a string, split and join
                      : 'No groups available'}
                </td>

                <td>
                  <button type="button" className="btn-edit" onClick={() => handleEdit(category)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(category.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AddCategories
