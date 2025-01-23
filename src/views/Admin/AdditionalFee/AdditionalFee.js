import React, { useState, useEffect } from 'react'
import './AdditionalFee.css'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AdditionalFee = () => {
  const [formData, setFormData] = useState({
    fee_name: '',
    shop: '', // Include shop in formData
  })

  const [fees, setFees] = useState([]) // Initialize as an empty array
  const [editingFeeId, setEditingFeeId] = useState(null)
  const [currentPage, setCurrentPage] = useState(0) // Start from page 0
  const [totalPages, setTotalPages] = useState(1) // Total pages
  const [pageSize] = useState(10) // Items per page

  useEffect(() => {
    const shopId = localStorage.getItem('shop_id')
    if (shopId) {
      setFormData((prev) => ({ ...prev, shop: shopId })) // Set shop in formData
    } else {
      console.error('Shop ID not found in local storage.')
    }
    fetchFees(currentPage)
  }, [currentPage])

  const fetchFees = async (page = 0) => {
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      console.error('Shop ID not found in local storage.')
      return
    }

    try {
      const response = await Network.get(
        `${Urls.addAdditionalFee}/${shopId}?Starting=${page}&limit=${pageSize}`,
      )
      if (response && response.data && Array.isArray(response.data)) {
        setFees(response.data) // Ensure data is an array
        setTotalPages(Math.ceil(response.data.length / pageSize)) // Update total pages
      } else {
        console.error('Error fetching fees: Invalid response')
        setFees([]) // Reset fees in case of an error
      }
    } catch (error) {
      console.error('Error fetching fees:', error)
      setFees([]) // Reset fees in case of an error
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      console.error('Shop ID not found in local storage.')
      return
    }

    try {
      if (editingFeeId) {
        // Update existing fee
        await Network.put(`${Urls.updateAdditionalFee}/${shopId}/${editingFeeId}`, formData)
        toast.success('Fee updated successfully.')
        setEditingFeeId(null)
      } else {
        // Add new fee
        const response = await Network.post(`${Urls.addAdditionalFee}/${shopId}`, formData)
        if (response && response.data) {
          toast.success('Fee added successfully.')
          setFees((prev) => [...prev, response.data]) // Append the new fee
        } else {
          toast.error('Failed to add fee.')
        }
      }
      setFormData({ fee_name: '', shop: shopId })
      fetchFees(currentPage) // Refetch fees to include the new/updated data
    } catch (error) {
      toast.error('An error occurred while adding/updating the fee.')
      console.error('Error adding/updating fee:', error)
    }
  }

  const handleEdit = (fee) => {
    setFormData({ fee_name: fee.fee_name, shop: fee.shop })
    setEditingFeeId(fee.id)
  }

  const handleDelete = async (id) => {
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      console.error('Shop ID not found in local storage.')
      return
    }

    try {
      await Network.delete(`${Urls.updateAdditionalFee}/${shopId}/${id}`)
      toast.success('Fee deleted successfully.')
      fetchFees(currentPage) // Refetch fees to remove the deleted data
    } catch (error) {
      toast.error('An error occurred while deleting the fee.')
      console.error('Error deleting fee:', error)
    }
  }

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
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
        <h2>{editingFeeId ? 'Edit Additional Fee' : 'Add New Additional Fee'}</h2>
        <div>
          <label>Fee Type:</label>
          <input
            type="text"
            name="fee_name"
            value={formData.fee_name}
            onChange={handleChange}
            required
          />
        </div>
        <button className="add-fee-button" type="submit">
          {editingFeeId ? 'Update Fee' : 'Add Fee'}
        </button>
      </form>

      {/* Fee Table */}
      {fees.length > 0 ? (
        <>
          <table className="fee-table">
            <thead>
              <tr className="fee-table-header">
                <th>Fee Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id}>
                  <td>{fee.fee_name}</td>
                  <td>
                    <button
                      className="edit-fee-button"
                      type="button"
                      onClick={() => handleEdit(fee)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-fee-button"
                      type="button"
                      onClick={() => handleDelete(fee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className="pagination"
            style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}
          >
            <button
              style={{
                padding: '5px 10px',
                marginRight: '5px',
                backgroundColor: '#007BFF', // Blue background
                color: 'white', // White text
                border: 'none', // Remove border
                borderRadius: '4px', // Rounded corners
                cursor: 'pointer',
              }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <button
              style={{
                padding: '5px 10px',
                backgroundColor: '#007BFF', // Blue background
                color: 'white', // White text
                border: 'none', // Remove border
                borderRadius: '4px', // Rounded corners
                cursor: 'pointer',
              }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No fees found.</p>
      )}
    </div>
  )
}

export default AdditionalFee
