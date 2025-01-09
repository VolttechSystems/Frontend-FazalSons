import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const [formData, setFormData] = useState({
    pm_name: '',
  });

  const [payments, setPayments] = useState([]);
  const [editingPaymentId, setEditingPayment] = useState(null);

  useEffect(() => {
    // Fetch existing payment methods when the component mounts
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://195.26.253.123/pos/transaction/add_payment');
      setPayments(response.data); // Adjust based on the response structure
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPaymentId) {
        // Update existing payment method
        await axios.put(`http://195.26.253.123/pos/transaction/action_payment/${editingPaymentId}/`, formData);
        setPayments(payments.map(payment => (payment.id === editingPaymentId ? formData : payment)));
        setEditingPayment(null);
      } else {
        // Add new payment method
        await axios.post('http://195.26.253.123/pos/transaction/add_payment', formData);
        setPayments([...payments, formData]);
      }
      setFormData({ pm_name: '' });
    } catch (error) {
      console.error('Error adding/updating payment method:', error);
    }
  };

  const handleEdit = (payment) => {
    setFormData(payment);
    setEditingPayment(payment.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://195.26.253.123/pos/transaction/action_payment/${id}/`);
      setPayments(payments.filter(payment => payment.id !== id)); // Remove deleted payment method from the state
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  return (
    <div className="container">
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
        <button type="submit">{editingPaymentId ? 'Update Payment Method' : 'Add Payment Method'}</button>
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
  );
};

export default Payment;
