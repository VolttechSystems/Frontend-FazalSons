import React, { useState } from 'react';
import './AddOutlet.css';

const AddOutlet = () => {
  const [formData, setFormData] = useState({
    outletCode: '',
    outletName: ''
  });

  const [outlets, setOutlets] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new outlet to the outlets array
    if (formData.outletCode && formData.outletName) {
      setOutlets([...outlets, formData]);
      setFormData({ outletCode: '', outletName: '' });
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Add New Outlet</h2>
        <div>
          <label>Outlet Code:</label>
          <input
            type="text"
            name="outletCode"
            value={formData.outletCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Outlet Name:</label>
          <input
            type="text"
            name="outletName"
            value={formData.outletName}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Outlet</button>
      </form>

      {/* Outlet Table */}
      {outlets.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Outlet Code</th>
              <th>Outlet Name</th>
            </tr>
          </thead>
          <tbody>
            {outlets.map((outlet, index) => (
              <tr key={index}>
                <td>{outlet.outletCode}</td>
                <td>{outlet.outletName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddOutlet;
