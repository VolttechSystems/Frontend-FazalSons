// src/views/pages/customerChannel/CustomerChannel.js
import React, { useState } from 'react'
import './CustomerChannel.css';


const CustomerChannel = () => {
  const [formData, setFormData] = useState({
    code: '',
    channel: ''
  })
  const [channels, setChannels] = useState([])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle form submission
  const handleAddChannel = (e) => {
    e.preventDefault()
    // Create new channel entry with auto-incremented ID
    const newChannel = {
      id: channels.length + 1,
      code: formData.code,
      channel: formData.channel
    }
    // Add to the channels list and clear the form
    setChannels([...channels, newChannel])
    setFormData({ code: '', channel: '' })
  }

  return (
    <div>
      <h2>Add Customer Channel</h2>
      <form onSubmit={handleAddChannel}>
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

        {/* Channel */}
        <div>
          <label>Channel:</label>
          <input
            type="text"
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Add</button>
      </form>

      <h3>Customer Channels</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Channel</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((channel) => (
            <tr key={channel.id}>
              <td>{channel.id}</td>
              <td>{channel.code}</td>
              <td>{channel.channel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerChannel
