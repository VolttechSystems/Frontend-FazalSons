import React, { useState, useEffect } from 'react'
import { Network, Urls } from '../../../api-config'
import { Autocomplete, TextField } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './ShopUser.css'

function ShopUser() {
  // State to manage form data
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

  // State to manage shop list, user list, loading state, and messages
  const [editFormData, setEditFormData] = useState(null) // Separate state for editing
  const [showEditModal, setShowEditModal] = useState(false) // Manage Edit Modal visibility
  const [selectedUser, setSelectedUser] = useState({ username: '', user_id: null })
  const [shops, setShops] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false) // Toggle password visibility
  const [usernameStatus, setUsernameStatus] = useState({
    isTaken: null,
    suggestions: [],
  })

  // Fetch shops from the API
  const fetchShops = async () => {
    try {
      const response = await Network.get(Urls.addShops)
      if (response && response.data) {
        setShops(response.data.results || []) // Populate shops data
      }
    } catch (error) {
      console.error('Error fetching shops:', error)
      toast.error('Failed to fetch shops.') // Show error notification
    }
  }

  // Fetch shop users from the API
  const fetchUsers = async () => {
    try {
      const response = await Network.get(Urls.addShopUser)
      if (response && response.data) {
        setUsers(response.data || []) // Populate users data
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users.') // Show error notification
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchShops()
    fetchUsers()
  }, [])

  const handleEditClick = (user) => {
    console.log('Edit button clicked for user:', user) // Debugging: Confirm user data

    // Ensure the user object has all required fields
    if (!user || !user.user_id) {
      console.error('Invalid user data:', user)
      toast.error('Failed to open edit modal. User data is invalid.')
      return
    }

    // Save the selected user object for reference
    setSelectedUser(user)

    // Set the form data for editing
    setEditFormData({
      username: user.username,
      password: '', // Always empty to allow new password input
      phone_number: user.phone_number || '', // Default to empty string if missing
      is_active: user.is_active,
    })

    // Update modal visibility
    setShowEditModal(true)

    // Debug logs after state updates
    console.log('Modal state should now be true.')
    console.log('Edit form data set to:', {
      username: user.username,
      password: '',
      phone_number: user.phone_number || '',
      is_active: user.is_active,
    })
  }

  const handleUpdateUser = async () => {
    const userId = selectedUser.user_id // Retrieve the selected user ID

    if (!userId) {
      toast.error('User ID is missing. Unable to update.')
      return
    }

    const { username, password, phone_number, is_active } = editFormData

    // Construct payload
    const payload = {
      user_id: userId.toString(),
      username,
      phone_number: phone_number || '',
      is_active,
    }

    if (password.trim() !== '') {
      payload.password = password // Include password if not empty
    }

    try {
      const response = await Network.patch(`${Urls.updateShopUser}/${userId}`, payload)

      if (response.ok) {
        toast.success('User updated successfully!')
        setShowEditModal(false) // Close modal
        fetchUsers() // Refresh the user list
      } else {
        console.error('Failed to update user. Response:', response)
        toast.error('Failed to update user.')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('An error occurred while updating the user.')
    }
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update form data dynamically based on input name
    }))
  }

  // Username availability check
  const handleUsernameChange = async (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (value.trim() === '') {
      setUsernameStatus({ isTaken: null, suggestions: [] })
      return
    }

    try {
      const response = await Network.get(`${Urls.checkUsernameAvalability}/?username=${value}`)

      if (response.ok) {
        setUsernameStatus({
          isTaken: response.data.is_taken,
          suggestions: response.data.suggestions || [],
        })
      } else {
        console.error('Error checking username:', response.data.error)
        toast.error('Unable to check username availability. Please try again later.')
      }
    } catch (error) {
      console.error('Error checking username:', error)
      toast.error('Unable to check username availability. Please try again later.')
    }
  }

  // Submit form data to the API
  const handleSubmit = async () => {
    setLoading(true) // Start loading state
    setMessage('') // Reset any previous messages
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
        }) // Reset form fields
        fetchUsers() // Refresh user list
        toast.success('Shop user added successfully!') // Show success notification
      } else {
        setMessage('Failed to add shop user. Please try again.') // Show error message
        toast.error('Failed to add shop user.') // Show error notification
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      setMessage('Error submitting data. Please check your inputs.') // Update error message
      toast.error('Error submitting data. Please check your inputs.') // Show error notification
    } finally {
      setLoading(false) // Stop loading state
    }
  }

  // Handle delete user
  const handleDelete = async (userId) => {
    try {
      const response = await Network.delete(
        `http://195.26.253.123/pos/accounts/delete_user/${userId}`,
      )
      if (response.status === 204) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)) // Remove user from list
        toast.success('User deleted successfully!') // Show success notification
      } else {
        toast.error('Failed to delete user.') // Show error notification
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error deleting user.') // Show error notification
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

      {/* Form Section */}
      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ccc',
          padding: '15px',
          borderRadius: '5px',
        }}
      >
        {/* Username Field with Suggestions */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleUsernameChange}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {usernameStatus.isTaken === true && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              <p>Username is already taken. Suggestions:</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {usernameStatus.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    style={{ cursor: 'pointer', color: 'blue', marginBottom: '5px' }}
                    onClick={() =>
                      setFormData((prevState) => ({
                        ...prevState,
                        username: suggestion,
                      }))
                    }
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {usernameStatus.isTaken === false && (
            <div style={{ color: 'green', marginTop: '10px' }}>Username is available!</div>
          )}
        </div>
        {[
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

        {/* Password Input Section */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            {/* Toggle password visibility */}
            <i
              onClick={() => setShowPassword(!showPassword)}
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
            ></i>
          </div>
        </div>

        {/* Dropdown for is_active */}
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

        {/* Shop selection using Autocomplete */}
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
                backgroundColor: 'white',
                width: '100%',
                padding: '8px',
                marginBottom: '20px',
              }}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
              }}
            />
          )}
          disableClearable
        />

        {/* Submit Button */}
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
        {message && <p style={{ marginTop: '10px', color: 'blue' }}>{message}</p>}
      </div>

      {/* User Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Username</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Phone Number</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Shop</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Is Active</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.username}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.phone_number}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.shop}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {user.is_active ? 'Yes' : 'No'}
                </td>

                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEditClick(user)}
                    style={{
                      backgroundColor: 'green',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
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

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <>
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}></div>
          <div className="modal show">
            <div className="modal-content">
              <h3 className="modal-title">Edit User</h3>

              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  className="modal-input"
                  value={editFormData.username}
                  disabled
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="modal-input"
                  value={editFormData.password || ''}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter new password if needed"
                />
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  className="modal-input"
                  value={editFormData.phone_number || ''}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, phone_number: e.target.value }))
                  }
                />
              </div>

              <div
                className="input-group"
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <label>Is Active</label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={editFormData.is_active || false}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                  }
                />
              </div>

              <div className="modal-buttons">
                <button className="modal-btn modal-update-btn" onClick={handleUpdateUser}>
                  Update
                </button>
                <button
                  className="modal-btn modal-cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ShopUser
