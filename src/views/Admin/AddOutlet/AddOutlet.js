import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AddOutlet.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'

const AddOutlet = () => {
  const [formData, setFormData] = useState({
    outlet_code: '',
    outlet_name: '',
    address: '',
    outlet_mobile: '',
    manager_name: '',
    contact_number: '',
  })

  const [outlets, setOutlets] = useState([])
  const [editingOutletId, setEditingOutlet] = useState(null)

  // Get shop_id from local storage
  const shopId = localStorage.getItem('shop_id')

  useEffect(() => {
    fetchOutlets()
  }, [])

  const fetchOutlets = async () => {
    try {
      const shopId = localStorage.getItem('shop_id')
      const response = await Network.get(`${Urls.addOutlets}/${shopId}/`)
      if (response.status === 200) {
        setOutlets(response.data)
      } else {
        console.error('Failed to fetch outlets:', response.data.error)
      }
    } catch (error) {
      console.error('Error fetching outlets:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Submitting the form...')

    try {
      const shopId = localStorage.getItem('shop_id')
      console.log('Shop ID:', shopId)

      const payload = {
        ...formData,
        shop: parseInt(shopId), // Add shop_id to the payload
      }

      console.log('Payload:', payload)

      let response

      if (editingOutletId) {
        console.log('Updating an outlet...')
        response = await Network.put(`${Urls.actionOutlet}/${shopId}/${editingOutletId}/`, payload)
        console.log('Update Response:', response)

        if (response.ok && response.status === 200) {
          toast.success('Outlet updated successfully!')
          setEditingOutlet(null)
        } else {
          // Handle error explicitly if the response is not successful
          handleApiError(response)
        }
      } else {
        console.log('Adding a new outlet...')
        response = await Network.post(`${Urls.addOutlets}/${payload.shop}/`, payload)
        console.log('Add Response:', response)

        if (response.ok && response.status === 201) {
          toast.success('Outlet added successfully!')
        } else {
          // Handle error explicitly if the response is not successful
          handleApiError(response)
        }
      }

      fetchOutlets() // Refresh outlet list
      setFormData({
        outlet_code: '',
        outlet_name: '',
        address: '',
        outlet_mobile: '',
        manager_name: '',
        contact_number: '',
      })
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }

    console.log('Form submission completed.')
  }

  // Helper function to handle API errors
  const handleApiError = (response) => {
    console.error('API Error:', response)

    if (response.data?.non_field_errors) {
      // Handle specific backend validation errors
      toast.error(response.data.non_field_errors.join(', '))
    } else if (response.data?.message) {
      // Handle general error message
      toast.error(response.data.message)
    } else {
      // Generic fallback error
      toast.error('An error occurred while saving the outlet.')
    }
  }

  const handleEdit = (outlet) => {
    setFormData(outlet)
    setEditingOutlet(outlet.id)
  }

  const handleDelete = async (id) => {
    try {
      const shopId = localStorage.getItem('shop_id') // Get shop_id from local storage
      await Network.delete(`${Urls.actionOutlet}/${shopId}/${id}/`)
      toast.success('Outlet deleted successfully!')
      fetchOutlets()
    } catch (error) {
      console.error('Error deleting outlet:', error)
      toast.error('Failed to delete outlet.')
    }
  }

  return (
    <div className="outlet-container">
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

      <form className="outlet-form" onSubmit={handleSubmit}>
        <h2 style={{ fontFamily: 'Times New Roman, serif', textAlign: 'center' }}>
          {editingOutletId ? 'Edit Outlet' : 'Add New Outlet'}
        </h2>
        <div>
          <label>
            Code <span style={{ color: '#0056B3' }}>*</span>
          </label>
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
          <label>
            Name <span style={{ color: '#0056B3' }}>*</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="outlet_name"
            value={formData.outlet_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            Address <span style={{ color: '#0056B3' }}>*</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            Mobile <span style={{ color: '#0056B3', fontSize: '12px' }}>(Optional)</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="outlet_mobile"
            value={formData.outlet_mobile}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Manager Name <span style={{ color: '#0056B3', fontSize: '12px' }}>(Optional)</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="manager_name"
            value={formData.manager_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Phone No. <span style={{ color: '#0056B3', fontSize: '12px' }}>(Optional)</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
          />
        </div>
        <button className="outlet-form-button" type="submit">
          {editingOutletId ? 'Update Outlet' : 'Add Outlet'}
        </button>
      </form>

      {outlets.length > 0 && (
        <table className="outlet-table">
          <thead className="outlet-table-header">
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Address</th>
              <th>Mobile No.</th>
              <th>Manager</th>
              <th>Manager Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="outlet-table-body">
            {outlets.map((outlet) => (
              <tr key={outlet.id}>
                <td className="outlet-table-cell">{outlet.outlet_code}</td>
                <td className="outlet-table-cell">{outlet.outlet_name}</td>
                <td className="outlet-table-cell">{outlet.address}</td>
                <td className="outlet-table-cell">{outlet.outlet_mobile}</td>
                <td className="outlet-table-cell">{outlet.manager_name}</td>
                <td className="outlet-table-cell">{outlet.contact_number}</td>
                <td className="outlet-table-cell outlet-table-actions">
                  <button className="E-button" type="button" onClick={() => handleEdit(outlet)}>
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDelete(outlet.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AddOutlet
