import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Salesman.css';

const Salesman = () => {
  const [formData, setFormData] = useState({
    salesman_name: '',
    wholesale_commission: '',
    retail_commission: '',
    token_commission: '',
    outlet: ''
  });

  const [salesmen, setSalesmen] = useState([]);
  const [outlets, setOutlets] = useState([]); // Outlet data
  const [editingSalesmanId, setEditingSalesmanId] = useState(null);
  const [showCommissions, setShowCommissions] = useState(true);

  useEffect(() => {
    fetchSalesmen();
    fetchOutlets(); // Fetch outlets separately
  }, []);

  const fetchSalesmen = async () => {
    try {
      const response = await axios.get('http://195.26.253.123/pos/transaction/add_salesman');
      setSalesmen(response.data);
    } catch (error) {
      console.error('Error fetching salesmen:', error);
    }
  };

  const fetchOutlets = async () => {
    try {
      const response = await axios.get('http://195.26.253.123/pos/products/add_outlet');
      setOutlets(response.data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dataToSend = {
      CheckBoxValue: showCommissions ? "true" : "false", // Include the checkbox value
      salesman_name: formData.salesman_name,
      wholesale_commission: !showCommissions ? String(formData.wholesale_commission) : '',
      retail_commission: !showCommissions ? String(formData.retail_commission) : '',
      token_commission: !showCommissions ? String(formData.token_commission) : '',
      outlet: formData.outlet, // Send the selected outlet ID
    };
  
    try {
      if (editingSalesmanId) {
        await axios.put(
          `http://195.26.253.123/pos/transaction/action_salesman/${editingSalesmanId}/`,
          dataToSend
        );
      } else {
        await axios.post('http://195.26.253.123/pos/transaction/add_salesman', dataToSend);
      }
      fetchSalesmen(); // Refresh the list
      resetForm();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  

  const handleEdit = (salesman) => {
    setFormData({
      salesman_name: salesman.salesman_name,
      wholesale_commission: salesman.wholesale_commission || '',
      retail_commission: salesman.retail_commission || '',
      token_commission: salesman.token_commission || '',
      outlet: salesman.outlet || '' // Set outlet ID if available
    });
    setEditingSalesmanId(salesman.id);
    setShowCommissions(!!salesman.wholesale_commission);
  };

  const resetForm = () => {
    setFormData({
      salesman_name: '',
      wholesale_commission: '',
      retail_commission: '',
      token_commission: '',
      outlet: ''
    });
    setEditingSalesmanId(null);
    setShowCommissions(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://195.26.253.123/pos/transaction/action_salesman/${id}/`);
      setSalesmen(salesmen.filter((salesman) => salesman.id !== id));
    } catch (error) {
      console.error('Error deleting salesman:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>{editingSalesmanId ? 'Edit Salesman' : 'Add New Salesman'}</h2>

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
          <label>Show Commission Fields:</label>
          <input
            type="checkbox"
            checked={showCommissions}
            onChange={() => setShowCommissions(!showCommissions)}
          />
        </div>

        {!showCommissions && (
          <>
            <div>
              <label>Wholesale Commission:</label>
              <input
                type="number"
                name="wholesale_commission"
                value={formData.wholesale_commission}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Retail Commission:</label>
              <input
                type="number"
                name="retail_commission"
                value={formData.retail_commission}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Token Commission:</label>
              <input
                type="number"
                name="token_commission"
                value={formData.token_commission}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div>
          <label>Outlet:</label>
          <select name="outlet" value={formData.outlet} onChange={handleChange} required>
            <option value="">Select Outlet</option>
            {outlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.outlet_name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{editingSalesmanId ? 'Update Salesman' : 'Add Salesman'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Salesman Name</th>
            <th>Wholesale Commission</th>
            <th>Retail Commission</th>
            <th>Token Commission</th>
            <th>Outlet</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesmen.map((salesman) => (
            <tr key={salesman.id}>
              <td>{salesman.salesman_name}</td>
              <td>{salesman.wholesale_commission || 'N/A'}</td>
              <td>{salesman.retail_commission || 'N/A'}</td>
              <td>{salesman.token_commission || 'N/A'}</td>
              <td>
                {
                  outlets.find((outlet) => outlet.id === salesman.outlet)?.outlet_name || 'N/A'
                }
              </td>
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
