// import React, { useState, } from 'react';
// import { useNavigate } from 'react-router-dom'
// import './AddCustomer.css';

// const AddCustomer = () => {
//   const [formData, setFormData] = useState({
//     dateTime: '', // Auto-populated
//     customerChannel: '',
//     customerType: '',
//     firstName: '',
//     lastName: '',
//     displayName: '',
//     gender: '',
//     companyName: '',
//     email: '',
//     mobileNumber: '',
//     internationalNumber: '',
//     landlineNumber: '',
//     password: '',
//     address: '',
//     shippingAddressSameAsMain: false,
//     shippingAddress: '',
//     shippingCity: '',
//     shippingZipCode: '',
//     shippingState: '',
//     shippingCountry: '',
//     internalNote: '',
//     avatar: null,
//     onlineAccess: 'No',
//     status: 'Active'
//   });
//   const navigate = useNavigate()

//   // Update form field handler
//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData); // For testing purposes
//     // Add API call or data submission logic here
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h3>Customer Information</h3>

//       {/* Date & Time */}
//       <div>
//         <label>Date & Time:</label>
//         <input type="text" value={new Date().toLocaleString()} disabled />
//       </div>

//       {/* Customer Channel */}
//       <div>
//         <label>Customer Channel:</label>
//         <select name="customerChannel" value={formData.customerChannel} onChange={handleChange}>
//           <option value="walk-in">Walk-in</option>
//           <option value="referral">Referral</option>
//           <option value="online">Online</option>
//         </select>
//         <button type="button" onClick={() => navigate('/Customer/CustomerChannel')}>+</button>
//       </div>

//       {/* Customer Type */}
//       <div>
//         <label>Customer Type:</label>
//         <select name="customerType" value={formData.customerType} onChange={handleChange}>
//           <option value="retail">Retail</option>
//           <option value="wholesale">Wholesale</option>
//           <option value="other">Other</option>
//         </select>
//         <button type="button" onClick={() => navigate('/Customer/CustomerType')}>+</button>
//       </div>

//       {/* Additional fields */}
//       {['firstName', 'lastName', 'displayName', 'companyName', 'email', 'mobileNumber', 'internationalNumber', 'landlineNumber', 'password', 'address'].map((field) => (
//         <div key={field}>
//           <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
//           <input
//             type="text"
//             name={field}
//             value={formData[field]}
//             onChange={handleChange}
//             required={['firstName', 'lastName', 'email', 'mobileNumber', 'password'].includes(field)}
//           />
//         </div>
//       ))}

//       {/* Shipping Information */}
//       <h3>Shipping Information</h3>

//       {/* Checkbox for same as main address */}
//       <div>
//         <label>
//           <input
//             type="checkbox"
//             name="shippingAddressSameAsMain"
//             checked={formData.shippingAddressSameAsMain}
//             onChange={handleChange}
//           />
//           Shipping Address same as main address
//         </label>
//       </div>

//       {/* Shipping Address Fields */}
//       {['shippingAddress', 'shippingCity', 'shippingZipCode', 'shippingState'].map((field) => (
//         <div key={field}>
//           <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
//           <input
//             type="text"
//             name={field}
//             value={formData[field]}
//             onChange={handleChange}
//             disabled={formData.shippingAddressSameAsMain}
//           />
//         </div>
//       ))}

//       <div>
//         <label>Country:</label>
//         <input
//           type="text"
//           name="shippingCountry"
//           value={formData.shippingCountry}
//           onChange={handleChange}
//           disabled={formData.shippingAddressSameAsMain}
//         />
//       </div>

//       {/* Additional Information */}
//       <h3>Additional Information</h3>

//       <div>
//         <label>Internal Note:</label>
//         <textarea name="internalNote" value={formData.internalNote} onChange={handleChange}></textarea>
//       </div>

//       <div>
//         <label>Avatar:</label>
//         <input type="file" name="avatar" onChange={handleChange} />
//       </div>

//       <div>
//         <label>Online Access:</label>
//         <input
//           type="radio"
//           name="onlineAccess"
//           value="Yes"
//           checked={formData.onlineAccess === 'Yes'}
//           onChange={handleChange}
//         />{' '}
//         Yes
//         <input
//           type="radio"
//           name="onlineAccess"
//           value="No"
//           checked={formData.onlineAccess === 'No'}
//           onChange={handleChange}
//         />{' '}
//         No
//       </div>

//       <div>
//         <label>Status:</label>
//         <input
//           type="radio"
//           name="status"
//           value="Active"
//           checked={formData.status === 'Active'}
//           onChange={handleChange}
//         />{' '}
//         Active
//         <input
//           type="radio"
//           name="status"
//           value="Pending"
//           checked={formData.status === 'Pending'}
//           onChange={handleChange}
//         />{' '}
//         Pending
//         <input
//           type="radio"
//           name="status"
//           value="Inactive"
//           checked={formData.status === 'Inactive'}
//           onChange={handleChange}
//         />{' '}
//         Inactive
//       </div>

//       <button type="submit">Add Customer</button>
//     </form>
//   );
// };

// export default AddCustomer;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddCustomer.css';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    dateTime: '',
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
  const [customers, setCustomers] = useState([]);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const navigate = useNavigate();
  const apiUrl = 'http://url/pos/customer';

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get_customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCustomerId) {
        await axios.put(`${apiUrl}/action_customer/${editingCustomerId}/`, formData);
        alert('Customer updated successfully');
      } else {
        await axios.post(`${apiUrl}/add_customer`, formData);
        alert('Customer added successfully');
      }

      setFormData({
        dateTime: '',
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
      setEditingCustomerId(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingCustomerId(customer.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/action_customer/${id}/`);
      alert('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>{editingCustomerId ? 'Edit Customer' : 'Add Customer'}</h3>

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
          <button type="button" onClick={() => navigate('/Customer/CustomerChannel')}>+</button>
        </div>

        {/* Customer Type */}
        <div>
          <label>Customer Type:</label>
          <select name="customerType" value={formData.customerType} onChange={handleChange}>
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
            <option value="other">Other</option>
          </select>
          <button type="button" onClick={() => navigate('/Customer/CustomerType')}>+</button>
        </div>

        {/* Full Name */}
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>

        {/* Display Name */}
        <div>
          <label>Display Name:</label>
          <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} required />
        </div>

        {/* Gender */}
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Company Name */}
        <div>
          <label>Company Name:</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
        </div>

        {/* Email */}
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        {/* Mobile Number */}
        <div>
          <label>Mobile Number:</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
        </div>

        {/* International Number */}
        <div>
          <label>International Number:</label>
          <input type="text" name="internationalNumber" value={formData.internationalNumber} onChange={handleChange} />
        </div>

        {/* Landline Number */}
        <div>
          <label>Landline Number:</label>
          <input type="text" name="landlineNumber" value={formData.landlineNumber} onChange={handleChange} />
        </div>

        {/* Password */}
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        {/* Address */}
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>

        {/* Shipping Address */}
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
        <div>
          <label>Shipping Address:</label>
          <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} />
        </div>
        <div>
          <label>Shipping City:</label>
          <input type="text" name="shippingCity" value={formData.shippingCity} onChange={handleChange} />
        </div>
        <div>
          <label>Shipping Zip Code:</label>
          <input type="text" name="shippingZipCode" value={formData.shippingZipCode} onChange={handleChange} />
        </div>
        <div>
          <label>Shipping State:</label>
          <input type="text" name="shippingState" value={formData.shippingState} onChange={handleChange} />
        </div>
        <div>
          <label>Shipping Country:</label>
          <input type="text" name="shippingCountry" value={formData.shippingCountry} onChange={handleChange} />
        </div>

        {/* Internal Note */}
        <div>
          <label>Internal Note:</label>
          <textarea name="internalNote" value={formData.internalNote} onChange={handleChange}></textarea>
        </div>

        {/* Avatar */}
        <div>
          <label>Avatar:</label>
          <input type="file" name="avatar" onChange={handleChange} />
        </div>

        {/* Online Access */}
        <div>
          <label>Online Access:</label>
          <select name="onlineAccess" value={formData.onlineAccess} onChange={handleChange}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">{editingCustomerId ? 'Update Customer' : 'Add Customer'}</button>
      </form>

      {/* Customer Table */}
      <h3>Customer List</h3>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.email}</td>
              <td>
                <button onClick={() => handleEdit(customer)}>Edit</button>
                <button onClick={() => handleDelete(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddCustomer;
