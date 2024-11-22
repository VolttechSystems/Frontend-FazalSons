

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCategories.css';
import Select from 'react-select';

const AddCategories = () => {
  const [formData, setFormData] = useState({
    headCategory: '',
    parentCategory: '',
    category_name: '',
    symbol: '',
    description: '',
    addSubCategory: false,
    status: 'active',
    // attType: '',
    // attributeGroups: [],
    attType: [], // Changed from string to an array for multiselect
    attributeGroups: [],
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
  const [selectedGroup, setSelectedGroup] = useState("");

  const API_ADD_CATEGORIES = 'http://16.171.145.107/pos/products/add_categories';
  const API_HEAD_CATEGORIES = 'http://16.171.145.107/pos/products/add_head_category';
  const API_PARENT_CATEGORIES = 'http://16.171.145.107/pos/products/add_parent_category';
  const API_ATT_TYPES = 'http://16.171.145.107/pos/products/add_attribute_type';
  const API_FETCH_VARIATIONS_GROUP = 'http://16.171.145.107/pos/products/fetch_variations_group';

  const API_UPDATE_CATEGORY = 'http://16.171.145.107/pos/products/update_category';
  const API_FETCH_CATEGORIES = 'http://16.171.145.107/pos/products/add_categories';

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
        console.log('Fetched Attribute Types:', response.data);
      } catch (error) {
        console.error('Error fetching Attribute Types:', error);
      }
    };

    fetchAttTypes();
  }, []);

  

  // Fetch attributes and variations
useEffect(() => {
  if (formData.attType.length > 0) {
    const fetchAttributes = async () => {
      try {
        console.log('Selected Attribute Types:', formData.attType);

        const responses = await Promise.all(
          formData.attType.map((typeId) =>
            axios.get(`${API_FETCH_VARIATIONS_GROUP}/${typeId}`)
          )
        );

        const data = responses.flatMap((res) => res.data);

        const groupedData = data.map((group) => ({
          groupName: group.group_name,
          attributes: group.attributes, // Exclude variations
          variations: group.variations, // Include variations separately
        }));

        console.log('Fetched Attributes for Table:', groupedData);
        setTableData(groupedData);
      } catch (error) {
        console.error('Error fetching Attributes:', error);
      }
    };
    

    fetchAttributes();
  } else {
    setTableData([]); // Clear table when no Attribute Type is selected
  }
}, [formData.attType]);


const handleRadioChange = (groupName) => {
  setSelectedGroup(groupName);
  console.log("Selected Group:", groupName); // Debugging log
};

  
// Fetch Attributes based on selected Attribute Type
useEffect(() => {
  if (formData.attType.length > 0) {
    const fetchAttributes = async () => {
      try {
        const responses = await Promise.all(
          formData.attType.map((typeId) =>
            axios.get(`${API_FETCH_VARIATIONS_GROUP}/${typeId}`)
          )
        );

        const attributes = responses.flatMap((res) => res.data);
        console.log('Fetched Attributes:', attributes); // Debugging log
        setTableData(attributes);
      } catch (error) {
        console.error('Error fetching Attributes:', error);
      }
    };

    fetchAttributes();
  } else {
    setTableData([]); // Clear table when no Attribute Type is selected
  }
}, [formData.attType]);


  // Handle Dropdown Change
  const handleMultiSelectChange = (selectedOption) => {
    const selectedIds = selectedOption ? selectedOption.map((option) => option.value) : [];
    setFormData({
      ...formData,
      attType: selectedIds,
    });
    console.log('Updated Form Data:', selectedIds);
  };
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "parentCategory") {
      const selectedCategory = parentCategories.find(category => category.pc_name === value);
      setFormData({
        ...formData,
        [name]: selectedCategory ? selectedCategory.id : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  const selectedParentCategory = parentCategories.find(
    (category) => category.id === formData.parentCategory
  );

  const payload = {
    category_name: formData.category_name,
    symbol: formData.symbol,
    subcategory_option: formData.addSubCategory ? "yes" : "no",
    description: formData.description,
    status: formData.status,
    pc_name: selectedParentCategory ? selectedParentCategory.id : "",
    attType: formData.attType.join(","),
    attribute_group: formData.attType.length > 0 ? formData.attType.join(",") : [],
  };

  try {
    if (editMode) {
      const response = await axios.put(`${API_UPDATE_CATEGORY}/${editCategoryId}`, payload);
      const updatedCategories = categories.map((cat) =>
        cat.id === editCategoryId ? response.data : cat
      );
      setCategories(updatedCategories);
      setTableData(updatedCategories);  // Update table data with the updated category
      setMessage("Category updated successfully.");
    } else {
      const response = await axios.post(API_ADD_CATEGORIES, payload);
      const newCategory = response.data;
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setTableData((prevData) => [...prevData, newCategory]);  // Add the new category to table data
      setMessage("Category added successfully.");
    }

    // Reset form after submitting
    setFormData({
      headCategory: '',
      pc_name: '',
      category_name: '',
      symbol: '',
      description: '',
      subcategory_option: false,
      status: 'active',
      attType: [],
    });
    setEditMode(false);
    setEditCategoryId(null);
  } catch (error) {
    console.error('Error submitting category:', error);
    setMessage('Failed to submit category. Please try again.');
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

  const handleTypeChange = (event) => {
    const selected = event.target.value;
    setSelectedType(selected);
    const filtered = data.filter((item) => item.att_type === selected);
    setFilteredAttributes(filtered);
  };

  // Handle dynamic ID input
  const handleIdChange = (event) => {
    setId(event.target.value); // Update the ID
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
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select</option>
            {headCategories.map((category) => (
              <option key={category.id} value={category.hc_name}>
                {category.hc_name}
              </option>
            ))}
          </select>
        </div>

        {/* Parent Category Dropdown */}
        <div className="form-group">
          <label>Parent Category:</label>
          <select
            name="parentCategory"
            value={formData.parentCategory}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select</option>
            {parentCategories.map((category) => (
              <option key={category.id} value={category.pc_name}>
                {category.pc_name}
              </option>
            ))}
          </select>
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

        {/* Attribute Type Dropdown */}
        {/* <div className="form-group">
          <label>Attribute Type:</label>
          <select
            name="attType"
            value={formData.attType}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select</option>
            {attTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.att_type}
              </option>
            ))}
          </select>
        </div> */}

{/* Attribute Type Dropdown */}

      <div className="form-group">
        <label>Attribute Type:</label>
        <Select
          isMulti
          options={attTypes.map((type) => ({
            value: type.id,
            label: type.att_type,
          }))}
          onChange={handleMultiSelectChange}
          placeholder="Select Attribute Types"
        />
      </div>


        
      {/* Display Table */}
      {tableData.length > 0 && (
  <table>
  <thead>
    <tr>
      <th>#</th>
      <th>Attribute Type</th>
      <th>Group Name</th>
      <th>Variation</th>
      
    </tr>
  </thead>
  <tbody>
    {tableData.map((row, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{row.att_type || "N/A"}</td>
        <td>
          {/* Combine attribute name with radio button */}
          <label>
            <input
              type="radio"
              name="groupSelection" // All rows share the same name for one selection
              value={row.attribute_name}
              checked={selectedGroup === row.attribute_name} // Check if this row's attribute is selected
              onChange={() => handleRadioChange(row.attribute_name)} // Update selected group when radio is clicked
            />
            {row.attribute_name || "N/A"} {/* Display attribute name */}
          </label>
        </td>
        <td>
          {Array.isArray(row.variation) && row.variation.length > 0
            ? row.variation.join(", ")
            : "No Variations"}
        </td>
        <td>
          {/* Any other actions you might want to perform */}
        </td>
      </tr>
    ))}
  </tbody>
</table>
)}
 


      {/* Display Message if Table is Empty */}
      {tableData.length === 0 && formData.attType.length > 0 && (
        <p>No attributes found for the selected type(s).</p>
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
          <button onClick={() => handleEdit(category)}>Edit</button>
          <button onClick={() => handleDelete(category.id)}>Delete</button>
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
