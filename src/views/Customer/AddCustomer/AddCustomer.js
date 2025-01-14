import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AddCustomer.css'

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    dateTime: '',
    customer_channel: '',
    customerType: '',
    first_name: '',
    last_name: '',
    display_name: '',
    gender: '',
    company_name: '',
    email: '',
    mobile_no: '',
    international_no: '',
    landline_no: '',
    password: '',
    address: '',
    shippingAddressSameAsMain: false,
    shipping_address: '',
    city: '',
    zip_code: '',
    province: '',
    country: '',
    internal_note: '',
    image: null,
    online_access: 'no',
    status: 'active',
  })

  const [customers, setCustomers] = useState([])
  const [customerChannels, setCustomerChannels] = useState([])
  const [customerTypes, setCustomerTypes] = useState([])
  const [editingCustomerId, setEditingCustomerId] = useState(null)
  const navigate = useNavigate()
  const apiUrl = 'http://195.26.253.123/pos/customer'

  useEffect(() => {
    fetchCustomers()
    fetchCustomerChannels()
    fetchCustomerTypes()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/add_customer`)
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchCustomerChannels = async () => {
    try {
      const response = await axios.get(`${apiUrl}/add_customer_channel`)
      setCustomerChannels(response.data)
    } catch (error) {
      console.error('Error fetching customer channels:', error)
    }
  }

  const fetchCustomerTypes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/add_customer_type`)
      setCustomerTypes(response.data)
    } catch (error) {
      console.error('Error fetching customer types:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCustomerId) {
        await axios.put(`${apiUrl}/action_customer/${editingCustomerId}/`, formData)
        alert('Customer updated successfully')
      } else {
        await axios.post(`${apiUrl}/add_customer`, formData)
        alert('Customer added successfully')
      }

      setFormData({
        dateTime: '',
        customer_channel: '',
        customerType: '',
        first_name: '',
        last_name: '',
        display_name: '',
        gender: '',
        company_name: '',
        email: '',
        mobile_no: '',
        international_no: '',
        landline_no: '',
        password: '',
        address: '',
        shippingAddressSameAsMain: false,
        shipping_address: '',
        city: '',
        zip_code: '',
        province: '',
        country: '',
        internal_note: '',
        image: null,
        online_access: 'No',
        status: 'active',
      })
      setEditingCustomerId(null)
      fetchCustomers()
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }

  const handleEdit = (customer) => {
    setFormData({
      ...customer,
      shippingAddressSameAsMain: customer.shipping_address === customer.address,
    })
    setEditingCustomerId(customer.id)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/action_customer/${id}/`)
      alert('Customer deleted successfully')
      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

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
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Customer Channel: *</label>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <select
              name="customer_channel"
              value={formData.customer_channel}
              onChange={handleChange}
              required
              style={{ flex: 1, padding: '8px' }}
            >
              <option value="">Select Channel</option>
              {customerChannels.map((channel) => (
                <option key={channel.id} value={channel.customer_channel}>
                  {channel.customer_channel}
                </option>
              ))}
            </select>
            <button
              style={{ padding: '8px' }}
              type="button"
              onClick={() => navigate('/Customer/CustomerChannel')}
            >
              +
            </button>
          </div>
        </div>

        {/* Customer Type */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Customer Type: *</label>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <select
              name="customer_type"
              value={formData.customer_type}
              onChange={handleChange}
              required
              style={{ flex: 1, padding: '8px' }}
            >
              <option value="">Select Type</option>
              {customerTypes.map((type) => (
                <option key={type.id} value={type.customer_type}>
                  {type.customer_type}
                </option>
              ))}
            </select>
            <button
              style={{ padding: '8px' }}
              type="button"
              onClick={() => navigate('/Customer/CustomerType')}
            >
              +
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label>First Name: *</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name: *</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Display Name */}
        <div>
          <label>Display Name:</label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
          />
        </div>

        {/* Gender */}
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="" disabled>
              Select Gender
            </option>{' '}
            {/* Placeholder */}
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Company Name */}
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        {/* Mobile Number */}
        <div>
          <label>Mobile #</label>
          <input
            type="text"
            name="mobile_no"
            value={formData.mobile_no}
            onChange={handleChange}
            required
          />
        </div>

        {/* International Number */}
        <div>
          <label>International #</label>
          <input
            type="text"
            name="international_no"
            value={formData.international_no}
            onChange={handleChange}
          />
        </div>

        {/* Landline Number */}
        <div>
          <label>Landline Number:</label>
          <input
            type="text"
            name="landline_no"
            value={formData.landline_no}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>

        {/* Shipping Address Checkbox */}
        <div>
          <label>
            <input
              type="checkbox"
              name="shippingAddressSameAsMain"
              checked={formData.shippingAddressSameAsMain}
              onChange={(e) => {
                handleChange(e) // Update the checkbox state
                setFormData((prevData) => ({
                  ...prevData,
                  shipping_address: e.target.checked ? prevData.address : '', // Copy address or clear
                }))
              }}
            />
            Shipping Address same as main address
          </label>
        </div>

        {/* Shipping Address */}
        <div>
          <label>Shipping Address:</label>
          <input
            type="text"
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            disabled={formData.shippingAddressSameAsMain}
          />
        </div>
        <div>
          <label>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} />
        </div>

        <div>
          <label>Zip Code:</label>
          <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} />
        </div>

        <div>
          <label>Province:</label>
          <input type="text" name="province" value={formData.province} onChange={handleChange} />
        </div>

        <div>
          <label>Country:</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
        </div>

        <div>
          <label>Internal Note:</label>
          <textarea name="internal_note" value={formData.internal_note} onChange={handleChange} />
        </div>

        <div>
          <label>Image:</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>

        <div>
          <label>Online Access:</label>
          <select name="online_access" value={formData.online_access} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button type="submit">{editingCustomerId ? 'Update Customer' : 'Add Customer'}</button>
      </form>

      <hr />

      {/* Customer Table */}
      <h3>Customer List</h3>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  {customer.first_name} {customer.last_name}
                </td>
                <td>{customer.email}</td>
                <td>{customer.mobile_no}</td>
                <td>{customer.status}</td>
                <td>
                  <button onClick={() => handleEdit(customer)}>Edit</button>
                  <button onClick={() => handleDelete(customer.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AddCustomer
