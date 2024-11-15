import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Salesman.css';

const Salesman = () => {
  const [formData, setFormData] = useState({
    salesman_code: '',
    salesman_name: '',
    wholesale_commission: '',
    retail_commission: '',
    token_commission: ''
  });

  const [salesmen, setSalesmen] = useState([]);
  const [editingSalesmanId, setEditingSalesmanId] = useState(null);

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const fetchSalesmen = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/transaction/add_salesman');
      setSalesmen(response.data);
    } catch (error) {
      console.error('Error fetching salesmen:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate ID if it's not set (for new salesmen only)
    const generatedId = editingSalesmanId || Date.now(); // Using Date.now() for generating unique ID (you can adjust this logic as needed)

    // Prepare the payload to be sent
    const dataToSend = {
      id: generatedId,  // Use the generated ID for new salesmen, or the existing one if editing
      salesman_code: formData.salesman_code,
      salesman_name: formData.salesman_name,
      wholesale_commission: String(formData.wholesale_commission),  // Ensure commission is a string
      retail_commission: String(formData.retail_commission),        // Ensure commission is a string
      token_commission: String(formData.token_commission)           // Ensure commission is a string
    };

    try {
      if (editingSalesmanId) {
        // Update the existing salesman
        const response = await axios.put(
          `http://16.171.145.107/pos/transaction/action_salesman/${editingSalesmanId}/`,
          dataToSend,
          { headers: { 'Content-Type': 'application/json' } }
        );
        setSalesmen(
          salesmen.map((salesman) => (salesman.id === editingSalesmanId ? response.data : salesman))
        );
        setEditingSalesmanId(null);  // Reset after successful edit
      } else {
        // Add a new salesman
        const response = await axios.post(
          'http://16.171.145.107/pos/transaction/add_salesman',
          dataToSend,
          { headers: { 'Content-Type': 'application/json' } }
        );
        setSalesmen([...salesmen, response.data]);  // Add new salesman to the list
      }

      // Reset the form
      setFormData({
        salesman_code: '',
        salesman_name: '',
        wholesale_commission: '',
        retail_commission: '',
        token_commission: ''
      });
    } catch (error) {
      console.error('Error adding/updating salesman:', error);
    }
  };

  const handleEdit = (salesman) => {
    setFormData({
      salesman_code: salesman.salesman_code,
      salesman_name: salesman.salesman_name,
      wholesale_commission: salesman.wholesale_commission,
      retail_commission: salesman.retail_commission,
      token_commission: salesman.token_commission
    });
    setEditingSalesmanId(salesman.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://16.171.145.107/pos/transaction/action_salesman/${id}/`);
      setSalesmen(salesmen.filter(salesman => salesman.id !== id));
    } catch (error) {
      console.error('Error deleting salesman:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>{editingSalesmanId ? 'Edit Salesman' : 'Add New Salesman'}</h2>
        <div>
          <label>Salesman Code: *</label>
          <input
            type="text"
            name="salesman_code"
            value={formData.salesman_code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Salesman Name: *</label>
          <input
            type="text"
            name="salesman_name"
            value={formData.salesman_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Wholesale Commission:</label>
          <input
            type="number"
            name="wholesale_commission"
            value={formData.wholesale_commission}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Retail Commission:</label>
          <input
            type="number"
            name="retail_commission"
            value={formData.retail_commission}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Token Commission:</label>
          <input
            type="number"
            name="token_commission"
            value={formData.token_commission}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editingSalesmanId ? 'Update Salesman' : 'Add Salesman'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Salesman Code</th>
            <th>Salesman Name</th>
            <th>Wholesale Commission</th>
            <th>Retail Commission</th>
            <th>Token Commission</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesmen.map((salesman) => (
            <tr key={salesman.id}>
              <td>{salesman.salesman_code}</td>
              <td>{salesman.salesman_name}</td>
              <td>{salesman.wholesale_commission}</td>
              <td>{salesman.retail_commission}</td>
              <td>{salesman.token_commission}</td>
              <td>
                <button onClick={() => handleEdit(salesman)}>Edit</button>
                <button onClick={() => handleDelete(salesman.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Salesman;
