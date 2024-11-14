

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './AddStock.css';

// const AddStock = () => {
//   const [stockData, setStockData] = useState([]);
//   const [updatedQuantities, setUpdatedQuantities] = useState({});
//   const [productList, setProductList] = useState([]); 
//   const [selectedProduct, setSelectedProduct] = useState(''); 

  
//   useEffect(() => {
//     const fetchProductList = async () => {
//       try {
//         const response = await axios.get('http://16.171.145.107/pos/products/get_all_product/');
//         console.log('Product list fetched:', response.data); 
//         setProductList(response.data); 
//       } catch (error) {
//         console.error('Error fetching product list:', error);
//       }
//     };
//     fetchProductList();
//   }, []);


//   useEffect(() => {
//     if (selectedProduct) {
//       const fetchStockData = async () => {
//         try {
//           console.log(`Fetching stock data for product: ${selectedProduct}`);
//           const response = await axios.get(
//             `http://16.171.145.107/pos/stock/add_stock/${selectedProduct}/`
//           );
//           console.log('Stock data fetched:', response.data); 
//           if (response.data.length > 0) {
//             setStockData(response.data);
//           } else {
//             console.log('No stock data found for this product.');
//             setStockData([]); 
//           }
//         } catch (error) {
//           console.error('Error fetching stock data:', error);
//         }
//       };
//       fetchStockData();
//     }
//   }, [selectedProduct]); 


//   const handleQuantityChange = (id, value) => {
//     setUpdatedQuantities((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };


//   const updateAllSizes = async () => {
//     const productsToUpdate = stockData.map((item) => {
//       const addedQuantity = Number(updatedQuantities[item.id]) || 0;
//       const size = item.size + addedQuantity;

//       return {
//         id: item.id,
//         product_name: item.product_name,
//         sku: item.sku,
//         color: item.color,
//         size: size, 
//       };
//     });

//     try {
//       const response = await axios.put(
//         `http://16.171.145.107/pos/stock/add_stock/${selectedProduct}/`,
//         productsToUpdate,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 200) {
      
//         setStockData(productsToUpdate);
//         console.log('All sizes updated successfully!');
//         setUpdatedQuantities({});
//       }
//     } catch (error) {
//       console.error('Error updating sizes:', error);
//     }
//   };

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
//             <option key={product.id} value={product.id}>
//               {product.product_name}
//             </option>
//           ))}
//         </select>
//       </div>

    
//       <div>
//         <p>Selected Product: {selectedProduct}</p>
//         <p>Stock Data: {JSON.stringify(stockData)}</p>
//       </div>

     
//       <table border="1" style={{ width: '100%', textAlign: 'center' }}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Product Name</th>
//             <th>SKU</th>
//             <th>Color</th>
//             <th>Available Quantity</th>
//             <th>New Quantity</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stockData.length > 0 ? (
//             stockData.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.id}</td>
//                 <td>{item.product_name}</td>
//                 <td>{item.sku}</td>
//                 <td>{item.color}</td>
//                 <td>{item.avail_quantity}</td> 
//                 <td>
//                   <input
//                     type="number"
//                     value={updatedQuantities[item.id] || ''}
//                     onChange={(e) =>
//                       handleQuantityChange(item.id, e.target.value)
//                     }
//                     placeholder="Enter quantity to add"
//                   />
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
              
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <button onClick={updateAllSizes} style={{ marginTop: '20px' }}>
//         Update All
//       </button>
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

  // Fetch product list on component mount
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axios.get('http://16.171.145.107/pos/products/get_all_product/');
        console.log('Product list fetched:', response.data);  // Log the product list
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
          // Log the selected product
          console.log(`Selected Product: ${selectedProduct}`);
          
          const encodedProductName = encodeURIComponent(selectedProduct);
          console.log(`Encoded Product Name: ${encodedProductName}`);

          // Fetch stock data
          const response = await axios.get(
            `http://16.171.145.107/pos/stock/add_stock/${encodedProductName}/`
          );
          
          console.log('Stock data fetched:', response.data);  // Log the stock data

          if (Array.isArray(response.data) && response.data.length > 0) {
            setStockData(response.data);
          } else {
            console.log('No stock data found for this product.'); 
            setStockData([]);  // Reset to empty if no stock data
          }
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      };

      fetchStockData();
    } else {
      setStockData([]);  // Clear stock data if no product is selected
    }
  }, [selectedProduct]);

  return (
    <div>
      <h2>Stock Management</h2>
      
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <select
          onChange={(e) => setSelectedProduct(e.target.value)}
          value={selectedProduct}
        >
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
                <td>{item.avail_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stock data available for the selected product.</p>
      )}
    </div>
  );
};

export default AddStock;
