import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Payment.css'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Payment = () => {
  const [formData, setFormData] = useState({
    pm_name: '',
  })

  const [payments, setPayments] = useState([])
  const [editingPaymentId, setEditingPayment] = useState(null)

  // Fetch shop_id from local storage
  const shopId = localStorage.getItem('shop_id')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await Network.get(`${Urls.addpayment}/${shopId}/`)
      if (response.status === 200) {
        setPayments(response.data)
      } else {
        toast.error(`Error fetching payment methods: ${response.data.error}`)
      }
    } catch (error) {
      toast.error('Network error while fetching payment methods.')
      console.error('Error fetching payment methods:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        shop: parseInt(shopId), // Include shop_id in the payload
      }

      if (editingPaymentId) {
        // Update existing payment method
        const response = await Network.put(
          `${Urls.actionPayment}/${shopId}/${editingPaymentId}/`,
          payload,
        )
        if (response.status === 200) {
          toast.success('Payment method updated successfully!')
          fetchPayments() // Refresh list
        } else {
          toast.error(`Error updating payment method: ${response.data.error}`)
        }
        setEditingPayment(null)
      } else {
        // Add new payment method
        const response = await Network.post(`${Urls.addpayment}/${shopId}/`, payload)
        if (response.status === 201) {
          toast.success('Payment method added successfully!')
          fetchPayments() // Refresh list
        } else {
          toast.error(`The fields shop, pm_name must make a unique set: ${response.data.error}`)
        }
      }

      // Clear the form
      setFormData({ pm_name: '' })
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.'
      toast.error(errorMessage)
      console.error('Error adding/updating payment method:', error)
    }
  }

  const handleEdit = (payment) => {
    setFormData(payment)
    setEditingPayment(payment.id)
    toast.info('Edit mode activated.')
  }

  const handleDelete = async (id) => {
    try {
      const response = await Network.delete(`${Urls.actionPayment}/${shopId}/${id}/`)
      if (response.status === 204) {
        toast.success('Payment method deleted successfully!')
        setPayments(payments.filter((payment) => payment.id !== id)) // Remove from state
      } else {
        toast.error(`Error deleting payment method: ${response.data.error}`)
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred while deleting.'
      toast.error(errorMessage)
      console.error('Error deleting payment method:', error)
    }
  }

  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <form onSubmit={handleSubmit}>
        <h2>{editingPaymentId ? 'Edit Payment Method' : 'Add New Payment Method'}</h2>
        <div>
          <label>Payment Method Name:</label>
          <input
            type="text"
            name="pm_name"
            value={formData.pm_name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">
          {editingPaymentId ? 'Update Payment Method' : 'Add Payment Method'}
        </button>
      </form>

      {/* Payment Methods Table */}
      {payments.length > 0 && (
        <table className="payment-methods-table">
          <thead className="payment-methods-header">
            <tr>
              <th>ID</th>
              <th>Payment Method Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.pm_name}</td>
                <td>
                  <button
                    className="payment-edit-button"
                    type="button"
                    onClick={() => handleEdit(payment)}
                  >
                    Edit
                  </button>
                  <button
                    className="payment-delete-button"
                    type="button"
                    onClick={() => handleDelete(payment.id)}
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

export default Payment
