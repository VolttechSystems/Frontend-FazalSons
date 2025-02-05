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
      let response

      if (editingFeeId) {
        // Update existing fee
        response = await Network.put(
          `${Urls.updateAdditionalFee}/${shopId}/${editingFeeId}`,
          formData,
        )

        if (response.status === 200) {
          toast.success('Fee updated successfully.')
          fetchFees(currentPage)
          setEditingFeeId(null)
        } else {
          const errorMessage = response.data?.error || 'Error updating fee. Please try again.'
          toast.error(errorMessage)
        }
      } else {
        // Add new fee
        response = await Network.post(`${Urls.addAdditionalFee}/${shopId}`, formData)

        if (response.status === 201) {
          // Success case for adding a fee
          toast.success('Fee added successfully.')
          setFees((prev) => [...prev, response.data]) // Append the new fee
        } else {
          // Handle validation error or API failure
          const errorMessage =
            response.data?.error || 'The fields shop, fee_name must make a unique set.'
          toast.error(errorMessage)
        }
      }

      // Reset form data
      setFormData({ fee_name: '', shop: shopId })
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.'
      toast.error(errorMessage)
      console.error('Error adding/updating additional fee:', error)
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
    <div className="fee-container">
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
        <h2 style={{fontFamily:'emoji', textAlign:'center', fontSize: '25px'}}>{editingFeeId ? 'Edit Additional Fee' : 'Add New Additional Fee'}</h2>
        <div>
          <label>Fee Type:</label>
          <input
            type="text"
            name="fee_name"
            value={formData.fee_name}
            onChange={handleChange}
            required
            style={{fontFamily:'emoji'}}
          />
        </div>
        <button className="add-fee-button" type="submit" style={{fontFamily:'emoji'}}>
          {editingFeeId ? 'Update Fee' : 'Add Fee'}
        </button>
        {fees.length > 0 ? (
        <>
          <table className="fee-table">
            <thead>
              <tr className="fee-table-header">
                <th style={{fontFamily:'emoji', textAlign:'center'}}>Fee Type</th>
                <th style={{fontFamily:'emoji', textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id}>
                  <td  style={{fontFamily:'emoji', textAlign:'center'}}>{fee.fee_name}</td>
                  <td  style={{fontFamily:'emoji', textAlign:'center'}}>
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

        </>
      ) : (
        <p style={{fontFamily:'emoji', textAlign:'center' , color:'red', fontSize: '20px'}}>No fees found.</p>
      )}
    
      </form>

      {/* Fee Table */}
    </div>
  )
}

export default AdditionalFee
