import React, { useState, useEffect } from 'react'

import './SubCategory.css'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import { Network, Urls } from '../../../api-config'

const AddSubCat = () => {
  const [formData, setFormData] = useState({
    headCategory: '',
    parentCategory: '',
    category_name: '',
    sub_category_name: '',
    symbol: '',
    description: '',
    //pc_name: "", // This stores the Parent Category ID
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
  const [subcategories, setsubCategories] = useState([]) // To store added categories
  const [message, setMessage] = useState('')
  const [editMode, setEditMode] = useState(false) // To track if we are editing an existing category
  const [editsubCategoryId, setEditsubCategoryId] = useState(null) // Store category id being edited

  const [tableData, setTableData] = useState([]) // For table rows
  const [id, setId] = useState(1) // Tracks the dynamic ID, default set to 1
  const [selectedGroup, setSelectedGroup] = useState([])
  const [selectedAttributeType, setSelectedAttributeType] = useState(null)
  const [selectedAttributeId, setSelectedAttributeId] = useState(null)
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [selectedParentCategory, setSelectedParentCategory] = useState('')
  const [selectedHeadCategory, setSelectedHeadCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchInitialData = async () => {
      const shopId = localStorage.getItem('shop_id')
      try {
        // Use Promise.all to fetch all endpoints simultaneously
        const [
          headResponse,
          parentResponse,
          attTypesResponse,
          categoriesResponse,
          subcategoriesResponse,
        ] = await Promise.all([
          Network.get(`${Urls.addHeadCategory}${shopId}`),
          Network.get(`${Urls.addParentCategory}${shopId}`),
          Network.get(`${Urls.addAttributeTypes}/${shopId}`),
          Network.get(`${Urls.addCategory}/${shopId}`),
          Network.get(`${Urls.addSubCategories}/${shopId}`),
        ])

        // Update state with fetched data
        setHeadCategories(headResponse.data.results)
        setParentCategories(parentResponse.data.results)
        setAttTypes(attTypesResponse.data.results)
        setCategories(categoriesResponse.data.results)
        setsubCategories(subcategoriesResponse.data.results)
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

        try {
          const subcategoriesResponse = await Network.get(`${Urls.addSubCategories}/${shopId}`)
          setsubCategories(subcategoriesResponse.data.results)
        } catch (subcategoriesError) {
          console.error('Error fetching Sub Categories:', subcategoriesError)
        }
      }
    }

    fetchInitialData()
  }, [])

  const fetchsubCategories = async () => {
    const shopId = localStorage.getItem('shop_id')

    const response = await Network.get(`${Urls.addSubCategories}/${shopId}`)
    if (!response.ok) return consoe.log(response.data.error)
    setsubCategories(subcategoriesResponse.data.results)
  }

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchsubCategories()
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
    const shopId = localStorage.getItem('shop_id')
    const headCategoryId = e.target.value // This will now hold the numeric ID
    console.log('Selected Head Category ID:', headCategoryId) // Logs the correct ID

    setSelectedHeadCategory(headCategoryId) // Save selected head category

    // Update formData with selected head category ID
    setFormData({
      ...formData,
      headCategory: headCategoryId,
    })

    // Reset dependent dropdowns
    setParentCategories([])
    setCategories([])
    setSelectedParentCategory('')

    if (headCategoryId) {
      const response = await Network.get(
        `${Urls.fetchHeadtoParentCategory}${shopId}/${headCategoryId}`,
      )
      if (!response.ok) return console.log(response.data.error)
      console.log('Parent Categories:', response.data)
      setParentCategories(response.data)
    }
  }

  const handleParentCategoryChange = async (selectedOption) => {
    const shopId = localStorage.getItem('shop_id')
    const parentCategoryId = selectedOption?.value // Get the selected parent category ID
    console.log('Selected Parent Category ID:', parentCategoryId) // Log for debugging

    setSelectedParentCategory(parentCategoryId) // Save the selected parent category in state

    // Update formData with the selected parent category ID
    setFormData({
      ...formData,
      pc_name: parentCategoryId, // Ensure `pc_name` is updated correctly
    })

    // Reset dependent dropdowns
    setCategories([]) // Clear categories if a new parent category is selected
    setSelectedCategory('') // Reset any previously selected category

    if (parentCategoryId) {
      try {
        const response = await Network.get(
          `${Urls.fetchParenttoCategory}${shopId}/${parentCategoryId}`,
        )
        if (!response.ok) {
          console.log(response.data.error)
          return
        }
        console.log('Categories:', response.data) // Log fetched categories
        setCategories(response.data) // Update the categories dropdown
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
  }

  //Fetch attributes and variations
  useEffect(() => {
    const shopId = localStorage.getItem('shop_id')
    if (formData.attType.length > 0) {
      const fetchAttributes = async () => {
        try {
          console.log('Selected Attribute Types:', formData.attType)

          const responses = await Promise.all(
            formData.attType.map((typeId) =>
              Network.get(`${Urls.fetchVariationGroup}/${shopId}/${typeId}`),
            ),
          )

          const data = responses.flatMap((res) => res.data)

          const groupedData = data.map((group) => ({
            att_type: group.att_type || 'Unnamed Group',
            attribute_id: Array.isArray(group.attribute_name) ? group.attribute_name : [],
            variation: Array.isArray(group.variation) ? group.variation : [],
          }))

          console.log('Fetched Attributes for Table:', groupedData)
          setTableData(groupedData)
        } catch (error) {
          console.error('Error fetching Attributes:', error)
        }
      }

      fetchAttributes()
    } else {
      // setTableData([]); // Clear table when no Attribute Type is selected
    }
  }, [formData.attType])

  const handleRadioChange = (groupName) => {
    setSelectedGroup(groupName)
    console.log('Selected Group:', groupName) // Debugging log
  }

  // Fetch Groups Based on Selected Attribute Types
  useEffect(() => {
    const shopId = localStorage.getItem('shop_id')
    if (formData.attType.length > 0) {
      const fetchGroups = async () => {
        try {
          const responses = await Promise.all(
            formData.attType.map((typeId) =>
              Network.get(`${Urls.fetchVariationGroup}/${shopId}/${typeId}`),
            ),
          )
          const data = responses.flatMap((res) => res.data)
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
          : name === 'category_name' // Handle the special case for `pc_name`
            ? value || null // Store `null` if no value is provided
            : value, // Default behavior for other inputs
    }))
  }

  useEffect(() => {
    console.log({ selectedGroup })
  }, [selectedGroup])
  7

  const handleSubmit = async (e) => {
    const shopId = localStorage.getItem('shop_id')
    e.preventDefault()

    const payload = {
      //category_name: formData.category_name,
      sub_category_name: formData.sub_category_name,
      symbol: formData.symbol,
      description: formData.description,
      status: formData.status,
      // pc_name: formData.pc_name ? parseInt(formData.pc_name, 10) : null,
      category: formData.category_name ? parseInt(formData.category_name, 10) : null,
      attribute_group: selectedAttributes.map((attr) => attr.split(':')[1]), // Extract only the attribute_id
      shop: shopId,
    }
    console.log(payload)

    try {
      if (editMode) {
        // PUT request to update category
        const response = await Network.put(
          `${Urls.updateSubCategory}/${shopId}/${editsubCategoryId}`,
          payload,
        )
        // await Network.put(`${Urls.updateSubCategory}/${shopId}/${editsubCategoryId}`, payload)
        // Update the category list with the new data
        const updatedsubCategories = subcategories.map((cat) =>
          cat.id === editsubCategoryId ? response.data : cat,
        )
        if (response) {
          setsubCategories((prev) => prev, ...response.data)
          setTableData((prev) => prev, ...response.data)
        }

        setMessage('Sub Category updated successfully.')
        fetchsubCategories()
      } else {
        // POST request to add new subcategory
        const response = await Network.post(`${Urls.addSubCategories}/${shopId}`, payload)
        // await Network.post(`${Urls.addSubCategories}/${shopId}`, payload)
        const newsubCategory = response.data
        // setsubCategories((prevsubCategories) => [...prevsubCategories, newsubCategory]);
        // setTableData((prevData) => [...prevData, newsubCategory]);
        // setMessage("subcategory added successfully.");

        if (newsubCategory) {
          setsubCategories((prev) => [...prev, ...response.data])
          setTableData((prev) => [...prev, ...response.data])
          setMessage('Sub Category added successfully.')
        }
      }
      // Reset form and exit edit mode
      setFormData({
        headCategory: '',
        parentCategory: '',
        category_name: '',
        sub_category_name: '',
        symbol: '',
        description: '',
        addSubCategory: false,
        status: 'active',
        attType: [],
        attribute_group: [],
        attribute_id: '',
      })
      setEditMode(false)
      setEditsubCategoryId(null)
      fetchsubCategories()
    } catch (error) {
      console.error('Error submitting subcategory:', error)
      setMessage('Failed to submit subcategory. Please try again.')
    }
  }

  const handleEdit = async (subcategory) => {
    try {
      const shopId = localStorage.getItem('shop_id')
      // Fetch category details from API
      // const response = await axios.get(`${API_UPDATE_SUBCATEGORY}/${subcategory.id}`)
      const response = await Network.get(`${Urls.updateSubCategory}/${shopId}/${subcategory.id}`)
      const subcategoryData = response.data
      console.log({ subcategoryData })
      console.log(subcategoryData.att_type, 'att_type data')
      // Extract attType IDs
      const attTypeIds = subcategoryData.att_type.map((type) => type.id)

      console.log({ subcategoryData })
      // Pre-fill form fields
      setFormData({
        headCategory: subcategoryData?.head_id, // Update if necessary
        selectedParentCategory: subcategoryData?.parent_id,
        selectedCategory: subcategoryData?.category_id || '',
        category_name: subcategoryData?.category_id || '',
        symbol: subcategoryData.symbol || '',
        addSubCategory: subcategoryData.subcategory_option === 'True',
        description: subcategoryData.description || '',
        sub_category_name: subcategoryData.sub_category_name,
        status: subcategoryData.status || 'active',
        // pc_name: subcategoryData?.parent_id, // Update if necessary
        attribute_group: subcategoryData.attribute_group, // Array of selected attributes
        attType: attTypeIds, // Populate attType with IDs
      })

      // Pre-fill table's selected attributes
      const initialSelectedGroup = {}
      subcategoryData.attribute_group.map((group, index) => {
        // if (group.att_type && group.attribute_id) {
        //     initialSelectedGroup[group.att_type] = group.attribute_id; // Map `att_type` to `attribute_id`
        // }
      })

      const transformArray = (arr) => {
        const result = {}

        subcategoryData.attribute_group.forEach((item) => {
          result[item.att_type_name] = item.id
        })

        return result
      }

      setSelectedGroup(transformArray)

      // const responses = await Promise.all(
      //   subcategoryData.att_type.map((id) => axios.get(`${API_FETCH_VARIATIONS_GROUP}/${id.id}`)),
      // )

      const responses = await Promise.all(
        subcategoryData.att_type.map((id) =>
          Network.get(`${Urls.fetchVariationGroup}/${shopId}/${id.id}`),
        ),
      )
      const data = responses.flatMap((res) => res.data)
      fetchsubCategories()
      setTableData(data)
      setEditMode(true)
      setEditsubCategoryId(subcategoryData.id) // Store the ID for updating
      fetchsubCategories()
    } catch (error) {
      console.error('Error fetching subcategory for edit:', error)
      setMessage('Failed to fetch subcategory details.')
    }
    fetchsubCategories()
  }

  const handleDelete = async (subcategoryId) => {
    const shopId = localStorage.getItem('shop_id')

    try {
      await Network.delete(`${Urls.updateSubCategory}/${shopId}/${subcategoryId}`)
      setsubCategories(subcategories.filter((subcategory) => subcategory.id !== subcategoryId))
      setMessage('subcategory deleted successfully.')
      fetchsubCategories()
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      setMessage('Failed to delete subcategory.')
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Add Sub-Categories</h2>
      {message && <p className="form-message">{message}</p>}
      <form className="form" onSubmit={handleSubmit}>
        {/* Head Category Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Head Category: *</label>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <Select
              name="headCategory"
              options={headCategories.map((category) => ({
                value: category.id, // Use category ID as value
                label: category.hc_name, // Display hc_name as label
              }))} // Convert headCategories to value/label pairs
              value={
                formData.headCategory
                  ? {
                      value: formData.headCategory,
                      label: headCategories.find(
                        (category) => category.id === formData.headCategory,
                      )?.hc_name,
                    }
                  : null
              } // Match the selected value
              onChange={(selectedOption) =>
                handleHeadCategoryChange({
                  target: { name: 'headCategory', value: selectedOption?.value },
                })
              } // Simulate native event for handleHeadCategoryChange
              placeholder="Select Head Category"
              isSearchable // Enable search functionality
              isClearable // Allow clearing the selection
              styles={{
                container: (base) => ({
                  ...base,
                  flex: 1,
                }),
                control: (base) => ({
                  ...base,
                  padding: '5px',
                  border: '1px solid #ced4da', // Matches input field border
                  borderRadius: '4px', // Adds consistent rounded corners
                  backgroundColor: '#fff', // Matches input field background
                  height: '42px', // Consistent height
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 8px', // Adjusts internal padding
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '16px', // Matches input placeholder font size
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: '16px', // Matches input selected value font size
                }),
                input: (base) => ({
                  ...base,
                  margin: '0',
                }),
              }}
            />
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
            <Select
              name="pc_name"
              options={parentCategories.map((category) => ({
                value: category.id, // Use the category ID as value
                label: category.pc_name, // Display pc_name as label
              }))} // Convert parentCategories to value/label pairs
              value={
                formData.pc_name
                  ? {
                      value: formData.pc_name,
                      label: parentCategories.find((category) => category.id === formData.pc_name)
                        ?.pc_name,
                    }
                  : null
              } // Match the selected value
              onChange={handleParentCategoryChange} // Directly pass the selected option to the handler
              placeholder="Select Parent Category"
              isSearchable // Enable search functionality
              isClearable // Allow clearing the selection
              styles={{
                container: (base) => ({
                  ...base,
                  flex: 1,
                }),
                control: (base) => ({
                  ...base,
                  padding: '5px',
                  border: '1px solid #ced4da', // Matches input field border
                  borderRadius: '4px', // Adds consistent rounded corners
                  backgroundColor: '#fff', // Matches input field background
                  height: '42px', // Consistent height
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 8px', // Adjusts internal padding
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '16px', // Matches input placeholder font size
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: '16px', // Matches input selected value font size
                }),
                input: (base) => ({
                  ...base,
                  margin: '0',
                }),
              }}
            />

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

        {/* Category Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Category: *</label>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <Select
              name="category_name"
              options={categories.map((category) => ({
                value: category.id, // Use category ID as value
                label: category.category_name, // Display category_name as label
              }))} // Convert categories to value/label pairs
              value={
                formData.category_name
                  ? {
                      value: formData.category_name,
                      label: categories.find((category) => category.id === formData.category_name)
                        ?.category_name,
                    }
                  : null
              } // Match the selected value
              onChange={(selectedOption) => {
                const selectedOptionId = selectedOption?.value // Get the selected option ID
                setFormData({
                  ...formData,
                  category_name: selectedOptionId, // Store the selected ID in formData
                })
              }}
              placeholder="Select Category"
              isSearchable // Enable search functionality
              isClearable // Allow clearing the selection
              styles={{
                container: (base) => ({
                  ...base,
                  flex: 1,
                }),
                control: (base) => ({
                  ...base,
                  padding: '5px',
                  border: '1px solid #ced4da', // Matches input field border
                  borderRadius: '4px', // Adds consistent rounded corners
                  backgroundColor: '#fff', // Matches input field background
                  height: '42px', // Consistent height
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 8px', // Adjusts internal padding
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '16px', // Matches input placeholder font size
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: '16px', // Matches input selected value font size
                }),
                input: (base) => ({
                  ...base,
                  margin: '0',
                }),
              }}
            />
            <Link to="/Category/AddCategories">
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

        {/* SubCategory Name */}
        <div className="form-group">
          <label>Sub Category Name:</label>
          <input
            type="text"
            name="sub_category_name"
            value={formData.sub_category_name}
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

        <div>
          <label>Attribute Types</label>
          <Select
            isMulti
            options={attTypes.map((type) => ({ value: type.id, label: type.att_type }))}
            value={formData.attType
              .map((id) => {
                const matchedType = attTypes.find((type) => type.id === id) // Match ID with options
                return matchedType ? { value: matchedType.id, label: matchedType.att_type } : null
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
              {selectedAttributeType && (
                <tr>
                  <th style={{ border: '1px solid black' }}>#</th>
                  <th style={{ border: '1px solid black' }}>Attribute Type</th>
                  <th style={{ border: '1px solid black' }}>Attribute Group</th>
                  <th style={{ border: '1px solid black' }}>Variations</th>
                </tr>
              )}
            </thead>

            <tbody>
              {Object.values(
                tableData.reduce((acc, item) => {
                  if (!acc[item.att_type]) {
                    acc[item.att_type] = { ...item, groups: [] }
                  }
                  acc[item.att_type].groups.push(item)
                  return acc
                }, {}),
              ).map((typeGroup, groupIndex) =>
                typeGroup.groups.map((item, index) => (
                  <tr key={`${item.att_id}-${index}`} style={{ borderBottom: '1px solid black' }}>
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

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit" className="submit-button">
            {editMode ? 'Update SubCategory' : 'Add SubCategory'}
          </button>
        </div>
      </form>

      {/* Categories Table */}
      <div className="form-group">
        <h3>Sub Categories List</h3>
        <table className="subcategories-table">
          <thead>
            <tr>
              <th>SubCategory Name</th>
              <th>Short Form</th>
              <th>Status</th>
              <th>Attribute Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory, index) => (
              <tr key={subcategory.id || index}>
                <td>{subcategory.sub_category_name}</td>
                <td>{subcategory.symbol}</td>
                <td>{subcategory.status}</td>
                <td>
                  {Array.isArray(subcategory.attribute_group)
                    ? subcategory.attribute_group.join(', ')
                    : subcategory.attribute_group && subcategory.attribute_group.split
                      ? subcategory.attribute_group.split(' ').join(', ')
                      : 'No groups available'}
                </td>

                <td>
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => handleEdit(subcategory)}
                  >
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(subcategory.id)}>
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

export default AddSubCat
