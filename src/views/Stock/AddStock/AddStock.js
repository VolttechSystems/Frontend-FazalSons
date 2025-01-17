import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './AddStock.css'
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddStock = () => {
  const [stockData, setStockData] = useState([])
  const [productList, setProductList] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedOutlet, setSelectedOutlet] = useState('') // New state for selected outlet
  const [updatedStock, setUpdatedStock] = useState({})
  const [outlets, setOutlets] = useState([])
  const { userOutlets } = useAuth()

  // Fetch outlets on component mount
  useEffect(() => {
    fetchOutlets()
  }, [])

  const fetchOutlets = async () => {
    const response = await Network.get(Urls.fetchAllOutlets)

    if (!response.ok) {
      return console.error('Failed to fetch outlets:', response.data.error)
    }

    const outlets = response.data
      .map((outlet) => {
        if (userOutlets.some((o) => o.id === outlet.id)) {
          return outlet
        }
        return null
      })
      .filter((outlet) => outlet !== null)

    setOutlets(outlets)
  }

  // Fetch products based on the selected outlet
  // const fetchProductList = async (outletId) => {
  //   if (!outletId) {
  //     setProductList([])
  //     return
  //   }

  //   try {
  //     const response = await axios.get(
  //       `http://195.26.253.123/pos/products/get_product/${outletId}/`,
  //     )
  //     setProductList(response.data)
  //   } catch (error) {
  //     console.error('Error fetching product list:', error)
  //   }
  // }

  const fetchProductList = async (outletId) => {
    if (!outletId) {
      setProductList([])
      return
    }

    try {
      const response = await Network.get(`${Urls.getProduct}/${outletId}/`)

      setProductList(response.data || [])
    } catch (error) {
      console.error('Error fetching product list:', error)
    }
  }

  // Fetch stock data when the selected product changes
  // const fetchStockData = async () => {
  //   if (!selectedProduct) {
  //     setStockData([])
  //     return
  //   }
  //   try {
  //     const encodedProductName = encodeURIComponent(selectedProduct)
  //     const response = await axios.get(
  //       `http://195.26.253.123/pos/stock/add_stock/${encodedProductName}/`,
  //     )
  //     if (Array.isArray(response.data) && response.data.length > 0) {
  //       const stockWithOriginal = response.data.map((item) => ({
  //         ...item,
  //         original_quantity: item.avail_quantity, // Store original stock value
  //       }))
  //       setStockData(stockWithOriginal)
  //     } else {
  //       setStockData([])
  //     }
  //   } catch (error) {
  //     console.error('Error fetching stock data:', error)
  //   }
  // }

  const fetchStockData = async () => {
    if (!selectedProduct) {
      setStockData([])
      return
    }

    try {
      const encodedProductName = encodeURIComponent(selectedProduct)
      const url = `${Urls.addStock}/${encodedProductName}/`
      const response = await Network.get(url)

      if (Array.isArray(response.data) && response.data.length > 0) {
        const stockWithOriginal = response.data.map((item) => ({
          ...item,
          original_quantity: item.avail_quantity, // Store original stock value
        }))
        setStockData(stockWithOriginal)
      } else {
        setStockData([])
      }
    } catch (error) {
      console.error('Error fetching stock data:', error)
    }
  }

  useEffect(() => {
    fetchStockData()
  }, [selectedProduct])

  // Fetch products when the selected outlet changes
  useEffect(() => {
    fetchProductList(selectedOutlet)
  }, [selectedOutlet])

  const handleStockInputChange = (e, sku) => {
    const { value } = e.target
    setUpdatedStock((prev) => ({
      ...prev,
      [sku]: Number(value),
    }))
  }

  const handleSubmit = async () => {
    const updatedItems = stockData
      .filter((item) => updatedStock[item.sku] !== undefined)
      .map((item) => ({
        sku: item.sku,
        avail_quantity: updatedStock[item.sku].toString(),
      }))

    if (updatedItems.length === 0) {
      alert('No changes made to stock!')
      return
    }

    try {
      await axios.put(
        `http://195.26.253.123/pos/stock/add_stock/${selectedProduct}/`,
        updatedItems,
        { headers: { 'Content-Type': 'application/json' } },
      )

      toast.success('Stock updated successfully!')

      const updatedStockData = stockData.map((item) => {
        const updatedItem = updatedItems.find((updated) => updated.sku === item.sku)
        if (updatedItem) {
          return {
            ...item,
            avail_quantity: (
              parseInt(item.original_quantity) + parseInt(updatedStock[item.sku] || 0)
            ).toString(), // Add the updated stock to the original stock
          }
        }
        return item
      })

      setStockData(updatedStockData)
      setUpdatedStock({})
      fetchStockData()
    } catch (error) {
      console.error('Error updating stock:', error)
      alert(`Error: ${error.response ? error.response.data : error.message}`)
    }
  }

  // const handleSubmit = async () => {
  //   const updatedItems = stockData
  //     .filter((item) => updatedStock[item.sku] !== undefined)
  //     .map((item) => ({
  //       sku: item.sku,
  //       avail_quantity: updatedStock[item.sku].toString(),
  //     }))

  //   if (updatedItems.length === 0) {
  //     alert('No changes made to stock!')
  //     return
  //   }

  //   try {
  //     // Using URLs.ADDSTOCK for the API call
  //     // const url = `${Urls.addStock}/${selectedProduct}/`
  //     await Network.put(`${Urls.addStock}/${selectedProduct}/`, updatedItems, { headers: { 'Content-Type': 'application/json' } })

  //     toast.success('Stock updated successfully!')

  //     const updatedStockData = stockData.map((item) => {
  //       const updatedItem = updatedItems.find((updated) => updated.sku === item.sku)
  //       if (updatedItem) {
  //         return {
  //           ...item,
  //           avail_quantity: (
  //             parseInt(item.original_quantity) + parseInt(updatedStock[item.sku] || 0)
  //           ).toString(), // Add the updated stock to the original stock
  //         }
  //       }
  //       return item
  //     })

  //     setStockData(updatedStockData)
  //     setUpdatedStock({})
  //     fetchStockData()
  //   } catch (error) {
  //     console.error('Error updating stock:', error)
  //     alert(`Error: ${error.response ? error.response.data : error.message}`)
  //   }
  // }

  return (
    <div className="container">
      <h2>Stock Management</h2>
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
      {/* Outlet Dropdown */}
      <div className="select-container">
        <select onChange={(e) => setSelectedOutlet(e.target.value)} value={selectedOutlet}>
          <option value="">Select Outlet</option>
          {outlets.map((outlet) => (
            <option key={outlet.id} value={outlet.id}>
              {outlet.outlet_name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Dropdown */}
      <div className="select-container">
        <select onChange={(e) => setSelectedProduct(e.target.value)} value={selectedProduct}>
          <option value="">Select Product</option>
          {productList.map((product) => (
            <option key={product.product_code} value={product.product_code}>
              {product.product_name}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Table */}
      {stockData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Color</th>
              <th>Size</th>
              <th>Available Quantity</th>
              <th>Add Stock</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item) => {
              const additionalStock = updatedStock[item.sku] || 0
              const newQuantity = parseInt(item.avail_quantity) + parseInt(additionalStock)
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.product_name}</td>
                  <td>{item.sku}</td>
                  <td>{item.color}</td>
                  <td>{item.size}</td>
                  <td>{newQuantity}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={updatedStock[item.sku] || ''}
                      onChange={(e) => handleStockInputChange(e, item.sku)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <p className="no-stock-message">No stock data available for the selected product.</p>
      )}

      <button onClick={handleSubmit}>Update Stock</button>
    </div>
  )
}

export default AddStock
