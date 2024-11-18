// src/views/pages/customerType/CustomerType.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import { CButton } from '@coreui/react'; 
import './CustomerType.css';


const CustomerChannel = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    code: '',
    customer_channel: ''
  });
  const [customer_type, setcustomertype] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  

  const baseUrl = 'http://16.171.145.107/pos/customer';

 // Fetch channels on component load
 useEffect(() => {
  fetchTypes();
}, []);

const fetchTypes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/add_customer_type`);
    setcustomertype(response.data);
  } catch (error) {
    console.error('Error fetching channels:', error);
  }
};

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   // Handle form submission for adding/updating a type
   const handleAddOrUpdateType = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${baseUrl}/action_customer_type/${editId}/`, formData);
        setcustomertype(
          customer_type.map((customer_type) =>
            customer_type.id === editId ? { ...customer_type, ...formData } : customer_type
          )
        );
      } else {
        const response = await axios.post(`${baseUrl}/add_customer_type`, formData);
        setTypes([...customer_type, response.data]);
      }
      setFormData({  customer_type: '' });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error('Error adding/updating customer type:', error);
    }
  };

  // Handle edit button click
  const handleEdit = (id) => {
    const channelToEdit = customer_type.find((customer_type) => customer_type.id === id);
    setFormData({ customer_type: channelToEdit.customer_type });
    setIsEditing(true);
    setEditId(id);
  };

  // Handle delete channel
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/action_customer_type/${id}/`);
      setcustomertype(customer_type.filter((customer_type) => customer_type.id !== id));
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };


  return (
    <div>
  <Link to="/Customer/AddCustomer">
    <CButton color="primary" className="me-md-2">
      Back to Add Customer
    </CButton>
  </Link>



      <h2>{isEditing ? 'Edit' : 'Add'} Customer Type</h2>
      <form onSubmit={handleAddOrUpdateType}>

        <div>
          <label>Type:</label>
          <input
            type="text"
            name="customer_type"
            value={formData.customer_type}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
      </form>

      <h3>Customer Types</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customer_type.map((customer_type) => (
            <tr key={customer_type.id}>
              <td>{customer_type.id}</td>
              <td>{customer_type.customer_type}</td>
              <td>
                <button onClick={() => handleEdit(customer_type.id)}>Edit</button>
                <button onClick={() => handleDelete(customer_type.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerChannel;
