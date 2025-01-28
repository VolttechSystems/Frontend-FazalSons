import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import './RegisterUser.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'

function RegisterUser() {
  const [systemRoles, setSystemRoles] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [outlets, setOutlets] = useState([]) // Outlet data
  const [usernameStatus, setUsernameStatus] = useState({ isTaken: null, suggestions: [] }) // For username availability
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
    phone_number: '',
    is_active: true,
    system_roles: [],
    outlet: [],
    is_superuser: false,
  })
  // const [editFormData, setEditFormData] = useState(null) // New state for edit modal
  const [userList, setUserList] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState({ username: '', user_id: null })
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordErrors, setNewPasswordErrors] = useState([]) // Declare the state for errors
  const [passwordChangeMessage, setPasswordChangeMessage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)
  const { userOutlets } = useAuth()

  const fetchSystemRoles = async () => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.get(`${Urls.fetchSystemRoles}${shopId}`)
    // const response = await Network.get(Urls.fetchSystemRoles)

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

  useEffect(() => {
    fetchSystemRoles()
    fetchUsers(currentPage)
  }, [currentPage])

  const fetchOutlets = async () => {
    try {
      const shopId = localStorage.getItem('shop_id') // Assuming the shop ID is stored as 'shopId'

      const response = await Network.get(`${Urls.fetchAllOutlets}${shopId}/`)

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

  // Username availability check
  const handleUsernameChange = async (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

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

  // Handle multi-select change for outlets
  const handleOutletChange = (selectedOptions) => {
    const selectedOutlets = selectedOptions ? selectedOptions : []
    setFormData({ ...formData, outlet: selectedOutlets }) // Save full outlet objects in the state
  }
  const handleEditOutletChange = (selectedOptions) => {
    const selectedOutlets = selectedOptions ? selectedOptions : []
    setEditFormData({ ...editFormData, outlet: selectedOutlets }) // Save full outlet objects in the state
  }

  useEffect(() => {
    fetchOutlets() // Fetch outlets separately
  }, [])

  const fetchUsers = async (page = 0) => {
    const shopId = localStorage.getItem('shop_id')
    try {
      const response = await Network.get(
        `${Urls.registerUser}${shopId}?page=${page}&pageSize=${pageSize}`,
      )
      if (response.ok) {
        setUserList(response.data.results)
        setTotalPages(Math.ceil(response.data.count / pageSize))
      } else {
        console.error('Error fetching users:', response.data.error)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // const handleEditClick = (user) => {
  //   setSelectedUser(user) // The user object must have the `id` field
  //   setFormData({
  //     username: user.username,

  //     password: '',
  //     phone_number: user.phone_number || '',
  //     is_active: user.is_active,
  //     system_roles: user.system_roles.map((role) => role.id),
  //     outlet: user.outlet.map((out) => ({
  //       value: out.id,
  //       label: out.outlet_name,
  //     })),
  //   })
  //   setShowEditModal(true)
  // }
  // const handleEditClick = (user) => {
  //   setSelectedUser(user) // Set the selected user
  //   setEditFormData({
  //     username: user.username,
  //     password: '',
  //     phone_number: user.phone_number || '',
  //     is_active: user.is_active,
  //     system_roles: user.system_roles.map((role) => ({
  //       id: role.id, // Map id
  //       sys_role_name: role.sys_role_name, // Map sys_role_name
  //     })), // Preserve the structure for system_roles
  //     outlet: user.outlet.map((out) => ({
  //       value: out.id,
  //       label: out.outlet_name,
  //     })), // Map outlet for Select component
  //   })
  //   setShowEditModal(true)
  // }

  // const handleUpdateUser = async () => {
  //   const shopId = localStorage.getItem('shop_id')
  //   const userId = selectedUser.user_id

  //   if (!userId) {
  //     toast.error('User ID is missing. Unable to update.')
  //     return
  //   }

  //   const { username, phone_number, is_active, system_roles, outlet, password } = editFormData

  //   const payload = {
  //     user_id: userId.toString(),
  //     username,
  //     phone_number: phone_number || '',
  //     is_active,
  //     system_roles: system_roles.map((role) => role.id),
  //     outlet: outlet.map((out) => out.value),
  //     shop: shopId.toString(),
  //   }

  //   if (password.trim() !== '') {
  //     payload.password = password
  //   }

  //   try {
  //     const response = await Network.patch(
  //       `${Urls.registerUserUpdate}/${shopId}/${userId}`,
  //       payload,
  //     )
  //     if (response.ok) {
  //       toast.success('User updated successfully!')
  //       setShowEditModal(false)
  //       fetchUsers()
  //     } else {
  //       toast.error('Failed to update user.')
  //     }
  //   } catch (error) {
  //     toast.error('An error occurred while updating the user.')
  //   }
  // }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const shopId = localStorage.getItem('shop_id')
    const { outlet, username, password, ...restFormData } = formData
    const selectedOutlets = outlet.map((outlet) => outlet.value)

    const payload = {
      ...restFormData,
      username: formData.username,
      password: formData.password,
      outlet: selectedOutlets,
      shop: shopId,
    }
    console.log('payload-----------------', payload)

    try {
      const response = await Network.post(`${Urls.registerUser}${shopId}`, payload)
      if (response.ok) {
        toast.success('User registered successfully!')
        fetchUsers(currentPage)
        setFormData({
          first_name: '',
          last_name: '',
          username: '',
          password: '',
          email: '',
          phone_number: '',
          is_active: true,
          system_roles: [],
          outlet: [],
          is_superuser: false,
        })
      } else {
        if (response.data.username) {
          toast.error(response.data.username[0])
        } else {
          toast.error('Failed to register user. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error registering user:', error)
      toast.error('An error occurred while registering the user.')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 0 && page <= totalPages) {
      setCurrentPage(page)
    }
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
            onChange={handleUsernameChange}
            required
          />
          {usernameStatus.isTaken === true && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              <p>Username is already taken. Suggestions:</p>
              <ul className="suggestions-list">
                {usernameStatus.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => setFormData({ ...formData, username: suggestion })}
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
        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between "text" and "password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                console.log(`${e.target.name}:`, e.target.value)
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }}
              // required
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
          {userList.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                {user.system_roles.map((role) => role.sys_role_name).join(', ') || 'No Roles'}
              </td>
              <td>{user.outlet.map((out) => out.outlet_name).join(', ') || 'No Outlets'}</td>
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
          ))}{' '}
        </tbody>
      </table>
      <div
        className="pagination"
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}
      >
        <button
          style={{ padding: '5px 10px', marginRight: '5px' }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          style={{ padding: '5px 10px' }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {showEditModal && (
        <div className="modal show">
          <div className="modal-content">
            <h3>Edit User</h3>
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" value={editFormData.username} disabled />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={editFormData.password}
                onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                placeholder="Enter new password if needed"
              />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={editFormData.phone_number}
                onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Is Active</label>
              <input
                type="checkbox"
                name="is_active"
                checked={editFormData.is_active}
                onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
              />
            </div>
            <div className="input-group">
              <label>System Roles</label>
              <Select
                isMulti
                name="system_roles"
                options={systemRoles} // Available roles to select
                value={editFormData.system_roles.map((role) => ({
                  value: role.id, // Map id to value
                  label: role.sys_role_name, // Map sys_role_name to label
                }))}
                onChange={(selectedOptions) =>
                  setEditFormData({
                    ...editFormData,
                    system_roles: selectedOptions.map((option) => ({
                      id: option.value, // Map value back to id
                      sys_role_name: option.label, // Map label back to sys_role_name
                    })),
                  })
                }
                placeholder="Select roles"
              />
            </div>

            <div className="input-group">
              <label>Outlets</label>
              <Select
                isMulti
                name="outlet"
                options={outlets.map((outlet) => ({
                  value: outlet.id,
                  label: outlet.outlet_name,
                  outlet_code: outlet.outlet_code, // Include other outlet data if needed
                }))}
                onChange={handleEditOutletChange}
                value={editFormData.outlet} // formData.outlet should be an array of full outlet objects
                placeholder="Select outlets"
              />
            </div>
            <div className="modal-buttons" style={{ marginTop: '10px', textAlign: 'center' }}>
              <button
                onClick={handleUpdateUser}
                style={{
                  backgroundColor: 'green', // Green background
                  color: 'white', // White text
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px', // Add spacing between buttons
                }}
              >
                Update
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  backgroundColor: 'red', // Red background
                  color: 'white', // White text
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
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
