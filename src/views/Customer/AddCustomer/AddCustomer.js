
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddCustomer.css';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    dateTime: '',
    customerChannel: '',
    customerType: '',
    first_name: '',
    last_name: '',
    displayName: '',
    gender: '',
    companyName: '',
    email: '',
    mobileNumber: '',
    internationalNumber: '',
    landlineNumber: '',
    password: '',
    address: '',
    shippingAddressSameAsMain: false,
    shippingAddress: '',
    shippingCity: '',
    shippingZipCode: '',
    shippingState: '',
    shippingCountry: '',
    internalNote: '',
    avatar: null,
    onlineAccess: 'No',
    status: 'active'
  });
  const [customers, setCustomers] = useState([]);
  const [customerChannels, setCustomerChannels] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const navigate = useNavigate();
  const apiUrl = 'http://16.171.145.107/pos/customer';

  useEffect(() => {
    fetchCustomers();
    fetchCustomerChannels();
    fetchCustomerTypes();
  }, []);

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/add_customer`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Fetch customer channels
  const fetchCustomerChannels = async () => {
    try {
      const response = await axios.get(`${apiUrl}/add_customer_channel`); 
      setCustomerChannels(response.data);
    } catch (error) {
      console.error('Error fetching customer channels:', error);
    }
  };

  // Fetch customer types
  const fetchCustomerTypes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/add_customer_type`); 
      setCustomerTypes(response.data);
    } catch (error) {
      console.error('Error fetching customer types:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomerId) {
        await axios.put(`${apiUrl}/action_customer/${editingCustomerId}/`, formData);
        alert('Customer updated successfully');
      } else {
        await axios.post(`${apiUrl}/add_customer`, formData);
        alert('Customer added successfully');
      }

      setFormData({
        dateTime: '',
        customerChannel: '',
        customerType: '',
        first_name: '',
        last_name: '',
        displayName: '',
        gender: '',
        companyName: '',
        email: '',
        mobileNumber: '',
        internationalNumber: '',
        landlineNumber: '',
        password: '',
        address: '',
        shippingAddressSameAsMain: false,
        shippingAddress: '',
        shippingCity: '',
        shippingZipCode: '',
        shippingState: '',
        shippingCountry: '',
        internalNote: '',
        avatar: null,
        onlineAccess: 'No',
        status: 'active'
      });
      setEditingCustomerId(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingCustomerId(customer.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/action_customer/${id}/`);
      alert('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <h3>{editingCustomerId ? 'Edit Customer' : 'Add Customer'}</h3>

        {/* Date & Time */}
        <div>
          <label>Date & Time:</label>
          <input type="text" value={new Date().toLocaleString()} disabled />
        </div>

        {/* Customer Channel */}
        <div>
          <label>Customer Channel:</label>
          <select name="customerChannel" value={formData.customerChannel} onChange={handleChange}>
            <option value="">Select Channel</option>
            {customerChannels.map((channel) => (
              <option key={channel.id} value={channel.customer_channel}>{channel.customer_channel}</option>
            ))}
          </select>
          <button type="button" onClick={() => navigate('/Customer/CustomerChannel')}>+</button>
        </div>

        {/* Customer Type */}
        <div>
          <label>Customer Type:</label>
          <select name="customerType" value={formData.customerType} onChange={handleChange}>
            <option value="">Select Type</option>
            {customerTypes.map((type) => (
              <option key={type.id} value={type.customer_type}>{type.customer_type}</option>
            ))}
          </select>
          <button type="button" onClick={() => navigate('/Customer/CustomerType')}>+</button>
        </div>

        {/* Full Name */}
        <div>
          <label>First Name:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>

        {/* Display Name */}
        <div>
          <label>Display Name:</label>
          <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} required />
        </div>

        {/* Gender */}
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Company Name */}
        <div>
          <label>Company Name:</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
        </div>

        {/* Email */}
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        {/* Mobile Number */}
        <div>
          <label>Mobile Number:</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
        </div>

        {/* International Number */}
        <div>
          <label>International Number:</label>
          <input type="text" name="internationalNumber" value={formData.internationalNumber} onChange={handleChange} />
        </div>

        {/* Landline Number */}
        <div>
          <label>Landline Number:</label>
          <input type="text" name="landlineNumber" value={formData.landlineNumber} onChange={handleChange} />
        </div>

        {/* Password */}
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        {/* Address */}
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>

        {/* Shipping Address */}
        <div>
          <label>
            <input
              type="checkbox"
              name="shippingAddressSameAsMain"
              checked={formData.shippingAddressSameAsMain}
              onChange={handleChange}
            />
            Shipping Address same as main address
          </label>
        </div>
        <div>
          <label>Shipping Address:</label>
          <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} />
        </div>
        <div>
          <label>Shipping City:</label>
          <input type="text" name="shippingCity" value={formData.shippingCity} onChange={handleChange} />
        </div>
        <div>
          <label>Shipping Zip Code:</label>
          <input type="text" name="shippingZipCode" value={formData.shippingZipCode} onChange={handleChange} />
        </div>
        <div>
          <label>Shipping State:</label>
          <input type="text" name="shippingState" value={formData.shippingState} onChange={handleChange} />
        </div>
        <div>
          <label>Shipping Country:</label>
          <input type="text" name="shippingCountry" value={formData.shippingCountry} onChange={handleChange} />
        </div>

        {/* Internal Note */}
        <div>
          <label>Internal Note:</label>
          <textarea name="internalNote" value={formData.internalNote} onChange={handleChange}></textarea>
        </div>

        {/* Avatar */}
        <div>
          <label>Avatar:</label>
          <input type="file" name="avatar" onChange={handleChange} />
        </div>

        {/* Online Access */}
        <div>
          <label>Online Access:</label>
          <select name="onlineAccess" value={formData.onlineAccess} onChange={handleChange}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">{editingCustomerId ? 'Update Customer' : 'Add Customer'}</button>
      </form>

      {/* Customer Table */}
      <h3>Customer List</h3>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.email}</td>
              <td>
                <button onClick={() => handleEdit(customer)}>Edit</button>
                <button onClick={() => handleDelete(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddCustomer;
