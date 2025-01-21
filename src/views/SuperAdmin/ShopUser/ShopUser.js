import React, { useState, useEffect } from 'react'
import { Network, Urls } from '../../../api-config'
import { Autocomplete, TextField } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ShopUser() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    email: '',
    is_active: '',
    shop: '',
  })

  const [shops, setShops] = useState([])
  const [users, setUsers] = useState([]) // Holds the user data
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch shops from the API
  const fetchShops = async () => {
    try {
      const response = await Network.get(Urls.addShops)
      if (response && response.data) {
        setShops(response.data.results || [])
      }
    } catch (error) {
      console.error('Error fetching shops:', error)
      toast.error('Failed to fetch shops.')
    }
  }

  // Fetch shop users from the API
  const fetchUsers = async () => {
    try {
      const response = await Network.get(Urls.addShopUser)
      if (response && response.data) {
        setUsers(response.data || []) // Assuming the data is an array
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users.')
    }
  }

  useEffect(() => {
    fetchShops()
    fetchUsers()
  }, [])

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Submit form data to the API
  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await Network.post(Urls.addShopUser, formData)
      if (response.status === 201) {
        setFormData({
          username: '',
          password: '',
          phone_number: '',
          first_name: '',
          last_name: '',
          email: '',
          is_active: '',
          shop: '',
        })

        // Option 1: Fetch updated users from the API
        fetchUsers()

        // Option 2: Add new user directly (if API response includes the new user data)
        // setUsers((prevUsers) => [...prevUsers, response.data]);

        toast.success('Shop user added successfully!')
      } else {
        setMessage('Failed to add shop user. Please try again.')
        toast.error('Failed to add shop user.')
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      setMessage('Error submitting data. Please check your inputs.')
      toast.error('Error submitting data. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Create Shop User</h1>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ccc',
          padding: '15px',
          borderRadius: '5px',
        }}
      >
        {/* Input fields */}
        {[
          { label: 'Username', name: 'username', type: 'text' },
          { label: 'Password', name: 'password', type: 'password' },
          { label: 'Phone Number', name: 'phone_number', type: 'text' },
          { label: 'First Name', name: 'first_name', type: 'text' },
          { label: 'Last Name', name: 'last_name', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
        ].map((field) => (
          <div key={field.name}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
        ))}

        {/* Is Active dropdown */}
        <label style={{ display: 'block', marginBottom: '5px' }}>Is Active:</label>
        <select
          name="is_active"
          value={formData.is_active}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>

        {/* Shop dropdown using Autocomplete */}
        <label style={{ display: 'block', marginBottom: '5px' }}>Shop:</label>
        <Autocomplete
          name="shop"
          value={shops.find((shop) => shop.id === formData.shop) || null}
          onChange={(event, newValue) => {
            handleChange({
              target: { name: 'shop', value: newValue ? newValue.id : '' },
            })
          }}
          options={shops}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              style={{
                backgroundColor: 'white', // White background
                width: '100%',
                padding: '8px',
                marginBottom: '20px', // Increased space below the field
              }}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true, // Disable the underline that can cause double borders
              }}
            />
          )}
          disableClearable
        />

        {/* Submit button */}
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add User'}
        </button>

        {/* Message */}
        {message && <p style={{ marginTop: '10px', color: 'blue' }}>{message}</p>}
      </div>

      {/* User Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Username</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Phone Number</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Is Active</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.username}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.phone_number}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {user.is_active ? 'Yes' : 'No'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}
              >
                No users available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ShopUser
