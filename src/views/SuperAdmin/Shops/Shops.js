import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'
import './Shops.css'

const Shops = () => {
  const [shopData, setShopData] = useState({
    name: '',
    status: '',
    no_of_outlets: '',
    no_of_registered_outlets: '',
  })

  const [shopList, setShopList] = useState([])
  const [isUpdate, setIsUpdate] = useState(false) // Track whether it's an update or add action
  const [currentShopId, setCurrentShopId] = useState(null) // Track the current shop being edited

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShopData({ ...shopData, [name]: value })
  }

  // Fetch the list of shops from the API
  const fetchShops = async () => {
    try {
      const response = await Network.get(Urls.addShops) // Replace with the actual API URL
      if (response.status === 200) {
        setShopList(response.data.results)
      }
    } catch (error) {
      console.error('Error fetching shops:', error)
      toast.error('An error occurred while fetching the shop list.')
    }
  }

  // Fetch the shop list when the component mounts
  useEffect(() => {
    fetchShops()
  }, [])

  // Handle adding or updating a shop
  const handleAddShop = async () => {
    try {
      const url = isUpdate
        ? `${Urls.actionShops}/${currentShopId}` // Update URL
        : Urls.addShops // Add URL

      const method = isUpdate ? 'put' : 'post' // PUT for update, POST for add

      const response = await Network[method](url, shopData)

      if (response.status === (isUpdate ? 200 : 201)) {
        toast.success(isUpdate ? 'Shop updated successfully!' : 'Shop added successfully!')
        fetchShops()

        setShopData({
          name: '',
          status: '',
          no_of_outlets: '',
          no_of_registered_outlets: '',
        })
        setIsUpdate(false)
        setCurrentShopId(null)
      } else {
        toast.error(isUpdate ? 'Failed to update shop.' : 'Failed to add shop.')
      }
    } catch (error) {
      console.error('Error handling shop:', error.response || error.message || error)
      toast.error(
        isUpdate
          ? 'An error occurred while updating the shop.'
          : 'An error occurred while adding shop.',
      )
    }
  }

  // Handle the Edit button click
  const handleEdit = (shop) => {
    setShopData({
      name: shop.name,
      status: shop.status,
      no_of_outlets: shop.no_of_outlets,
      no_of_registered_outlets: shop.no_of_registered_outlets,
    })
    setIsUpdate(true)
    setCurrentShopId(shop.id)
  }

  // Handle the Delete button click
  const handleDelete = async (id) => {
    try {
      const response = await Network.delete(`${Urls.actionShops}/${id}`) // Delete URL

      if (response.status === 204) {
        // Remove the deleted shop from the shopList array immediately
        setShopList(shopList.filter((shop) => shop.id !== id))

        toast.success('Shop deleted successfully!')
      } else {
        toast.error('Failed to delete shop.')
      }
    } catch (error) {
      console.error('Error deleting shop:', error.response || error.message || error)
      toast.error('An error occurred while deleting the shop.')
    }
  }

  return (
    <div className="shops-container">
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
      {/* <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Add Shops</h1> */}
      {/* Wrapper for form and table */}
      <div className="shops-wrapper">
        <h1 className="shops-header">{isUpdate ? 'Update Shop' : 'Add Shops'}</h1>

        {/* Shop Form */}
        <form className="shops-form">
          <div>
            <label>Shop Name:</label>
            <input
              type="text"
              name="name"
              value={shopData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Status:</label>
            <select name="status" value={shopData.status} onChange={handleInputChange} required>
              <option value="" disabled>
                Select Status
              </option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label>Number of Outlets Allowed:</label>
            <input
              type="number"
              name="no_of_outlets"
              value={shopData.no_of_outlets}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Number of Registered Per Outlets Allowed:</label>
            <input
              type="number"
              name="no_of_registered_outlets"
              value={shopData.no_of_registered_outlets}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <button type="button" onClick={handleAddShop}>
              {isUpdate ? 'Update Shop' : 'Add Shop'}
            </button>
          </div>
        </form>

        {/* Shop List Table */}
        <h3 className="shops-subheader">Shop List</h3>
        <table className="shops-table">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Status</th>
              <th>No. of Outlets</th>
              <th>No. of Registered Outlets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shopList.length > 0 ? (
              shopList.map((shop, index) => (
                <tr key={index}>
                  <td>{shop.name}</td>
                  <td style={{ color: shop.status === 'Active' ? 'green' : 'red' }}>
                    {shop.status}
                  </td>
                  <td>{shop.no_of_outlets}</td>
                  <td>{shop.no_of_registered_outlets}</td>
                  <td>
                    <button className="shops-edit-button" onClick={() => handleEdit(shop, index)}>
                      Edit
                    </button>
                    <button className="shops-delete-button" onClick={() => handleDelete(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No shops available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Shops
