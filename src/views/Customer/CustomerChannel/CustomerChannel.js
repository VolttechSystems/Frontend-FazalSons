
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import './CustomerChannel.css';
import { Link } from 'react-router-dom';
import { CButton } from '@coreui/react'; 


const CustomerChannel = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    code: '',
    customer_channel: ''
  });
  const [channels, setChannels] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const baseUrl = 'http://195.26.253.123/pos/customer';

  // Fetch channels on component load
  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`${baseUrl}/add_customer_channel`);
      setChannels(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for adding/updating a channel
  const handleAddOrUpdateChannel = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${baseUrl}/action_customer_channel/${editId}/`, formData);
        setChannels(
          channels.map((customer_channel) =>
            customer_channel.id === editId ? { ...customer_channel, ...formData } : customer_channel
          )
        );
      } else {
        const response = await axios.post(`${baseUrl}/add_customer_channel`, formData);
        setChannels([...channels, response.data]);
      }
      setFormData({  customer_channel: '' });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error('Error adding/updating channel:', error);
    }
  };

  // Handle edit button click
  const handleEdit = (id) => {
    const channelToEdit = channels.find((customer_channel) => customer_channel.id === id);
    setFormData({ customer_channel: channelToEdit.customer_channel });
    setIsEditing(true);
    setEditId(id);
  };

  // Handle delete channel
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/action_customer_channel/${id}/`);
      setChannels(channels.filter((customer_channel) => customer_channel.id !== id));
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



      <h2>{isEditing ? 'Edit' : 'Add'} Customer Channel</h2>
      <form onSubmit={handleAddOrUpdateChannel}>

        <div>
          <label>Channel:</label>
          <input
            type="text"
            name="customer_channel"
            value={formData.customer_channel}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
      </form>

      <h3>Customer Channels</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
         
            <th>Channel</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((channel) => (
            <tr key={channel.id}>
              <td>{channel.id}</td>
            
              <td>{channel.customer_channel}</td>
              <td>
                <button onClick={() => handleEdit(channel.id)}>Edit</button>
                <button onClick={() => handleDelete(channel.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerChannel;
