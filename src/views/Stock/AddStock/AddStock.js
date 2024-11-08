// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './AddStock.css';

// const AddStock = () => {
//   const [stockData, setStockData] = useState([]);
//   const [updatedQuantities, setUpdatedQuantities] = useState({});

//   useEffect(() => {
//     const fetchStockData = async () => {
//       try {
//         const response = await axios.get(
//           'http://16.171.145.107/pos/stock/add_stock/BW13%20GENTS%20KURTA%20SHLAWAR%20BAZOO%20GESIGN/'
//         );
//         setStockData(response.data);
//       } catch (error) {
//         console.error('Error fetching stock data:', error);
//       }
//     };
//     fetchStockData();
//   }, []);

//   const handleQuantityChange = (id, value) => {
//     setUpdatedQuantities((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   const handleKeyDown = async (e, id, currentQuantity, productName) => {
//     if (e.key === 'Enter') {
//       const addedQuantity = Number(updatedQuantities[id]);
//       if (!isNaN(addedQuantity) && addedQuantity > 0) {
//         const newQuantity = currentQuantity + addedQuantity;

//         // Find all products with the same product name
//         const productsToUpdate = stockData.filter(
//           (item) => item.product_name === productName
//         ).map((item) => ({
//           ...item,
//           avail_quantity:
//             item.id === id ? newQuantity : item.avail_quantity,
//         }));

//         try {
//           const response = await axios.put(
//             `http://16.170.232.76/pos/stock/add_stock/BW13%20GENTS%20KURTA%20SHLAWAR%20BAZOO%20GESIGN/`,
//             productsToUpdate,
//             {
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//             }
//           );

//           if (response.status === 200) {
//             // Update the local state with the new quantities
//             setStockData((prevData) =>
//               prevData.map((item) =>
//                 item.product_name === productName
//                   ? {
//                       ...item,
//                       avail_quantity:
//                         item.id === id ? newQuantity : item.avail_quantity,
//                     }
//                   : item
//               )
//             );
//             alert('Quantities updated successfully!');
//             setUpdatedQuantities((prev) => ({
//               ...prev,
//               [id]: '',
//             }));
//           }
//         } catch (error) {
//           console.error('Error updating quantities:', error);
//           console.error('Response data:', error.response?.data);
//           alert('Failed to update quantities.');
//         }
//       } else {
//         alert('Please enter a valid quantity greater than zero.');
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Stock Management</h2>
//       <table border="1" style={{ width: '100%', textAlign: 'center' }}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Product Name</th>
//             <th>SKU</th>
//             <th>Color</th>
//             <th>Size</th>
//             <th>Available Quantity</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stockData.map((item) => (
//             <tr key={item.id}>
//               <td>{item.id}</td>
//               <td>{item.product_name}</td>
//               <td>{item.sku}</td>
//               <td>{item.color}</td>
//               <td>{item.size}</td>
//               <td>
//                 {item.avail_quantity}
//                 <input
//                   type="number"
//                   value={updatedQuantities[item.id] || ''}
//                   onChange={(e) =>
//                     handleQuantityChange(item.id, e.target.value)
//                   }
//                   onKeyDown={(e) =>
//                     handleKeyDown(
//                       e,
//                       item.id,
//                       Number(item.avail_quantity),
//                       item.product_name
//                     )
//                   }
//                   placeholder="Enter quantity"
//                   style={{ marginLeft: '10px' }}
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AddStock;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddStock.css';

const AddStock = () => {
  const [stockData, setStockData] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});

  // Fetch stock data on component mount
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          'http://16.171.145.107/pos/stock/add_stock/BW13%20GENTS%20KURTA%20SHLAWAR%20BAZOO%20GESIGN/'
        );
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };
    fetchStockData();
  }, []);

  // Track quantity input for each item
  const handleQuantityChange = (id, value) => {
    setUpdatedQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Update all sizes in one API request
  const updateAllSizes = async () => {
    const productsToUpdate = stockData.map((item) => {
      const addedQuantity = Number(updatedQuantities[item.id]) || 0;
      const size = item.size + addedQuantity;

      return {
        id: item.id,
        product_name: item.product_name,
        sku: item.sku,
        color: item.color,
        size: size, // Update size by adding the new quantity
      };
    });

    try {
      const response = await axios.put(
        'http://16.171.145.107/pos/stock/add_stock/BW13%20GENTS%20KURTA%20SHLAWAR%20BAZOO%20GESIGN/',
        productsToUpdate,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Update the local state with the new sizes
        setStockData(productsToUpdate);
        console.log('All sizes updated successfully!');
        setUpdatedQuantities({});
      }
    } catch (error) {
      console.error('Error updating sizes:', error);
      
    }
  };

  return (
    <div>
      <h2>Stock Management</h2>
      <table border="1" style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Color</th>
            <th>Available Quantity</th>
            <th>New Quantity</th>
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
              <td>
                <input
                  type="number"
                  value={updatedQuantities[item.id] || ''}
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                  placeholder="Enter quantity to add"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={updateAllSizes} style={{ marginTop: '20px' }}>
        Update All
      </button>
    </div>
  );
};

export default AddStock;
