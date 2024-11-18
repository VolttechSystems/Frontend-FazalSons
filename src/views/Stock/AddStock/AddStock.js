

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './AddStock.css';

// const AddStock = () => {
//   const [stockData, setStockData] = useState([]);
//   const [productList, setProductList] = useState([]); 
//   const [selectedProduct, setSelectedProduct] = useState(''); 

//   // Fetch product list on component mount
//   useEffect(() => {
//     const fetchProductList = async () => {
//       try {
//         const response = await axios.get('http://16.171.145.107/pos/products/get_all_product/');
//         console.log('Product list fetched:', response.data);  // Log the product list
//         setProductList(response.data); 
//       } catch (error) {
//         console.error('Error fetching product list:', error);
//       }
//     };
//     fetchProductList();
//   }, []);

//   // Fetch stock data when a product is selected
//   useEffect(() => {
//     if (selectedProduct) {
//       const fetchStockData = async () => {
//         try {
//           // Log the selected product
//           console.log(`Selected Product: ${selectedProduct}`);
          
//           const encodedProductName = encodeURIComponent(selectedProduct);
//           console.log(`Encoded Product Name: ${encodedProductName}`);

//           // Fetch stock data
//           const response = await axios.get(
//             `http://16.171.145.107/pos/stock/add_stock/${encodedProductName}/`
//           );
          
//           console.log('Stock data fetched:', response.data);  // Log the stock data

//           if (Array.isArray(response.data) && response.data.length > 0) {
//             setStockData(response.data);
//           } else {
//             console.log('No stock data found for this product.'); 
//             setStockData([]);  // Reset to empty if no stock data
//           }
//         } catch (error) {
//           console.error('Error fetching stock data:', error);
//         }
//       };

//       fetchStockData();
//     } else {
//       setStockData([]);  // Clear stock data if no product is selected
//     }
//   }, [selectedProduct]);

//   return (
//     <div>
//       <h2>Stock Management</h2>
      
//       <div style={{ textAlign: 'right', marginBottom: '20px' }}>
//         <select
//           onChange={(e) => setSelectedProduct(e.target.value)}
//           value={selectedProduct}
//         >
//           <option value="">Select Product</option>
//           {productList.map((product) => (
//             <option key={product.product_code} value={product.product_code}>
//               {product.product_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {stockData.length > 0 ? (
//         <table border="1" style={{ width: '100%', textAlign: 'center' }}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Product Name</th>
//               <th>SKU</th>
//               <th>Color</th>
//               <th>Size</th>
//               <th>Available Quantity</th>
//             </tr>
//           </thead>
//           <tbody>
//             {stockData.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.id}</td>
//                 <td>{item.product_name}</td>
//                 <td>{item.sku}</td>
//                 <td>{item.color}</td>
//                 <td>{item.size}</td>
//                 <td>{item.avail_quantity}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No stock data available for the selected product.</p>
//       )}
//     </div>
//   );
// };

// export default AddStock;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddStock.css';

const AddStock = () => {
  const [stockData, setStockData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [updatedStock, setUpdatedStock] = useState({});

  // Fetch product list on component mount
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axios.get('http://16.171.145.107/pos/products/get_all_product/');
        console.log('Product list fetched:', response.data); // Log the product list
        setProductList(response.data);
      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    };
    fetchProductList();
  }, []);

  // Fetch stock data when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      const fetchStockData = async () => {
        try {
          const encodedProductName = encodeURIComponent(selectedProduct);
          const response = await axios.get(
            `http://16.171.145.107/pos/stock/add_stock/${encodedProductName}/`
          );
          console.log('Stock data fetched:', response.data);
          if (Array.isArray(response.data) && response.data.length > 0) {
            setStockData(response.data);
          } else {
            setStockData([]); // Reset to empty if no stock data
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

  // Handle stock update input change
  const handleStockInputChange = (e, sku) => {
    const { value } = e.target;
    setUpdatedStock((prev) => ({
      ...prev,
      [sku]: Number(value), // Store the added quantity for each SKU
    }));
  };

  // Handle form submission to update stock quantities
  const handleSubmit = async () => {
  // Construct the payload with the correct structure
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
        "avail_quantity": newQuantity, // Ensure this is a string
        "sku": item.sku
      };
    });

  if (updatedItems.length === 0) {
    console.log("No stock data was updated.");
    return;
  }

  // Log the exact payload to be sent
  console.log('Payload to be sent:', JSON.stringify(updatedItems));

  try {
    const response = await axios.put(
      `http://16.171.145.107/pos/stock/add_stock/${selectedProduct}/`, // Ensure the endpoint ends with `/`
      updatedItems, // Send `updatedItems` directly
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log('Stock updated successfully:', response.data);

    // Update stock data with new quantities after successful update
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
    <div>
      <h2>Stock Management</h2>

      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
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
        <table border="1" style={{ width: '100%', textAlign: 'center' }}>
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
                <td>{item.avail_quantity + (updatedStock[item.sku] || 0)}</td> {/* Show current quantity with updates */}
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
        <p>No stock data available for the selected product.</p>
      )}

      <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
        Update Stock
      </button>
    </div>
  );
};

export default AddStock;
