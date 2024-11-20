// import React, { useState } from 'react';
// import './AddCategories.css'; // Import CSS file for styling

// const AddCategories = () => {
//   const [formData, setFormData] = useState({
//     headCategory: '',
//     parentCategory: '',
//     categoryName: '',
//     showForm: '',
//     description: '',
//     addSubCategory: false,
//     attributeGroups: [],
//   });

//   const [attributeGroup, setAttributeGroup] = useState('');
//   const [attributeValues, setAttributeValues] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const handleAddAttributeGroup = () => {
//     if (attributeGroup && attributeValues) {
//       setFormData({
//         ...formData,
//         attributeGroups: [
//           ...formData.attributeGroups,
//           { group: attributeGroup, values: attributeValues.split(',') },
//         ],
//       });
//       setAttributeGroup('');
//       setAttributeValues('');
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form Data:', formData);
//     // Send formData to the backend
//   };

//   return (
//     <div className="form-container">
//       <h2 className="form-title">Add Categories</h2>
//       <form className="form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Head Category:</label>
//           <select
//             name="headCategory"
//             value={formData.headCategory}
//             onChange={handleInputChange}
//             className="form-select"
//           >
//             <option value="">Select</option>
//             {/* Add options dynamically */}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Parent Category:</label>
//           <select
//             name="parentCategory"
//             value={formData.parentCategory}
//             onChange={handleInputChange}
//             className="form-select"
//           >
//             <option value="">Select</option>
//             {/* Add options dynamically */}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Category Name:</label>
//           <input
//             type="text"
//             name="categoryName"
//             value={formData.categoryName}
//             onChange={handleInputChange}
//             className="form-input"
//           />
//         </div>

//         <div className="form-group">
//           <label>Show Form:</label>
//           <input
//             type="text"
//             name="showForm"
//             value={formData.showForm}
//             onChange={handleInputChange}
//             className="form-input"
//           />
//         </div>

//         <div className="form-group">
//           <label>Description:</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             className="form-textarea"
//           />
//         </div>

//         <div className="form-group">
//           <label>Add Sub Category:</label>
//           <input
//             type="checkbox"
//             name="addSubCategory"
//             checked={formData.addSubCategory}
//             onChange={handleInputChange}
//             className="form-checkbox"
//           />
//         </div>

//         <div className="form-group">
//           <label>Attribute Groups:</label>
//           <input
//             type="text"
//             placeholder="Group Name"
//             value={attributeGroup}
//             onChange={(e) => setAttributeGroup(e.target.value)}
//             className="form-input"
//           />
//           <input
//             type="text"
//             placeholder="Values (comma-separated)"
//             value={attributeValues}
//             onChange={(e) => setAttributeValues(e.target.value)}
//             className="form-input"
//           />
//           <button
//             type="button"
//             onClick={handleAddAttributeGroup}
//             className="add-button"
//           >
//             Add Group
//           </button>
//         </div>

//         <div className="form-group">
//           <button type="submit" className="submit-button">
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddCategories;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCategories.css';

const AddCategories = () => {
  const [formData, setFormData] = useState({
    headCategory: '',
    parentCategory: '',
    categoryName: '',
    showForm: '',
    description: '',
    addSubCategory: false,
    status: 'active',
    attType: '',
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

  const API_ADD_CATEGORIES = 'http://16.171.145.107/pos/products/add_categories';
  const API_HEAD_CATEGORIES = 'http://16.171.145.107/pos/products/add_head_category';
  const API_PARENT_CATEGORIES = 'http://16.171.145.107/pos/products/add_parent_category';
  const API_ATT_TYPES = 'http://16.171.145.107/pos/products/add_attribute_type';
  const API_VARIATIONS_GROUP = 'http://16.171.145.107/pos/products/fetch_variations_group';
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
          axios.get(API_FETCH_CATEGORIES), // Fetch categories
        ]);

        setHeadCategories(headResponse.data);
        setParentCategories(parentResponse.data);
        setAttTypes(attTypesResponse.data);
        setCategories(categoriesResponse.data); // Set categories from API
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setMessage('Failed to load initial data. Please try again.');
      }
    };

    fetchInitialData();
  }, []);

  // Fetch Variations Group when attType changes
  useEffect(() => {
    if (formData.attType) {
      const fetchVariationsGroup = async () => {
        try {
          const response = await axios.get(`${API_VARIATIONS_GROUP}/${formData.attType}`);
          const data = response.data;

          if (Array.isArray(data)) {
            setVariationsGroup(data); // Update table with fetched data
          } else {
            setVariationsGroup([]);
          }
        } catch (error) {
          console.error('Error fetching variations group:', error);
          setMessage('Failed to load variations group.');
        }
      };

      fetchVariationsGroup();
    } else {
      setVariationsGroup([]);
    }
  }, [formData.attType]);

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
      category_name: formData.categoryName,
      symbol: formData.showForm,
      subcategory_option: formData.addSubCategory ? "yes" : "no",
      description: formData.description,
      status: formData.status,
      pc_name: selectedParentCategory ? selectedParentCategory.id : "",
      att_type: formData.attType,
    };

    try {
      if (editMode) {
        // Update existing category
        console.log('Updating category:', payload); // Debugging log
        const response = await axios.put(`${API_UPDATE_CATEGORY}/${editCategoryId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        // Update the categories list with the updated category
        const updatedCategories = categories.map((cat) =>
          cat.id === editCategoryId ? response.data : cat
        );
        setCategories(updatedCategories);
        setMessage("Category updated successfully.");
      } else {
        // Add new category
        console.log('Adding new category:', payload); // Debugging log
        const response = await axios.post(API_ADD_CATEGORIES, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setCategories([...categories, response.data]);
        setMessage("Category added successfully.");
      }
      setFormData({
        headCategory: '',
        parentCategory: '',
        categoryName: '',
        showForm: '',
        description: '',
        addSubCategory: false,
        status: 'active',
        attType: '',
      });
      setEditMode(false);
      setEditCategoryId(null);
    } catch (error) {
      console.error('Error submitting category:', error);
      setMessage('Failed to submit category. Please try again.');
    }
  };

  const handleEdit = (category) => {
    console.log('Editing category:', category); // Debugging log
    setFormData({
      headCategory: category.headCategory || '',
      parentCategory: category.parentCategory || '', // Ensure parent category is correctly set
      categoryName: category.category_name || '', // Correct field mapping for category name
      showForm: category.symbol || '', // Correct field mapping for short form
      description: category.description || '',
      addSubCategory: category.subcategory_option === 'yes', // Ensure correct handling of subcategory option
      status: category.status || 'active', // Default status in case it's not set
      attType: category.att_type || '', // Ensure the attribute type is correctly set
    });
    setEditMode(true); // Mark as editing mode
    setEditCategoryId(category.id); // Set the category ID being edited
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
            name="categoryName"
            value={formData.categoryName}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        {/* Short Form */}
        <div className="form-group">
          <label>Short Form:</label>
          <input
            type="text"
            name="showForm"
            value={formData.showForm}
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
        <div className="form-group">
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
        </div>

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
            {categories.map((category) => (
              <tr key={category.id}>
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
