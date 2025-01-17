import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'

const Shops = () => {
  const [shopData, setShopData] = useState({
    name: '',
    status: '',
    no_of_outlets: '',
    no_of_registered_outlets: '',
  })

  const [shopList, setShopList] = useState([])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShopData({ ...shopData, [name]: value })
  }

  // Fetch the list of shops from the API
  // Fetch the list of shops from the API
  const fetchShops = async () => {
    try {
      const response = await Network.get(Urls.addShops) // Replace with the actual API URL
      if (response.status === 200) {
        // Set the shopList with the 'results' from the API response
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

  // Handle adding a shop
  const handleAddShop = async () => {
    try {
      const response = await Network.post(Urls.addShops, shopData)

      console.log('API Response:', response.data) // Log the API response

      if (response.status === 201) {
        toast.success('Shop added successfully!')

        // Fetch updated shop list after adding the shop
        fetchShops()

        // Reset form data
        setShopData({
          name: '',
          status: '',
          no_of_outlets: '',
          no_of_registered_outlets: '',
        })
      } else {
        toast.error('Failed to add shop. Please try again.')
      }
    } catch (error) {
      console.error('Error adding shop:', error.response || error.message || error)
      toast.error('An error occurred while adding shop.')
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Add Shops</h1>

      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ccc',
          padding: '15px',
          borderRadius: '5px',
        }}
      >
        <label style={{ display: 'block', marginBottom: '5px' }}>Shop Name:</label>
        <input
          type="text"
          name="name"
          value={shopData.name}
          onChange={handleInputChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />

        <label style={{ display: 'block', marginBottom: '5px' }}>Status:</label>
        <select
          name="status"
          value={shopData.status}
          onChange={handleInputChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <label style={{ display: 'block', marginBottom: '5px' }}>Number of Outlets Allowed:</label>
        <input
          type="number"
          name="no_of_outlets"
          value={shopData.no_of_outlets}
          onChange={handleInputChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />

        <label style={{ display: 'block', marginBottom: '5px' }}>
          Number of Registered Outlets Allowed:
        </label>
        <input
          type="number"
          name="no_of_registered_outlets"
          value={shopData.no_of_registered_outlets}
          onChange={handleInputChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />

        <button
          onClick={handleAddShop}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Shop
        </button>
      </div>

      <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '24px' }}>Shop List</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #ddd' }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', borderBottom: '2px solid #ddd' }}>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontSize: '16px',
                color: '#fff',
                fontWeight: '600',
                borderRight: '1px solid #ddd',
                width: '25%', // Equal column width
              }}
            >
              Shop Name
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontSize: '16px',
                color: '#fff',
                fontWeight: '600',
                borderRight: '1px solid #ddd',
                width: '25%', // Equal column width
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontSize: '16px',
                color: '#fff',
                fontWeight: '600',
                borderRight: '1px solid #ddd',
                width: '25%', // Equal column width
              }}
            >
              No. of Outlets
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontSize: '16px',
                color: '#fff',
                fontWeight: '600',
                width: '25%', // Equal column width
              }}
            >
              No. of Registered Outlets
            </th>
          </tr>
        </thead>
        <tbody>
          {shopList.length > 0 ? (
            shopList.map((shop, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#000', // Black font color
                    fontSize: '14px',
                    borderRight: '1px solid #ddd',
                    width: '25%', // Equal column width
                  }}
                >
                  {shop.name}
                </td>
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: shop.status === 'Active' ? '#4caf50' : '#f44336', // Green for Active, Red for Inactive
                    fontSize: '14px',
                    borderRight: '1px solid #ddd',
                    width: '25%', // Equal column width
                  }}
                >
                  {shop.status}
                </td>
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#000', // Black font color
                    fontSize: '14px',
                    borderRight: '1px solid #ddd',
                    width: '25%', // Equal column width
                  }}
                >
                  {shop.no_of_outlets}
                </td>
                <td
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#000', // Black font color
                    fontSize: '14px',
                    width: '25%', // Equal column width
                  }}
                >
                  {shop.no_of_registered_outlets}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                style={{ padding: '15px', textAlign: 'center', fontSize: '14px', color: '#777' }}
              >
                No shops available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Shops
