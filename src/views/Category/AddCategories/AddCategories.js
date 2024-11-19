import React, { useState } from 'react';
import './AddCategories.css'; // Import CSS file for styling

const AddCategories = () => {
  const [formData, setFormData] = useState({
    headCategory: '',
    parentCategory: '',
    categoryName: '',
    showForm: '',
    description: '',
    addSubCategory: false,
    attributeGroups: [],
  });

  const [attributeGroup, setAttributeGroup] = useState('');
  const [attributeValues, setAttributeValues] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddAttributeGroup = () => {
    if (attributeGroup && attributeValues) {
      setFormData({
        ...formData,
        attributeGroups: [
          ...formData.attributeGroups,
          { group: attributeGroup, values: attributeValues.split(',') },
        ],
      });
      setAttributeGroup('');
      setAttributeValues('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Send formData to the backend
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Categories</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Head Category:</label>
          <select
            name="headCategory"
            value={formData.headCategory}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select</option>
            {/* Add options dynamically */}
          </select>
        </div>

        <div className="form-group">
          <label>Parent Category:</label>
          <select
            name="parentCategory"
            value={formData.parentCategory}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select</option>
            {/* Add options dynamically */}
          </select>
        </div>

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

        <div className="form-group">
          <label>Show Form:</label>
          <input
            type="text"
            name="showForm"
            value={formData.showForm}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label>Add Sub Category:</label>
          <input
            type="checkbox"
            name="addSubCategory"
            checked={formData.addSubCategory}
            onChange={handleInputChange}
            className="form-checkbox"
          />
        </div>

        <div className="form-group">
          <label>Attribute Groups:</label>
          <input
            type="text"
            placeholder="Group Name"
            value={attributeGroup}
            onChange={(e) => setAttributeGroup(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Values (comma-separated)"
            value={attributeValues}
            onChange={(e) => setAttributeValues(e.target.value)}
            className="form-input"
          />
          <button
            type="button"
            onClick={handleAddAttributeGroup}
            className="add-button"
          >
            Add Group
          </button>
        </div>

        <div className="form-group">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategories;
