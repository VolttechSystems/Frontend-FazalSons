import React, { useState } from 'react';
import './AddCustomer.css';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    dateTime: '', // Auto-populated
    customerChannel: '',
    customerType: '',
    firstName: '',
    lastName: '',
    displayName: '',
    gender: '',
    companyName: '',
    email: '',
    mobileNumber: '',
    internationalNumber: '',
    landlineNumber: '',
    password: '',
    address: '',
    shippingAddressSameAsMain: false,
    shippingAddress: '',
    shippingCity: '',
    shippingZipCode: '',
    shippingState: '',
    shippingCountry: '',
    internalNote: '',
    avatar: null,
    onlineAccess: 'No',
    status: 'Active'
  });

  // Update form field handler
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // For testing purposes
    // Add API call or data submission logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Customer Information</h3>

      {/* Date & Time */}
      <div>
        <label>Date & Time:</label>
        <input type="text" value={new Date().toLocaleString()} disabled />
      </div>

      {/* Customer Channel */}
      <div>
        <label>Customer Channel:</label>
        <select name="customerChannel" value={formData.customerChannel} onChange={handleChange}>
          <option value="walk-in">Walk-in</option>
          <option value="referral">Referral</option>
          <option value="online">Online</option>
        </select>
      </div>

      {/* Customer Type */}
      <div>
        <label>Customer Type:</label>
        <select name="customerType" value={formData.customerType} onChange={handleChange}>
          <option value="retail">Retail</option>
          <option value="wholesale">Wholesale</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Additional fields */}
      {['firstName', 'lastName', 'displayName', 'companyName', 'email', 'mobileNumber', 'internationalNumber', 'landlineNumber', 'password', 'address'].map((field) => (
        <div key={field}>
          <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required={['firstName', 'lastName', 'email', 'mobileNumber', 'password'].includes(field)}
          />
        </div>
      ))}

      {/* Shipping Information */}
      <h3>Shipping Information</h3>

      {/* Checkbox for same as main address */}
      <div>
        <label>
          <input
            type="checkbox"
            name="shippingAddressSameAsMain"
            checked={formData.shippingAddressSameAsMain}
            onChange={handleChange}
          />
          Shipping Address same as main address
        </label>
      </div>

      {/* Shipping Address Fields */}
      {['shippingAddress', 'shippingCity', 'shippingZipCode', 'shippingState'].map((field) => (
        <div key={field}>
          <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            disabled={formData.shippingAddressSameAsMain}
          />
        </div>
      ))}

      <div>
        <label>Country:</label>
        <input
          type="text"
          name="shippingCountry"
          value={formData.shippingCountry}
          onChange={handleChange}
          disabled={formData.shippingAddressSameAsMain}
        />
      </div>

      {/* Additional Information */}
      <h3>Additional Information</h3>

      <div>
        <label>Internal Note:</label>
        <textarea name="internalNote" value={formData.internalNote} onChange={handleChange}></textarea>
      </div>

      <div>
        <label>Avatar:</label>
        <input type="file" name="avatar" onChange={handleChange} />
      </div>

      <div>
        <label>Online Access:</label>
        <input
          type="radio"
          name="onlineAccess"
          value="Yes"
          checked={formData.onlineAccess === 'Yes'}
          onChange={handleChange}
        />{' '}
        Yes
        <input
          type="radio"
          name="onlineAccess"
          value="No"
          checked={formData.onlineAccess === 'No'}
          onChange={handleChange}
        />{' '}
        No
      </div>

      <div>
        <label>Status:</label>
        <input
          type="radio"
          name="status"
          value="Active"
          checked={formData.status === 'Active'}
          onChange={handleChange}
        />{' '}
        Active
        <input
          type="radio"
          name="status"
          value="Pending"
          checked={formData.status === 'Pending'}
          onChange={handleChange}
        />{' '}
        Pending
        <input
          type="radio"
          name="status"
          value="Inactive"
          checked={formData.status === 'Inactive'}
          onChange={handleChange}
        />{' '}
        Inactive
      </div>

      <button type="submit">Add Customer</button>
    </form>
  );
};

export default AddCustomer;
