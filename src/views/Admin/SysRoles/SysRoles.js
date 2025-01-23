import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './SysRole.css'
import { Network, Urls } from '../../../api-config'

const SysRoles = () => {
  const [permissions, setPermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [roleName, setRoleName] = useState('')
  const [status, setStatus] = useState('Active')
  const [roles, setRoles] = useState([])
  const [editingRoleId, setEditingRoleId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1) // Current page
  const [totalPages, setTotalPages] = useState(1) // Total pages
  const [pageSize] = useState(10) // Number of roles per page

  useEffect(() => {
    fetchPermissions()
    fetchRoles(currentPage) // Fetch roles for the current page
  }, [currentPage])

  const fetchPermissions = async () => {
    try {
      const response = await Network.get(Urls.getAllPermissions)
      if (!response.ok) {
        console.error('Error fetching permissions:', response.data.error)
        return
      }

      const permissionOptions = response.data.map((permission) => ({
        value: permission.id,
        label: permission.permission_name,
      }))
      setPermissions(permissionOptions)
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }

  const fetchRoles = async (page = 0) => {
    const shopId = localStorage.getItem('shop_id') // Retrieve shop_id from localStorage
    if (!shopId) {
      console.error('Shop ID is missing in localStorage.')
      alert('Shop ID not found. Please log in again.')
      return
    }

    const starting = page // Map the page number to the Starting parameter

    try {
      // Make the API call with shop_id, Starting, and limit
      const response = await Network.get(
        `${Urls.addSystemRoles}${shopId}?Starting=${starting}&limit=${pageSize}`,
      )

      if (!response.ok) {
        console.error('Error fetching roles:', response.data.error)
        return
      }

      const data = response.data
      console.log('Roles data:', data)

      setRoles(data.results) // Update roles with paginated results
      setTotalPages(data.total_pages || Math.ceil(data.total_count / pageSize)) // Compute total pages if not provided
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const handleAddOrEditRole = async () => {
    const shopId = localStorage.getItem('shop_id') // Retrieve shop_id from localStorage
    if (!shopId) {
      console.error('Shop ID is missing in localStorage.')
      alert('Shop ID not found. Please log in again.')
      return
    }

    const selectedPermissionIDs = selectedPermissions.map((permission) => permission.value)

    const requestData = {
      sys_role_name: roleName,
      status: status.toLowerCase(),
      permissions: selectedPermissionIDs,
      shop: shopId, // Include the shop field in the request payload
    }

    const url = editingRoleId
      ? `${Urls.updateSystemRoles}/${shopId}/${editingRoleId}/`
      : `${Urls.addSystemRoles}${shopId}`

    const method = editingRoleId ? 'put' : 'post'

    try {
      const response = await Network[method](url, requestData)

      if (!response.ok) {
        console.error('Error adding/updating role:', response.data.error)
        return toast.error('Failed to add/update role.')
      }

      toast.success(editingRoleId ? 'Role updated successfully!' : 'Role added successfully!')
      fetchRoles(currentPage)
      clearForm()
    } catch (error) {
      console.error('Error adding/updating role:', error)
    }
  }

  const clearForm = () => {
    setEditingRoleId(null)
    setRoleName('')
    setSelectedPermissions([])
    setStatus('Active')
  }

  const handlePageChange = (page) => {
    if (page >= 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleEdit = (role) => {
    setEditingRoleId(role.id)
    setRoleName(role.sys_role_name)
    setStatus(role.status === 'active' ? 'Active' : 'Inactive')

    const preselectedPermissions = role.permissions.map((perm) => ({
      value: perm.id,
      label: perm.permission_name,
    }))
    setSelectedPermissions(preselectedPermissions)
  }

  const handleDelete = async (id) => {
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      console.error('Shop ID is missing in localStorage.')
      return
    }

    try {
      const response = await Network.delete(`${Urls.updateSystemRoles}/${shopId}/${id}/`)
      if (!response.ok) {
        console.error('Error deleting role:', response.data.error)
        return toast.error('Failed to delete role.')
      }

      toast.success('Role deleted successfully!')
      fetchRoles(currentPage)
    } catch (error) {
      console.error('Error deleting role:', error)
    }
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
      <h2>System Roles</h2>

      <div>
        <label htmlFor="roleName">Name:</label>
        <input
          type="text"
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Enter role name"
        />
      </div>

      <div>
        <label>Status:</label>
        <label>
          <input
            type="radio"
            value="Active"
            checked={status === 'Active'}
            onChange={(e) => setStatus(e.target.value)}
          />
          Active
        </label>
        <label>
          <input
            type="radio"
            value="Inactive"
            checked={status === 'Inactive'}
            onChange={(e) => setStatus(e.target.value)}
          />
          Inactive
        </label>
      </div>

      <div>
        <label>Permissions:</label>
        <Select
          options={permissions}
          isMulti
          value={selectedPermissions}
          onChange={(selected) => setSelectedPermissions(selected || [])}
        />
      </div>

      <button className="add-edit-role-btn" onClick={handleAddOrEditRole}>
        {editingRoleId ? 'Update Role' : 'Add Role'}
      </button>
      <button className="clear-role-btn" onClick={clearForm}>
        Clear
      </button>

      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Status</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((role) => (
              <tr key={role.id}>
                <td>{role.sys_role_name}</td>
                <td>{role.status}</td>
                <td>
                  {role.permissions &&
                    role.permissions.map((permission) => permission.permission_name).join(', ')}
                </td>
                <td>
                  <button onClick={() => handleEdit(role)}>Edit</button>
                  <button onClick={() => handleDelete(role.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No roles available.</td>
            </tr>
          )}
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
    </div>
  )
}

export default SysRoles
