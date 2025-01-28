import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import './Salesman.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'

const Salesman = () => {
  const [formData, setFormData] = useState({
    salesman_name: '',
    wholesale_commission: '',
    retail_commission: '',
    token_commission: '',
    outlet: [],
    shop: '',
  })
  const [salesmen, setSalesmen] = useState([])
  const [outlets, setOutlets] = useState([])
  const [editingSalesmanId, setEditingSalesmanId] = useState(null)
  const [showCommissions, setShowCommissions] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)

  useEffect(() => {
    fetchSalesmen(currentPage)
    fetchOutlets()
  }, [currentPage])

  const fetchSalesmen = async (page = 0) => {
    try {
      const shopId = localStorage.getItem('shop_id')
      const response = await Network.get(
        `${Urls.addSalesman}/${shopId}?Starting=${page}&limit=${pageSize}`,
      )
      if (!response.ok) return console.error(response.data.error)
      setSalesmen(response.data.results)
      setTotalPages(Math.ceil(response.data.count / pageSize))
    } catch (error) {
      console.error('Error fetching salesmen:', error)
    }
  }

  const fetchOutlets = async () => {
    const shopId = localStorage.getItem('shop_id')
    try {
      const response = await Network.get(`${Urls.addOutlets}/${shopId}/`)
      if (!response.ok) return console.error(response.data.error)
      const outletOptions = response.data.map((outlet) => ({
        value: outlet.id,
        label: outlet.outlet_name,
      }))
      setOutlets(outletOptions)
    } catch (error) {
      console.error('Error fetching outlets:', error)
    }
  }

  const handleOutletChange = (selectedOptions) => {
    setFormData({ ...formData, outlet: selectedOptions || [] })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      toast.error('Shop ID not found in local storage.')
      return
    }

    const selectedOutlets = formData.outlet.map((outlet) => outlet.value)

    const dataToSend = {
      CheckBoxValue: showCommissions ? 'true' : 'false',
      salesman_name: formData.salesman_name,
      wholesale_commission: !showCommissions ? String(formData.wholesale_commission) : '',
      retail_commission: !showCommissions ? String(formData.retail_commission) : '',
      token_commission: !showCommissions ? String(formData.token_commission) : '',
      outlet: selectedOutlets,
      shop: shopId,
    }

    try {
      let response

      if (editingSalesmanId) {
        // Update existing salesman
        response = await Network.put(
          `${Urls.updateSalesman}/${shopId}/${editingSalesmanId}`,
          dataToSend,
        )
      } else {
        // Add new salesman
        response = await Network.post(`${Urls.addSalesman}/${shopId}`, dataToSend)
      }

      if (response.status === 200 || response.status === 201) {
        // Successful response
        toast.success(
          editingSalesmanId ? 'Salesman updated successfully!' : 'Salesman added successfully!',
        )
        fetchSalesmen(currentPage)
        resetForm()
      } else {
        // Handle API failure
        const errorMessage =
          response.data?.error || 'The fields shop, salesman_name must make a unique set.'
        toast.error(errorMessage)
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.'
      toast.error(errorMessage)
      console.error('Error submitting data:', error)
    }
  }

  const handleEdit = (salesman) => {
    const selectedOutlets = salesman.outlet.map((outlet) => ({
      value: outlet.id,
      label: outlet.outlet_name,
    }))
    setFormData({
      salesman_name: salesman.salesman_name,
      wholesale_commission: salesman.wholesale_commission || '',
      retail_commission: salesman.retail_commission || '',
      token_commission: salesman.token_commission || '',
      outlet: selectedOutlets || [],
    })
    setEditingSalesmanId(salesman.id)
    setShowCommissions(!!salesman.wholesale_commission)
  }

  const resetForm = () => {
    setFormData({
      salesman_name: '',
      wholesale_commission: '',
      retail_commission: '',
      token_commission: '',
      outlet: [],
    })
    setEditingSalesmanId(null)
    setShowCommissions(true)
  }

  const handleDelete = async (id) => {
    const shopId = localStorage.getItem('shop_id')
    try {
      await Network.delete(`${Urls.updateSalesman}/${shopId}/${id}`)
      toast.success('Salesman deleted successfully!')
      fetchSalesmen(currentPage)
    } catch (error) {
      console.error('Error deleting salesman:', error)
      toast.error('Error deleting salesman!')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="salesman-container">
      <form className="salesman-form" onSubmit={handleSubmit}>
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
          <Select
            isMulti
            name="outlet"
            options={outlets}
            onChange={handleOutletChange}
            value={formData.outlet}
            placeholder="Select outlets"
          />
        </div>
        <button type="submit" className="salesman-submit-btn">
          {editingSalesmanId ? 'Update Salesman' : 'Add Salesman'}
        </button>
      </form>

      <table className="salesman-table">
        <thead
          className="salesman-table-header"
          style={{ backgroundColor: '#007BFF', color: 'white' }}
        >
          <tr>
            <th>Salesman Name</th>
            <th>Wholesale Commission</th>
            <th>Retail Commission</th>
            <th>Token Commission</th>
            <th>Outlets</th>
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
                {salesman.outlet.length > 0
                  ? salesman.outlet.map((outlet) => outlet.outlet_name).join(', ')
                  : 'N/A'}
              </td>
              <td>
                <button onClick={() => handleEdit(salesman)}>Edit</button>
                <button onClick={() => handleDelete(salesman.id)}>Delete</button>
              </td>
            </tr>
          ))}
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

export default Salesman
