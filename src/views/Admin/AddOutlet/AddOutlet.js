

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddOutlet.css';

const AddOutlet = () => {
  const [formData, setFormData] = useState({
    outlet_code: '',
    outlet_name: ''
  });

  const [outlets, setOutlets] = useState([]);
  const [editingOutletId, setEditingOutlet] = useState(null);

  useEffect(() => {
    // Fetch existing outlets when the component mounts
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    try {
      const response = await axios.get('http://195.26.253.123/pos/products/add_outlet'); // Replace with the actual endpoint for fetching outlets
      setOutlets(response.data); // Adjust based on the response structure
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOutletId) {
        // Update existing outlet
        await axios.put(`http://195.26.253.123/pos/products/action_outlet/${editingOutletId}/`, formData);
        setOutlets(outlets.map(outlet => (outlet.id === editingOutletId ? formData : outlet)));
        setEditingOutlet(null);
      } else {
        // Add new outlet
        await axios.post('http://195.26.253.123/pos/products/add_outlet', formData);
        setOutlets([...outlets, formData]);
      }
      setFormData({ outlet_code: '', outlet_name: '' });
    } catch (error) {
      console.error('Error adding/updating outlet:', error);
    }
  };

  const handleEdit = (outlet) => {
    setFormData(outlet);
    setEditingOutlet(outlet.id); 
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://195.26.253.123/pos/products/action_outlet/${id}/`);
      setOutlets(outlets.filter(outlet => outlet.id !== id)); // Remove deleted outlet from the state
    } catch (error) {
      console.error('Error deleting outlet:', error);
    }
  };

  return (
    <div className="outlet-container">
    <form className="outlet-form" onSubmit={handleSubmit}>
      <h2>{editingOutletId ? 'Edit Outlet' : 'Add New Outlet'}</h2>
      <div>
        <label>Outlet Code:</label>
        <input
          className="outlet-form-input"
          type="text"
          name="outlet_code"
          value={formData.outlet_code}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Outlet Name:</label>
        <input
          className="outlet-form-input"
          type="text"
          name="outlet_name"
          value={formData.outlet_name}
          onChange={handleChange}
          required
        />
      </div>
      <button className="outlet-form-button" type="submit">
        {editingOutletId ? 'Update Outlet' : 'Add Outlet'}
      </button>
    </form>
  
    {/* Outlet Table */}
    {outlets.length > 0 && (
      <table className="outlet-table">
        <thead className="outlet-table-header">
          <tr>
            <th>Outlet Code</th>
            <th>Outlet Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="outlet-table-body">
          {outlets.map((outlet) => (
            <tr key={outlet.id}>
              <td className="outlet-table-cell">{outlet.outlet_code}</td>
              <td className="outlet-table-cell">{outlet.outlet_name}</td>
              <td className="outlet-table-cell outlet-table-actions">
                <button className="E-button" type="button" onClick={() => handleEdit(outlet)}>Edit</button>
                <button className="delete-button" type="button" onClick={() => handleDelete(outlet.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  
  );
};

export default AddOutlet;
