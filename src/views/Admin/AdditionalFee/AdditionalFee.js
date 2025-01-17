import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AdditionalFee.css' // Create a CSS file for styling if needed
import { Network, Urls } from '../../../api-config'

const AdditionalFee = () => {
  const [formData, setFormData] = useState({
    fee_name: '',
  })

  const [fees, setFees] = useState([])
  const [editingFeeId, setEditingFeeId] = useState(null)

  // useEffect(() => {
  //   // Fetch existing fees when the component mounts
  //   fetchFees();
  // }, []);

  // const fetchFees = async () => {
  //   try {
  //     const response = await axios.get('http://195.26.253.123/pos/transaction/add_additional_fee'); // Replace with the actual endpoint for fetching fees
  //     setFees(response.data); // Adjust based on the response structure
  //   } catch (error) {
  //     console.error('Error fetching fees:', error);
  //   }
  // };

  useEffect(() => {
    // Fetch existing fees when the component mounts
    fetchFees()
  }, [])

  const fetchFees = async () => {
    try {
      const response = await Network.get(Urls.addAdditionalFee) // Use Network.get with the correct endpoint
      setFees(response.data) // Adjust based on the response structure
    } catch (error) {
      console.error('Error fetching fees:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     if (editingFeeId) {
  //       // Update existing fee
  //       await axios.put(
  //         `http://195.26.253.123/pos/transaction/action_additional_fee/${editingFeeId}/`,
  //         formData,
  //       )
  //       setFees(fees.map((fee) => (fee.id === editingFeeId ? { ...fee, ...formData } : fee)))
  //       setEditingFeeId(null)
  //     } else {
  //       // Add new fee
  //       const response = await axios.post(
  //         'http://195.26.253.123/pos/transaction/add_additional_fee',
  //         formData,
  //       )
  //       setFees([...fees, response.data])
  //     }
  //     setFormData({ fee_name: '' })
  //   } catch (error) {
  //     console.error('Error adding/updating fee:', error)
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingFeeId) {
        // Update existing fee
        await Network.put(`${Urls.updateAdditionalFee}/${editingFeeId}/`, formData)
        setFees(fees.map((fee) => (fee.id === editingFeeId ? { ...fee, ...formData } : fee)))
        setEditingFeeId(null)
      } else {
        // Add new fee
        const response = await Network.post(Urls.addAdditionalFee, formData)
        setFees([...fees, response.data])
      }
      setFormData({ fee_name: '' })
    } catch (error) {
      console.error('Error adding/updating fee:', error)
    }
  }

  const handleEdit = (fee) => {
    setFormData(fee)
    setEditingFeeId(fee.id)
  }

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`http://195.26.253.123/pos/transaction/action_additional_fee/${id}/`);
  //     setFees(fees.filter(fee => fee.id !== id));
  //   } catch (error) {
  //     console.error('Error deleting fee:', error);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      await Network.delete(`${Urls.updateAdditionalFee}/${id}/`)
      setFees(fees.filter((fee) => fee.id !== id)) // Remove the deleted fee from the state
    } catch (error) {
      console.error('Error deleting fee:', error)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
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
      {fees.length > 0 && (
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
                  <button className="edit-fee-button" type="button" onClick={() => handleEdit(fee)}>
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
      )}
    </div>
  )
}

export default AdditionalFee
