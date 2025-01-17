import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import './RegisterUser.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'
import { Autocomplete, TextField } from '@mui/material'

function RegisterUser() {
  const [systemRoles, setSystemRoles] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [outlets, setOutlets] = useState([]) // Outlet data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
    phone_number: '',
    is_staff: false,
    is_active: true,
    system_roles: [],
    outlet: [], // Updated to handle multiple outlets
    is_superuser: false,
  })
  const [userList, setUserList] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState({ username: '', user_id: null })
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordErrors, setNewPasswordErrors] = useState([]) // Declare the state for errors
  const [passwordChangeMessage, setPasswordChangeMessage] = useState(null)
  const { userOutlets } = useAuth()

  useEffect(() => {
    const fetchSystemRoles = async () => {
      const response = await Network.get(Urls.fetchSystemRoles)

      if (!response.ok) {
        console.log('Error fetching system roles:', response.data.error)
        return
      }

      const roles = response.data.map((role) => ({
        value: role.id,
        label: role.sys_role_name,
      }))

      setSystemRoles(roles)
    }

    fetchSystemRoles()
    fetchUsers() // Fetch existing users from backend
  }, [])

  const fetchOutlets = async () => {
    try {
      const response = await Network.get(Urls.fetchAllOutlets)

      if (!response.ok) {
        console.error('Failed to fetch outlets:', response.data.error)
        return
      }

      const outlets = response.data
        .map((outlet) => {
          if (userOutlets.some((o) => o.id === outlet.id)) {
            return outlet
          }
          return null
        })
        .filter((outlet) => outlet !== null)

      setOutlets(outlets) // Store filtered outlets in the state
    } catch (error) {
      console.error('Error fetching outlets:', error)
    }
  }

  // Handle multi-select change for outlets
  const handleOutletChange = (selectedOptions) => {
    const selectedOutlets = selectedOptions ? selectedOptions : []
    setFormData({ ...formData, outlet: selectedOutlets }) // Save full outlet objects in the state
  }

  useEffect(() => {
    fetchOutlets() // Fetch outlets separately
  }, [])

  const fetchUsers = () => {
    Network.get(Urls.registerUser)
      .then((response) => {
        console.log('Fetched Users Data:', response.data) // Debug log
        if (Array.isArray(response.data)) {
          setUserList(response.data) // Directly use response.data as it is an array
        } else {
          console.error('Unexpected data format:', response.data)
        }
      })
      .catch((error) => {
        console.log('Error fetching users:', error)
      })
  }

  const handleEditClick = (user) => {
    console.log('Edit user clicked:', user) // Debugging
    setSelectedUser({ username: user.username, user_id: user.id, system_roles: user.system_roles })
    setShowEditModal(true)
  }

  const handlePasswordChange = () => {
    const payload = {
      user_id: selectedUser.user_id,
      new_password: newPassword,
    }

    // Clear previous errors before making the request
    setNewPasswordErrors([])

    // Make the API request
    Network.post(Urls.passwordChange, payload)
      .then((response) => {
        console.log('Response from backend:', response) // Log the response

        // Check if there's a success message
        if (response.data && response.data.message) {
          setPasswordChangeMessage(response.data.message) // Set success message
          setShowEditModal(false) // Close the modal after successful password change
          setNewPassword('') // Reset the password field
        }
      })
      .catch((error) => {
        console.error('Error changing password:', error) // Log error

        // Check if error response contains errors for the new_password field
        if (error.response && error.response.data) {
          const backendErrors = error.response.data
          console.log('Backend Errors:', backendErrors) // Log backend errors

          // If there are errors related to new_password, update the state
          if (backendErrors.new_password) {
            setNewPasswordErrors(backendErrors.new_password) // Set errors to display
          }
        } else {
          // Handle unexpected errors here
          toast.error('An unexpected error occurred while changing the password.')
        }
      })
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev) // Toggle password visibility
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  // Handle multi-select change
  const handleMultiSelectChange = (selectedOptions) => {
    const selectedRoles = selectedOptions ? selectedOptions.map((option) => option.value) : []
    setFormData({
      ...formData,
      system_roles: selectedRoles,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Prepare the form data for submission
    const { outlet, ...restFormData } = formData

    // Only outlet IDs should be sent in the payload
    const selectedOutlets = outlet.map((outlet) => outlet.value) // Extract the outlet IDs

    const payload = {
      ...restFormData,
      outlet: selectedOutlets, // Send only the outlet IDs in the payload
    }

    Network.post(Urls.registerUser, payload)
      .then((response) => {
        console.log('User registered successfully:', response)
        fetchUsers() // Refresh user list after successful submission
        toast.success('User registered successfully!') // Success toast for user registration
        setFormData({
          first_name: '',
          last_name: '',
          username: '',
          password: '',
          email: '',
          phone_number: '',
          is_staff: false,
          is_active: true,
          system_roles: [],
          outlet: [], // Reset outlet selection
          is_superuser: false,
        })
      })
      .catch((error) => {
        // Check if the error response has a specific message for username already exists
        if (error.response && error.response.data) {
          // If username already exists, show specific error
          if (error.response.data.username) {
            toast.error(error.response.data.username[0]) // Show the error message
          } else {
            toast.error('Failed to register user. Please try again.')
          }
        } else {
          toast.error('An error occurred while registering the user.')
        }

        console.log('Error registering user:', error) // Log the error for debugging
      })
  }

  const handleDelete = (userId) => {
    Network.delete(`${Urls.deleteUser}/${userId}`)
      .then((response) => {
        console.log('User deleted successfully:', response)
        fetchUsers() // Refresh the user list
      })
      .catch((error) => console.error('Error deleting user:', error))
  }

  return (
    <div className="container">
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
      {passwordChangeMessage && (
        <div className="alert alert-success" role="alert">
          {passwordChangeMessage}
        </div>
      )}
      <h2>Register User</h2>
      <form className="form" onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="input-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between "text" and "password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
            <span
              className="toggle-password"
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            >
              <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>{' '}
              {/* Professional Eye Icon */}
            </span>
          </div>
        </div>

        {/* Show password validation errors */}
        {newPasswordErrors.length > 0 && (
          <div className="password-errors">
            {newPasswordErrors.map((error, index) => (
              <p key={index} className="error-message">
                {error}
              </p>
            ))}
          </div>
        )}

        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>
            Is Staff
            <input
              type="checkbox"
              name="is_staff"
              checked={formData.is_staff}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="input-group">
          <label>
            Is Active
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="input-group">
          <label>System Roles</label>
          <Select
            isMulti
            name="system_roles"
            options={systemRoles}
            onChange={handleMultiSelectChange}
            value={systemRoles.filter((role) => formData.system_roles.includes(role.value))}
            placeholder="Select roles"
          />
        </div>
        <div>
          <label>Outlet:</label>

          <Select
            isMulti
            name="outlet"
            options={outlets.map((outlet) => ({
              value: outlet.id,
              label: outlet.outlet_name,
              outlet_code: outlet.outlet_code, // Include other outlet data if needed
            }))}
            onChange={handleOutletChange}
            value={formData.outlet} // formData.outlet should be an array of full outlet objects
            placeholder="Select outlets"
          />
        </div>

        <button className="addUser-button1" type="submit">
          Add User
        </button>
      </form>

      {/* User Table */}

      <h3 className="user-table-title">Registered Users</h3>
      <table className="user-table">
        <thead className="user-table-header">
          <tr>
            <th className="user-table-header-item">Username</th>
            <th className="user-table-header-item">Status</th>
            <th className="user-table-header-item">System Roles</th>
            <th className="user-table-header-item">Outlets</th>
            <th className="user-table-header-item">Actions</th>
          </tr>
        </thead>

        <tbody>
          {userList.length > 0 ? (
            userList.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                  {user.system_roles.length > 0
                    ? user.system_roles.map((role) => role.sys_role_name).join(', ')
                    : 'No Roles'}
                </td>
                <td>
                  {user.outlet.length > 0
                    ? user.outlet.map((outlet) => outlet.outlet_name).join(', ')
                    : 'No Outlet'}
                </td>
                <td>
                  <button onClick={() => handleEditClick(user)} className="edit-button1">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)} // Pass user ID dynamically
                    className="del-button1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showEditModal && selectedUser && (
        <div className="modal show">
          <div className="modal-content">
            <h3 className="modal-title">Change Password</h3>
            <p className="modal-username">
              Username: <strong>{selectedUser.username}</strong>
            </p>
            <p className="modal-roles">
              System Roles:{' '}
              <strong>
                {selectedUser.system_roles && selectedUser.system_roles.length > 0
                  ? selectedUser.system_roles.map((role, index) => (
                      <span key={index}>
                        {role.sys_role_name}
                        {index < selectedUser.system_roles.length - 1 && ', '}
                      </span>
                    ))
                  : 'No roles assigned'}
              </strong>
            </p>

            <input
              type="password"
              className="modal-input"
              id="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {/* Display password validation errors */}
            {newPasswordErrors.length > 0 && (
              <div className="password-errors">
                {newPasswordErrors.map((error, index) => (
                  <p key={index} className="error-message">
                    {error}
                  </p>
                ))}
              </div>
            )}

            <div className="modal-buttons">
              <button className="modal-btn modal-update-btn" onClick={handlePasswordChange}>
                Update Password
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
      )}
    </div>
  )
}

export default RegisterUser
