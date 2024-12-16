

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Category.css';
import Select from 'react-select';
import { Link } from 'react-router-dom';

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
    attribute_id : '',
  });

  const [headCategories, setHeadCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [attTypes, setAttTypes] = useState([]);
  const [variationsGroup, setVariationsGroup] = useState([]);
  const [categories, setCategories] = useState([]); // To store added categories
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false); // To track if we are editing an existing category
  const [editCategoryId, setEditCategoryId] = useState(null); // Store category id being edited
  
  const [tableData, setTableData] = useState([]); // For table rows
  const [id, setId] = useState(1); // Tracks the dynamic ID, default set to 1
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [selectedAttributeType, setSelectedAttributeType] = useState(null);
  const [selectedAttributeId, setSelectedAttributeId] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [selectedHeadCategory, setSelectedHeadCategory] = useState('');



  const API_ADD_CATEGORIES = 'http://195.26.253.123/pos/products/add_categories';
  const API_HEAD_CATEGORIES = 'http://195.26.253.123/pos/products/add_head_category';
  const API_PARENT_CATEGORIES = 'http://195.26.253.123/pos/products/add_parent_category';
  const API_ATT_TYPES = 'http://195.26.253.123/pos/products/add_attribute_type';
  const API_FETCH_VARIATIONS_GROUP = 'http://195.26.253.123/pos/products/fetch_variations_group';

  const API_UPDATE_CATEGORY = 'http://195.26.253.123/pos/products/action_categories';
  const API_FETCH_CATEGORIES = 'http://195.26.253.123/pos/products/add_categories';

  // Fetch initial data and categories list
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [headResponse, parentResponse, attTypesResponse, categoriesResponse] = await Promise.all([
          axios.get(API_HEAD_CATEGORIES),
          axios.get(API_PARENT_CATEGORIES),
          axios.get(API_ATT_TYPES),
          axios.get(API_FETCH_CATEGORIES),
        ]);
    
        setHeadCategories(headResponse.data);
        setParentCategories(parentResponse.data);
        setAttTypes(attTypesResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error in fetchInitialData:", error);
    
        // Log each endpoint individually
        try {
          const headResponse = await axios.get(API_HEAD_CATEGORIES);
          setHeadCategories(headResponse.data);
        } catch (headError) {
          console.error("Error fetching Head Categories:", headError);
        }
    
        try {
          const parentResponse = await axios.get(API_PARENT_CATEGORIES);
          setParentCategories(parentResponse.data);
        } catch (parentError) {
          console.error("Error fetching Parent Categories:", parentError);
        }
    
        try {
          const attTypesResponse = await axios.get(API_ATT_TYPES);
          setAttTypes(attTypesResponse.data);
        } catch (attError) {
          console.error("Error fetching Attribute Types:", attError);
        }
    
        try {
          const categoriesResponse = await axios.get(API_FETCH_CATEGORIES);
          setCategories(categoriesResponse.data);
        } catch (categoriesError) {
          console.error("Error fetching Categories:", categoriesError);
        }
        
      }
    };
    

    fetchInitialData();
  }, []);



  // Fetch Attribute Types
  useEffect(() => {
    const fetchAttTypes = async () => {
      try {
        const response = await axios.get(API_ATT_TYPES);
        setAttTypes(response.data);
      } catch (error) {
        console.error('Error fetching Attribute Types:', error);
      }
    };
    fetchAttTypes();
  }, []);


  
useEffect(() => {
  fetchHeadCategories();
}, []);

// Fetch Head Categories
const fetchHeadCategories = async () => {
  try {
    const response = await axios.get('http://195.26.253.123/pos/products/add_head_category');
    setHeadCategories(response.data);
  } catch (error) {
    console.error('Error fetching head categories:', error);
    //setError('Failed to load head categories. Please try again later.');
  }
  
}; 

const handleHeadCategoryChange = async (e) => {
  const headCategoryId = e.target.value; // This will now hold the numeric ID

  setSelectedHeadCategory(headCategoryId); // Save selected head category

  // Update formData with selected head category ID
  setFormData({
    ...formData,
    headCategory: headCategoryId,
  });


  // Reset dependent dropdowns
  setParentCategories([]);
  // setCategories([]);
  setSelectedParentCategory('');


  if (headCategoryId) {
    try {
      const response = await axios.get(
        `http://195.26.253.123/pos/products/fetch_head_to_parent_category/${headCategoryId}/`
      );
      setParentCategories(response.data); // Populate parent categories
    } catch (error) {
      console.error(
        `Error fetching parent categories for Head Category ID: ${headCategoryId}`,
        error
      );
      // Optional: Display error message to user
    }
  }
};

  
  

  //Fetch attributes and variations
useEffect(() => {
  if (formData.attType.length > 0) {
    const fetchAttributes = async () => {
      try {
        console.log("Selected Attribute Types:", formData.attType);

        const responses = await Promise.all(
          formData.attType.map((typeId) =>
            axios.get(`${API_FETCH_VARIATIONS_GROUP}/${typeId}`)
          )
        );

        const data = responses.flatMap((res) => res.data);

        const groupedData = data.map((group) => ({
          att_type: group.att_type || "Unnamed Group", 
          attribute_id: Array.isArray(group.attribute_name) ? group.attribute_name : [], 
            variation: Array.isArray(group.variation) ? group.variation : [], 
        }));

        console.log("Fetched Attributes for Table:", groupedData);
        setTableData(groupedData);
      } catch (error) {
        console.error("Error fetching Attributes:", error);
      }
    };

    fetchAttributes();
  } else {
    // setTableData([]); // Clear table when no Attribute Type is selected
  }
}, [formData.attType]);



 
// Fetch Groups Based on Selected Attribute Types
useEffect(() => {
  if (formData.attType.length > 0) {
    const fetchGroups = async () => {
      try {
        const responses = await Promise.all(
          formData.attType.map((typeId) =>
            axios.get(`${API_FETCH_VARIATIONS_GROUP}/${typeId}`)
          )
        );

        const data = responses.flatMap((res) => res.data);
        setTableData(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  } else {
    setTableData([]);
  }
}, [formData.attType]);


const handleRadioChange = (groupName) => {
  setSelectedGroup(groupName);
  console.log("Selected Group:", groupName); // Debugging log
};

//  useEffect(() => {
//     if (formData.attType.length > 0) {
//         const fetchAttributes = async () => {
//             try {
//                 console.log("Selected Attribute Types:", formData.attType);

//                 const responses = await Promise.all(
//                     formData.attType.map((typeId) =>
//                         axios.get(`${API_FETCH_VARIATIONS_GROUP}/${typeId}`)
//                     )
//                 );

//                 const data = responses.flatMap((res) => res.data);

//                 const groupedData = data.map((group) => ({
//                   att_type: group.att_type || "Unnamed Group", 
//                   attribute_group: Array.isArray(group.attribute_name) ? group.attribute_name : [], 
//                     variation: Array.isArray(group.variation) ? group.variation : [], 
//                 }));

//                 console.log("Fetched Attributes for Table:", groupedData);
//                 setTableData(groupedData);
//             } catch (error) {
//                 console.error("Error fetching Attributes:", error);
//             }
//         };

//         fetchAttributes();
//     } else {
//         setTableData([]); 
//     }
// }, [formData.attType]);


  // Handle Multi-select Attribute Type Change
  const handleMultiSelectChange = (selectedOption) => {
    const selectedIds = selectedOption ? selectedOption.map((option) => option.value) : [];
    setFormData((prevState) => ({
      ...prevState,
      attType: selectedIds,
    }));
    setSelectedGroup([]); // Reset selected groups when attribute types change
  };

const handleGroupSelection = (attType, attributeName, attributeId, event) => {
  const { value, checked } = event.target;

  // Update selectedGroup for the current att_type
  setSelectedGroup((prevState) => ({
    ...prevState,
    [attType]: attributeId,
  }));

  // Update formData with the selected attribute_id and attribute_name
  setFormData((prevState) => ({
    ...prevState,
    attribute_id: attributeId,
    attribute_name: attributeName,
  }));

  // Manage selectedAttributes array
  setSelectedAttributes((prevState) => {
    // Filter out previous entries with the same att_type
    const filteredAttributes = prevState.filter(
      (attr) => !attr.startsWith(attType)
    );

    if (checked) {
      // Add the new selection for the current att_type
      return [...filteredAttributes, `${attType}:${value}`];
    }
    return filteredAttributes; // If unchecked, just return filtered array
  });

  console.log("selectedGroup", selectedGroup);
  console.log("selectedAttributes", selectedAttributes);
};

  
  

const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  console.log(name, value, type);

  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]:
      type === "checkbox"   // If it's a checkbox, set the value based on its checked state
        ? checked
        : name === "pc_name" // Handle the special case for `pc_name`
        ? value || null      // Store `null` if no value is provided
        : value,             // Default behavior for other inputs
  }));
};

  
  
  
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // const attributeGroup = Array.isArray(formData.attribute_name)
    //   ? formData.attribute_name
    //   : formData.attribute_name
    //       .split(',')
    //       .map((item) => item.trim());
  
    const payload = {
      category_name: formData.category_name,
    symbol: formData.symbol,
    subcategory_option: formData.addSubCategory ? "True" : "false",
    description: formData.description,
    status: formData.status,
    pc_name: formData.pc_name ? parseInt(formData.pc_name, 10) : null,
    attribute_group: selectedAttributes.map((attr) => attr.split(":")[1]), // Extract only the attribute_id
    };
    console.log(payload);
  
    try {
      if (editMode) {
        // PUT request to update category
        const response = await axios.put(`${API_UPDATE_CATEGORY}/${editCategoryId}`, payload);
        // Update the category list with the new data
        const updatedCategories = categories.map((cat) =>
          cat.id === editCategoryId ? response.data : cat
        );
        if(response){
          setCategories((prev)=> prev,...response.data);
          setTableData((prev)=> prev,...response.data);
        }
        
  
        setMessage("Category updated successfully.");
      } else {
        // POST request to add new category
        const response = await axios.post(API_ADD_CATEGORIES, payload);
        const newCategory = response.data;
        if(newCategory){
          setCategories((prev) => [...prev, ...response.data]);
          setTableData((prev) => [...prev, ...response.data]);
          setMessage("Category added successfully.");
        }
       
      }

      // Reset form and exit edit mode
      setFormData({
        headCategory: '',
        pc_name: "",
        category_name: '',
        symbol: '',
        description: '',
        addSubCategory: false,
        status: 'active',
        attType: [],
        // attribute_name: " ",
        //  attribute_id : null,
      });
      
      setEditMode(false);
      setEditCategoryId(null);
    } catch (error) {
      console.error('Error submitting category:', error);
      setMessage('Failed to submit category. Please try again.');
    }
   
  };
  
  
  const handleEdit = async (category) => { 
    try {
        // Fetch category details from API
        const response = await axios.get(`${API_UPDATE_CATEGORY}/${category.id}`);
        const categoryData = response.data;
        //console.log(categoryData[0].category_name, 'bb');
        console.log({categoryData})

        // Pre-fill form fields, including `att_type`
        setFormData({
            headCategory: categoryData?.head_id, // Update if necessary
            category_name: categoryData.category_name || '',
            symbol: categoryData.symbol || '',
            addSubCategory: categoryData.subcategory_option === "True",
            description: formData.description || '',
            status: categoryData.status || 'active',
            pc_name: categoryData?.parent_id, // Update if necessary
            attribute_group: categoryData.attribute_group , // Array of selected attributes
            attType: categoryData.att_type || [], // Pre-fill `att_type`
        });

        //Pre-fill table's selected attributes
        
        const initialSelectedGroup = {};
 
        // Assuming `formData.attribute_group` is an array of objects like:
        // [{ att_type: "type1", attribute_id: 1 }, { att_type: "type2", attribute_id: 2 }]
        categoryData.attribute_group.map((group,index) => {
            console.log("Processing group:", group);
            if (group.att_type && group.attribute_id) {
              console.log("inside")
                initialSelectedGroup[group.att_type] = group.attribute_id; // Map `att_type` to `attribute_id`
            }
        });
        console.log("after")
        
        console.log("Initial Selected Group:", initialSelectedGroup);
        setSelectedGroup(initialSelectedGroup);
        
        setEditMode(true);
        setEditCategoryId(categoryData.id); // Store the ID for updating
    } catch (error) {
        console.error('Error fetching category for edit:', error);
        setMessage('Failed to fetch category details.');
    }
};

  
  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`${API_UPDATE_CATEGORY}/${categoryId}`);
      setCategories(categories.filter((category) => category.id !== categoryId));
      setMessage("Category deleted successfully.");
    } catch (error) {
      console.error('Error deleting category:', error);
      setMessage('Failed to delete category.');
    }
  };

 


  

  return (
    <div className="form-container">
      <h2 className="form-title">Add Categories</h2>
      {message && <p className="form-message">{message}</p>}
      <form className="form" onSubmit={handleSubmit}>
        {/* Head Category Dropdown */}
        <div className="form-group">
          <label>Head Category:</label>
          <select
            name="headCategory"
            value={formData.headCategory}
            onChange={handleHeadCategoryChange}
            className="form-select"
          >
            <option value="">Select</option>
            {headCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.hc_name}
              </option>
            ))}
          </select>
          <Link to="/Product/AddHeadCategory">
        <button>+</button>
      </Link>
        </div>

        {/* Parent Category Dropdown */}
        <div className="form-group">
  <label>Parent Category:</label>
  <select
    name="pc_name"
    value={formData.pc_name}
    onChange={(e) => {
      const selectedOptionId = e.target.value; // Get the ID of the selected option
      setFormData({
        ...formData,
        pc_name: selectedOptionId,  // Store the selected ID instead of the name
      });

      
    }}
    className="form-select"
  > 

    <option value="">Select Parent Category</option>  {/* Default option */}
    {parentCategories.map((category) => (
      
      <option key={category.id} value={category.id}>
        {category.pc_name}
      </option>
     
    ))}
  </select>
  <Link to="/Product/AddParentCategory">
        <button>+</button>
      </Link>

{/* 
  <select value={selectedParentCategory}
  onChange={handleParentCategoryChange}
  disabled={!selectedHeadCategory}>
  <option value="">Select Parent Category</option>
  {Array.isArray(parentCategories) && parentCategories.map(parentCategory => (
    <option key={parentCategory.id} value={parentCategory.id}>
      {parentCategory.pc_name}
    </option>
  ))}
</select> */}
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
            onChange={handleMultiSelectChange}
          />
        </div>
<div>
      {/* Table for Attributes */}
      <table
        border="1"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          marginTop: "20px",
          border: "1px solid black",
        }}
      >
        <thead>
          {/* Conditionally render headers based on selection */}
          {selectedAttributeType && (
            <tr>
              <th style={{ border: "1px solid black" }}>#</th>
              <th style={{ border: "1px solid black" }}>Attribute Type</th>
              <th style={{ border: "1px solid black" }}>
                Attribute Group
              </th>
              <th style={{ border: "1px solid black" }}>Variations</th>
            </tr>
          )}
        </thead>
       
        <tbody>
  {Object.values(
    tableData.reduce((acc, item) => {
      if (!acc[item.att_type]) {
        acc[item.att_type] = { ...item, groups: [] };
      }
      acc[item.att_type].groups.push(item);
      return acc;
    }, {})
  ).map((typeGroup, groupIndex) =>
    typeGroup.groups.map((item, index) => (
      <tr
        key={`${item.att_id}-${index}`}
        style={{ borderBottom: "1px solid black" }}
      >
        {/* Row Number Column */}
        {index === 0 && (
          <td
            style={{
              border: "1px solid black",
              textAlign: "center",
              verticalAlign: "middle",
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
              border: "1px solid black",
              textAlign: "center",
              verticalAlign: "middle",
            }}
            rowSpan={typeGroup.groups.length}
          >
            {item.att_type}
          </td>
        )}

        {/* Attribute Name Column */}
        <td style={{ border: "1px solid black", textAlign: "center" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <input
              type="radio"
              name={item.att_type}
              value={item.attribute_id}
              checked={selectedGroup[item.att_type] === item.attribute_id}
              onChange={(e) =>
                handleGroupSelection(item.att_type, item.attribute_name, item.attribute_id, e)
              } 
            
            />
            {item.attribute_name}
          </label>
        </td>

        {/* Variations Column */}
        <td style={{ border: "1px solid black", textAlign: "center" }}>
          {item.variation && item.variation.length > 0 ? (
            <ul
              style={{
                listStyleType: "none",
                margin: 0,
                padding: 0,
                textAlign: "left",
              }}
            >
              {item.variation.map((varName, varIndex) => (
                <li key={varIndex}>{varName}</li>
              ))}
            </ul>
          ) : (
            "No Variations"
          )}
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>
    </>
)}

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit" className="submit-button">
            {editMode ? "Update Category" : "Add Category"}
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
    ? category.attribute_group.join(', ')  // If it's an array, join with commas
    : category.attribute_group && category.attribute_group.split
    ? category.attribute_group.split(' ').join(', ')  // If it's a string, split and join
    : "No groups available"}  
</td>

              <td>
                <button 
                  type="button" 
                  className="btn-edit"
                  onClick={() => handleEdit(category)}>
                  Edit 
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(category.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      </div>
    </div>
  );
};

export default AddCategories;
