import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'

const Shops = () => {
  const [shopData, setShopData] = useState({
    name: '',
    status: 'Active',
    no_of_outlets: '',
    no_of_registered_outlets: '',
  })

  const [shopList, setShopList] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShopData({ ...shopData, [name]: value })
  }

  const handleAddShop = async () => {
    try {
      //   const response = await axios.post('http://195.26.253.123/pos/admin/add_shop', shopData);

      const response = await Network.post(Urls.addShops, shopData)

      if (response.status === 200) {
        setShopList([...shopList, response.data])
        setShopData({
          name: '',
          status: 'Active',
          no_of_outlets: '',
          no_of_registered_outlets: '',
        })
      } else {
        toast.success('Shop added successfully!')
      }
    } catch (error) {
      console.error('Error adding shop:', error)
      toast.error('An error occured while adding shops')
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

      <h2 style={{ marginBottom: '10px' }}>Shop List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Shop Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>No. of Outlets</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>No. of Registered Outlets</th>
          </tr>
        </thead>
        <tbody>
          {shopList.map((shop, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{shop.name}</td>
              <td style={{ padding: '10px' }}>{shop.status}</td>
              <td style={{ padding: '10px' }}>{shop.no_of_outlets}</td>
              <td style={{ padding: '10px' }}>{shop.no_of_registered_outlets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Shops
