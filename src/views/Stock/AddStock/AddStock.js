import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './AddStock.css'

const AddStock = () => {
  const [stockData, setStockData] = useState([])
  const [productList, setProductList] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [updatedStock, setUpdatedStock] = useState({})

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axios.get('http://195.26.253.123/pos/products/get_product/')
        setProductList(response.data)
      } catch (error) {
        console.error('Error fetching product list:', error)
      }
    }
    fetchProductList()
  }, [])

  // Fetch stock data when selectedProduct changes
  const fetchStockData = async () => {
    if (!selectedProduct) {
      setStockData([])
      return
    }
    try {
      const encodedProductName = encodeURIComponent(selectedProduct)
      const response = await axios.get(
        `http://195.26.253.123/pos/stock/add_stock/${encodedProductName}/`,
      )
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

      alert('Stock updated successfully!')

      // Update stockData to reflect changes on the frontend
      // console.log('maaz')
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

  return (
    <div className="container">
      <h2>Stock Management</h2>

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
              const additionalStock = updatedStock[item.sku] || 0 // Get the user-entered stock
              const newQuantity = parseInt(item.avail_quantity) + parseInt(additionalStock) // Sum of original + added stock
              console.log(newQuantity, 'maaz2')
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.product_name}</td>
                  <td>{item.sku}</td>
                  <td>{item.color}</td>
                  <td>{item.size}</td>
                  <td>{newQuantity}</td> {/* Display updated quantity */}
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
