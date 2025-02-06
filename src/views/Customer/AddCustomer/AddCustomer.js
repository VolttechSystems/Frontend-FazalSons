import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import './AddCustomer.css'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Select from 'react-select'

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    customer_channel: '',
    customerType: '',
    display_name: '',
    gender: '',
    company_name: '',
    email: '',
    mobile_no: '',
    international_no: '',
    landline_no: '',
    password: '',
    address: '',
    shippingAddressSameAsMain: false,
    shipping_address: '',
    city: '',
    zip_code: '',
    province: '',
    country: '',
    internal_note: '',
    image: null,
    online_access: 'no',
    status: 'active',
    shop: '', // Add shop to formData
    outlet: '', // Add outlet to formData
  })

  const [customers, setCustomers] = useState([])
  const [customerChannels, setCustomerChannels] = useState([])
  const [customerTypes, setCustomerTypes] = useState([])
  const [editingCustomerId, setEditingCustomerId] = useState(null)
  const [currentPage, setCurrentPage] = useState(0) // Pagination start from 0
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10) // Items per page
  const navigate = useNavigate()
  const apiUrl = 'http://195.26.253.123/pos/customer'
  const { outletId } = useParams()

  useEffect(() => {
    const shopId = localStorage.getItem('shop_id')
    if (shopId) {
      setFormData((prev) => ({ ...prev, shop: shopId, outlet: outletId })) // Set shop and outlet in formData
    }
    fetchCustomers(currentPage, outletId) // Pass outletId to the fetchCustomers function
    fetchCustomerChannels()
    fetchCustomerTypes()
  }, [currentPage, outletId])

  const fetchCustomers = async (page = 0, outletId) => {
    const shopId = localStorage.getItem('shop_id')
    if (!shopId || !outletId) {
      console.error('Missing shopId or outletId')
      return
    }

    const response = await Network.get(
      `${Urls.addCustomer}/${shopId}/${outletId}?Starting=${page}&limit=${pageSize}`,
    )

    if (!response.ok) {
      console.error(response.data.error)
      return
    }

    setCustomers(response.data.results) // Set existing customers
    setTotalPages(Math.ceil(response.data.count / pageSize))
  }

  useEffect(() => {
    fetchCustomers(0, outletId) // Fetch customers when outletId changes
  }, [outletId])

  const fetchCustomerChannels = async () => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.get(`${Urls.addCustomerChannel}/${shopId}`)
    if (!response.ok) return console.log(response.data.error)
    // setCustomerChannels(response.data)
    setCustomerChannels(
      response.data.map((channel) => ({
        value: channel.id,
        label: channel.customer_channel,
      })),
    )
  }

  const fetchCustomerTypes = async () => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.get(`${Urls.addCustomerType}/${shopId}`)
    if (!response.ok) return console.log(response.data.error)
    // setCustomerTypes(response.data)
    setCustomerTypes(
      response.data.map((type) => ({
        value: type.id,
        label: type.customer_type,
      })),
    )
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    })
  }
  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      toast.error('Shop ID not found in local storage.')
      return
    }

    try {
      let response

      if (editingCustomerId) {
        // Update existing customer
        response = await Network.put(
          `${Urls.actionCustomer}/${shopId}/${outletId}/${editingCustomerId}`,
          { ...formData, shop: shopId, outlet: outletId }, // Include shop and outlet in the payload
        )
        if (response.ok && response.data) {
          setCustomers((prev) =>
            prev.map((customer) =>
              customer.id === editingCustomerId ? { ...customer, ...response.data } : customer,
            ),
          )
          toast.success('Customer updated successfully!')
        } else {
          toast.error('Error updating customer.')
        }
      } else {
        // Add new customer
        response = await Network.post(
          `${Urls.addCustomer}/${shopId}/${outletId}`,
          { ...formData, shop: shopId, outlet: outletId }, // Include shop and outlet in the payload
        )
        if (response.ok && response.data) {
          setCustomers((prev) => [response.data, ...prev]) // Add new customer to top
          toast.success('Customer added successfully!')
        } else {
          toast.error('Error adding customer. Please fill in the required fields')
        }
      }

      // Reset form and state
      setFormData({
        customer_channel: null, // Reset to null for react-select
        customerType: null, // Reset to null for react-select
        display_name: '',
        gender: '',
        company_name: '',
        email: '',
        mobile_no: '',
        international_no: '',
        landline_no: '',
        password: '',
        address: '',
        shippingAddressSameAsMain: false,
        shipping_address: '',
        city: '',
        zip_code: '',
        province: '',
        country: '',
        internal_note: '',
        image: null,
        online_access: 'no',
        status: 'active',
        shop: shopId,
        outlet: outletId,
      })
      setEditingCustomerId(null)
    } catch (error) {
      console.error('Error submitting customer:', error)
      toast.error('Error submitting customer.')
    }
  }

  // const handleEdit = (customer) => {
  //   setFormData({
  //     ...customer,
  //     shippingAddressSameAsMain: customer.shipping_address === customer.address,
  //   })
  //   setEditingCustomerId(customer.id)
  // }
  const handleEdit = (customer) => {
    setFormData({
      ...customer,
      customer_channel: customer.customer_channel.id,
      customerType: customer.customer_type.id,
      shippingAddressSameAsMain: customer.shipping_address === customer.address,
    })
    setEditingCustomerId(customer.id)
  }

  const handleDelete = async (id) => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.delete(`${Urls.actionCustomer}/${shopId}/${id}`)
    if (!response.ok) return console.log(response.data.error)
    toast.success('Customer deleted successfully!')
    fetchCustomers(currentPage)
  }
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>{editingCustomerId ? 'Edit Customer' : 'Add Customer'}</h3>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {/* Date & Time */}
        <div>
          <label>Date & Time:</label>
          <input type="text" value={new Date().toLocaleString()} disabled />
        </div>

        {/* Customer Channel */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Customer Channel *</label>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <Select
              name="customer_channel"
              options={customerChannels} // Already transformed into value/label pairs
              value={
                customerChannels.find((channel) => channel.value === formData.customer_channel) ||
                null
              }
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, { name: 'customer_channel' })
              }
              placeholder="Select Channel"
              isSearchable
              isClearable
              styles={{
                container: (base) => ({
                  ...base,
                  flex: 1,
                }),
                control: (base) => ({
                  ...base,
                  minHeight: '42px',
                  height: '42px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginBottom: '-20px',
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 8px',
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '16px',
                }),
                input: (base) => ({
                  ...base,
                  margin: '0',
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: '16px',
                }),
              }}
            />

            <button
              style={{ padding: '8px' }}
              type="button"
              onClick={() => navigate('/Customer/CustomerChannel')}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Customer Type *</label>
          <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
            <Select
              name="customer_type"
              options={customerTypes} // Already transformed into value/label pairs
              value={customerTypes.find((type) => type.value === formData.customer_type) || null}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, { name: 'customer_type' })
              }
              placeholder="Select Type"
              isSearchable
              isClearable
              styles={{
                container: (base) => ({
                  ...base,
                  flex: 1,
                }),
                control: (base) => ({
                  ...base,
                  minHeight: '42px',
                  height: '42px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginBottom: '-20px',
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 8px',
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '16px',
                }),
                input: (base) => ({
                  ...base,
                  margin: '0',
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: '16px',
                }),
              }}
            />
            <button
              style={{ padding: '8px' }}
              type="button"
              onClick={() => navigate('/Customer/CustomerType')}
            >
              +
            </button>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label>Display Name *</label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
          />
        </div>

        {/* Gender */}
        <div>
          <label>Gender *</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="" disabled>
              Select Gender
            </option>{' '}
            {/* Placeholder */}
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Company Name */}
        <div>
          <label>Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        {/* Mobile Number */}
        <div>
          <label>Mobile # *</label>
          <input
            type="text"
            name="mobile_no"
            value={formData.mobile_no}
            onChange={handleChange}
            required
          />
        </div>

        {/* International Number */}
        <div>
          <label>International #</label>
          <input
            type="text"
            name="international_no"
            value={formData.international_no}
            onChange={handleChange}
          />
        </div>

        {/* Landline Number */}
        <div>
          <label>Landline Number</label>
          <input
            type="text"
            name="landline_no"
            value={formData.landline_no}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div>
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>

        {/* Shipping Address Checkbox */}
        <div>
          <label>
            <input
              type="checkbox"
              name="shippingAddressSameAsMain"
              checked={formData.shippingAddressSameAsMain}
              onChange={(e) => {
                handleChange(e) // Update the checkbox state
                setFormData((prevData) => ({
                  ...prevData,
                  shipping_address: e.target.checked ? prevData.address : '', // Copy address or clear
                }))
              }}
            />
            Shipping Address same as main address
          </label>
        </div>

        {/* Shipping Address */}
        <div>
          <label>Shipping Address</label>
          <input
            type="text"
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            disabled={formData.shippingAddressSameAsMain}
          />
        </div>
        <div>
          <label>City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} />
        </div>

        <div>
          <label>Zip Code</label>
          <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} />
        </div>

        <div>
          <label>Province</label>
          <input type="text" name="province" value={formData.province} onChange={handleChange} />
        </div>

        <div>
          <label>Country</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
        </div>

        <div>
          <label>Internal Note</label>
          <textarea name="internal_note" value={formData.internal_note} onChange={handleChange} />
        </div>

        <div>
          <label>Image</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>

        <div>
          <label>Online Access</label>
          <select name="online_access" value={formData.online_access} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button type="submit">{editingCustomerId ? 'Update Customer' : 'Add Customer'}</button>
      </form>

      <hr />

      {/* Customer Table */}
      <h3>Customer List</h3>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.display_name}</td>
                <td>{customer.email}</td>
                <td>{customer.mobile_no}</td>
                <td>{customer.status}</td>
                <td>
                  <button onClick={() => handleEdit(customer)}>Edit</button>
                  <button onClick={() => handleDelete(customer.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div
        className="pagination"
        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}
      >
        <button
          style={{
            padding: '5px 8px',
            marginRight: '5px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <button
          style={{
            padding: '5px 8px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default AddCustomer
