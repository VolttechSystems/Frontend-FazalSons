import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddStock.css';

const AddStock = () => {
  const [stockData, setStockData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [updatedStock, setUpdatedStock] = useState({});

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axios.get('http://195.26.253.123/pos/products/get_product/');
        setProductList(response.data);
      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    };
    fetchProductList();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const fetchStockData = async () => {
        try {
          const encodedProductName = encodeURIComponent(selectedProduct);
          const response = await axios.get(
            `http://195.26.253.123/pos/stock/add_stock/${encodedProductName}/`
          );
          if (Array.isArray(response.data) && response.data.length > 0) {
            setStockData(response.data);
          } else {
            setStockData([]);
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      };
      fetchStockData();
    } else {
      setStockData([]);
    }
  }, [selectedProduct]);

  const handleStockInputChange = (e, sku) => {
    const { value } = e.target;
    setUpdatedStock((prev) => ({
      ...prev,
      [sku]: Number(value),
    }));
  };

  const handleSubmit = async () => {
    const updatedItems = stockData
      .filter((item) => {
        const additionalQuantity = updatedStock[item.sku] || 0;
        const newQuantity = (parseInt(item.avail_quantity) + additionalQuantity).toString();
        return newQuantity !== item.avail_quantity.toString();
      })
      .map((item) => {
        const additionalQuantity = updatedStock[item.sku] || 0;
        const newQuantity = (parseInt(item.avail_quantity) + additionalQuantity).toString();
        return {
          avail_quantity: newQuantity,
          sku: item.sku,
        };
      });

    if (updatedItems.length === 0) {
      return;
    }

    try {
      const response = await axios.put(
        `http://195.26.253.123/pos/stock/add_stock/${selectedProduct}/`,
        updatedItems,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const updatedStockData = stockData.map((item) => {
        const updatedItem = updatedItems.find((updated) => updated.sku === item.sku);
        if (updatedItem) {
          return { ...item, avail_quantity: updatedItem.avail_quantity };
        }
        return item;
      });
      setStockData(updatedStockData);
      setUpdatedStock({});
    } catch (error) {
      console.error('Error updating stock:', error.response ? error.response.data : error.message);
      alert(`Error: ${error.response ? error.response.data : error.message}`);
    }
  };

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
            {stockData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.product_name}</td>
                <td>{item.sku}</td>
                <td>{item.color}</td>
                <td>{item.size}</td>
                <td>{item.avail_quantity + (updatedStock[item.sku] || 0)}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={updatedStock[item.sku] || ''}
                    onChange={(e) => handleStockInputChange(e, item.sku)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-stock-message">No stock data available for the selected product.</p>
      )}

      <button onClick={handleSubmit}>Update Stock</button>
    </div>
  );
};

export default AddStock;
