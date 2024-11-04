// src/views/pages/customerType/CustomerType.js
import React, { useState } from 'react'
import './CustomerType.css';


const CustomerType = () => {
  const [formData, setFormData] = useState({
    code: '',
    type: ''
  })
  const [types, setTypes] = useState([])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle form submission
  const handleAddType = (e) => {
    e.preventDefault()
    // Create new type entry with auto-incremented ID
    const newType = {
      id: types.length + 1,
      code: formData.code,
      type: formData.type
    }
    // Add to the types list and clear the form
    setTypes([...types, newType])
    setFormData({ code: '', type: '' })
  }

  return (
    <div>
      <h2>Add Customer Type</h2>
      <form onSubmit={handleAddType}>
        {/* Code */}
        <div>
          <label>Code:</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        {/* Type */}
        <div>
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Add</button>
      </form>

      <h3>Customer Types</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <tr key={type.id}>
              <td>{type.id}</td>
              <td>{type.code}</td>
              <td>{type.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerType
