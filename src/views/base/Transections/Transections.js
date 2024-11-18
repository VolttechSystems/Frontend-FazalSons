
// import React, { useState, useEffect } from 'react';
// import './Transections.css';
// import { CAlert, CButton } from '@coreui/react'; 


// // Helper function to group products by name
// const groupByProductName = (products) => {
//     return products.reduce((acc, product) => {
//       const { product_name, sku, size, color } = product;
      
//       // Initialize the group for this product name if it doesn't exist
//       if (!acc[product_name]) {
//         acc[product_name] = [];
//       }
      
//       // Add the product details to the group
//       acc[product_name].push({ sku, size, color });
//       return acc;
//     }, {});
//   };
  
  
  
  
// function Transections() {
//     const [products, setProducts] = useState([
//         { sku: 'YF-P1-KS-24-L-MAR', name: 'MA1 GENTS KURTA PYJAMA COMPUTER EMBROIDERY', qty: 2, price: 2995, discount: 0 },
//         { sku: 'YF-P1-KS-25-XL-MAR', name: 'MA1 GENTS KURTA PYJAMA COMPUTER EMBROIDERY', qty: 5, price: 2995, discount: 0 }
//     ]);
//     const [salesmen, setSalesmen] = useState([]);
//     const [additionalFees, setAdditionalFees] = useState([]);
//     const [deliveryFees, setDeliveryFees] = useState([]);
//     const [currentDateTime, setCurrentDateTime] = useState(new Date());
//     const [allProducts, setAllProducts] = useState([]);

//     const [alertMessage, setAlertMessage] = useState('');
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         const fetchSalesmen = async () => {
//             try {
//                 const response = await fetch('http://16.171.145.107/pos/transaction/add_salesman');
//                 const data = await response.json();
//                 if (data && Array.isArray(data)) {
//                     setSalesmen(data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching salesmen:', error);
//             }
//         };

//         const fetchAdditionalFees = async () => {
//             try {
//                 const response = await fetch('http://16.171.145.107/pos/transaction/add_additional_fee');
//                 const data = await response.json();
//                 if (data && Array.isArray(data)) {
//                     setAdditionalFees(data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching additional fees:', error);
//             }
//         };

//         const fetchDeliveryFees = async () => {
//             try {
//                 const response = await fetch('http://16.171.145.107/pos/transaction/action_additional_fee/id/');
//                 const data = await response.json();
//                 if (data && Array.isArray(data)) {
//                     setDeliveryFees(data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching delivery fees:', error);
//             }
//         };

//         const fetchAllProducts = async () => {
//             try {
//               const response = await fetch('http://16.171.145.107/pos/transaction/all_product');
//               const data = await response.json();
//               console.log("Raw API Response:", data);  // Log the raw API response
          
//               if (Array.isArray(data)) {
//                 const groupedData = groupByProductName(data);
//                 console.log("Grouped Data:", groupedData);  // Log grouped data
//                 setAllProducts(groupedData);  // Update state with grouped data
//               }
//             } catch (error) {
//               console.error('Error fetching all products:', error);
//             }
//           };
        

//         fetchSalesmen();
//         fetchAdditionalFees();
//         fetchDeliveryFees();
//         fetchAllProducts();

//         const interval = setInterval(() => {
//             setCurrentDateTime(new Date());
//         }, 1000);

//         return () => clearInterval(interval);
//     }, []);

//     const calculateTotal = () => {
//         let totalAmount = products.reduce((sum, p) => sum + (p.qty * p.price), 0);
//         let totalDiscount = products.reduce((sum, p) => sum + ((p.qty * p.price) * (p.discount / 100)), 0);
//         let netTotal = totalAmount - totalDiscount;
//         return { totalAmount, totalDiscount, netTotal };
//     };

//     const { totalAmount, totalDiscount, netTotal } = calculateTotal();

//     const formatDateTime = (date) => {
//         return date.toLocaleTimeString() + ' | ' + date.toLocaleDateString(undefined, {
//             weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
//         });
//     };

//     // Function to handle button click and show alert
//     const handleButtonClick = (message) => {
//         setAlertMessage(message);
//         setVisible(true);
//     };

//     return (
//         <div className="transactions-page">
//             <header className="t-header">
//                 <h1 className="t-logo">FAZAL SONS</h1>
//                 <div className="t-header-info">
//                     <button className="t-header-button" onClick={() => handleButtonClick("Today's Sales clicked!")}>Today Sales</button>
//                     <button className="t-header-button" onClick={() => handleButtonClick("Sales Return clicked!")}>Sales Return</button>
//                     <button className="t-header-button" onClick={() => handleButtonClick("Due Receivable clicked!")}>Due Receivable</button>
//                     <button className="t-header-button" onClick={() => handleButtonClick("Close Till clicked!")}>Close Till</button>
//                     <span className="t-date-time">{formatDateTime(currentDateTime)} | IP: 39.55.138.194</span>
//                 </div>
//                 <div className="t-profile">
//                     <span className="t-notification-badge">5</span>
//                     <span className="t-profile-name">Ali Tehseen</span>
//                 </div>
//             </header>

//             {/* Displaying the alert */}
//             <CAlert color="primary" dismissible visible={visible} onClose={() => setVisible(false)}>
//                 {alertMessage}
//             </CAlert>

//             <section className="customer-section">
//                 <select className="customer-select">
//                     <option>Walk-In Customer</option>
//                 </select>
//                 <button className="add-customer">+</button>
//                 <select className="salesman-select">
//                     <option>Select Salesman</option>
//                     {salesmen.map((salesman) => (
//                         <option key={salesman.id} value={salesman.id}>
//                             {salesman.salesman_name}
//                         </option>
//                     ))}
//                 </select>
//                 <select className="product-dropdown">
//   <option>Select Product</option>
//   {Object.entries(allProducts).map(([productName, productDetails]) => (
//     <optgroup key={productName} label={productName}>
//       {productDetails.map((product) => (
//         <option key={product.sku} value={product.sku}>
//           {product.sku} - Size: {product.size} - Color: {product.color}
//         </option>
//       ))}
//     </optgroup>
//   ))}
// </select>




//             </section>

//             <table className="product-table">
//                 <thead>
//                     <tr>
//                         <th>SKU</th>
//                         <th>Product Name</th>
//                         <th>Qty</th>
//                         <th>Price</th>
//                         <th>Amount</th>
//                         <th>Disc. %</th>
//                         <th>Disc. Value</th>
//                         <th>Net Amount</th>
//                         <th>Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products.map((product, index) => (
//                         <tr key={index}>
//                             <td>{product.sku}</td>
//                             <td>{product.name}</td>
//                             <td><input type="number" value={product.qty} className="qty-input" readOnly /></td>
//                             <td>{product.price}</td>
//                             <td>{product.qty * product.price}</td>
//                             <td><input type="number" value={product.discount} className="discount-input" readOnly /></td>
//                             <td>{(product.qty * product.price) * (product.discount / 100)}</td>
//                             <td>{product.qty * product.price - ((product.qty * product.price) * (product.discount / 100))}</td>
//                             <td><button className="remove-button">✖</button></td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <section className="sales-box">
//                 <div className="fee-select">
//                     <label>Additional Fee:</label>
//                     <select className="additional-fee-select">
//                         <option>Select Additional Fee</option>
//                         {additionalFees.map((fee) => (
//                             <option key={fee.id} value={fee.id}>
//                                 {fee.name} - {fee.amount}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="fee-select">
//                     <label>Delivery Fee:</label>
//                     <select className="delivery-fee-select">
//                         <option>Select Delivery Fee</option>
//                         {deliveryFees.map((fee) => (
//                             <option key={fee.id} value={fee.id}>
//                                 {fee.name} - {fee.amount}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </section>

//             <section className="summary-section">
//                 <div className="summary-details">
//                     <div>Products: {products.length}</div>
//                     <div>Sale: {totalAmount}</div>
//                     <div>Purchase: 9100</div>
//                     <div>Profit: {totalAmount - 9100}</div>
//                 </div>
//                 <div className="invoice-summary">
//                     <div>Gross: {totalAmount}</div>
//                     <div>Discount: {totalDiscount}</div>
//                     <div>Net Total: {netTotal}</div>
//                 </div>
//             </section>
//         </div>
//     );
// }

// export default Transections;


import React, { useState, useEffect } from 'react';
import './Transections.css';
import { CAlert, CButton } from '@coreui/react'; 

// Helper function to group products by name
const groupByProductName = (products) => {
    return products.reduce((acc, product) => {
      const { product_name, sku, size, color } = product;
      
      // Initialize the group for this product name if it doesn't exist
      if (!acc[product_name]) {
        acc[product_name] = [];
      }
      
      // Add the product details to the group
      acc[product_name].push({ sku, size, color });
      return acc;
    }, {});
};

function Transections() {
    const [products, setProducts] = useState([]);  // List of products in the table
    const [salesmen, setSalesmen] = useState([]);
    const [additionalFees, setAdditionalFees] = useState([]);
    const [deliveryFees, setDeliveryFees] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [allProducts, setAllProducts] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [productDetails, setProductDetails] = useState({});

    useEffect(() => {
        const fetchSalesmen = async () => {
            try {
                const response = await fetch('http://16.171.145.107/pos/transaction/add_salesman');
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    setSalesmen(data);
                }
            } catch (error) {
                console.error('Error fetching salesmen:', error);
            }
        };

        const fetchAdditionalFees = async () => {
            try {
                const response = await fetch('http://16.171.145.107/pos/transaction/add_additional_fee');
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    setAdditionalFees(data);
                }
            } catch (error) {
                console.error('Error fetching additional fees:', error);
            }
        };

        const fetchDeliveryFees = async () => {
            try {
                const response = await fetch('http://16.171.145.107/pos/transaction/action_additional_fee/id/');
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    setDeliveryFees(data);
                }
            } catch (error) {
                console.error('Error fetching delivery fees:', error);
            }
        };

        const fetchAllProducts = async () => {
            try {
              const response = await fetch('http://16.171.145.107/pos/transaction/all_product');
              const data = await response.json();
              console.log("Raw API Response:", data);  // Log the raw API response
          
              if (Array.isArray(data)) {
                const groupedData = groupByProductName(data);
                console.log("Grouped Data:", groupedData);  // Log grouped data
                setAllProducts(groupedData);  // Update state with grouped data
              }
            } catch (error) {
              console.error('Error fetching all products:', error);
            }
          };

        fetchSalesmen();
        fetchAdditionalFees();
        fetchDeliveryFees();
        fetchAllProducts();

        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const calculateTotal = () => {
        let totalAmount = products.reduce((sum, p) => sum + (p.qty * p.price), 0);
        let totalDiscount = products.reduce((sum, p) => sum + ((p.qty * p.price) * (p.discount / 100)), 0);
        let netTotal = totalAmount - totalDiscount;
        return { totalAmount, totalDiscount, netTotal };
    };

    const { totalAmount, totalDiscount, netTotal } = calculateTotal();

    const formatDateTime = (date) => {
        return date.toLocaleTimeString() + ' | ' + date.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    // Function to handle button click and show alert
    const handleButtonClick = (message) => {
        setAlertMessage(message);
        setVisible(true);
    };

    // Function to handle product selection from dropdown
    const handleProductSelect = async (event) => {
        const selectedSku = event.target.value;
        if (selectedSku) {
            try {
                const response = await fetch(`http://16.171.145.107/pos/transaction/products_detail/${selectedSku}`);
                const data = await response.json();
                console.log("Product Details:", data); 
                if (data && Array.isArray(data) && data.length > 0) {
                    setProductDetails(data[0]);  
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        }
    };

    return (
        <div className="transactions-page">
            <header className="t-header">
                <h1 className="t-logo">FAZAL SONS</h1>
                <div className="t-header-info">
                    <button className="t-header-button" onClick={() => handleButtonClick("Today's Sales clicked!")}>Today Sales</button>
                    <button className="t-header-button" onClick={() => handleButtonClick("Sales Return clicked!")}>Sales Return</button>
                    <button className="t-header-button" onClick={() => handleButtonClick("Due Receivable clicked!")}>Due Receivable</button>
                    <button className="t-header-button" onClick={() => handleButtonClick("Close Till clicked!")}>Close Till</button>
                    <span className="t-date-time">{formatDateTime(currentDateTime)} | IP: 39.55.138.194</span>
                </div>
                <div className="t-profile">
                    <span className="t-notification-badge">5</span>
                    <span className="t-profile-name">Ali Tehseen</span>
                </div>
            </header>

            
            <CAlert color="primary" dismissible visible={visible} onClose={() => setVisible(false)}>
                {alertMessage}
            </CAlert>

            <section className="customer-section">
                <select className="customer-select">
                    <option>Walk-In Customer</option>
                </select>
                <button className="add-customer">+</button>
                <select className="salesman-select">
                    <option>Select Salesman</option>
                    {salesmen.map((salesman) => (
                        <option key={salesman.id} value={salesman.id}>
                            {salesman.salesman_name}
                        </option>
                    ))}
                </select>
                <select className="product-dropdown" onChange={handleProductSelect}>
                    <option>Select Product</option>
                    {Object.entries(allProducts).map(([productName, productDetails]) => (
                        <optgroup key={productName} label={productName}>
                            {productDetails.map((product) => (
                                <option key={product.sku} value={product.sku}>
                                    {product.sku} - Size: {product.size} - Color: {product.color}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </section>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Disc. %</th>
                        <th>Disc. Value</th>
                        <th>Net Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.sku}</td>
                            <td>{product.name}</td>
                            <td><input type="number" value={product.qty} className="qty-input" readOnly /></td>
                            <td>{product.price}</td>
                            <td>{product.qty * product.price}</td>
                            <td><input type="number" value={product.discount} className="discount-input" readOnly /></td>
                            <td>{(product.qty * product.price) * (product.discount / 100)}</td>
                            <td>{product.qty * product.price - ((product.qty * product.price) * (product.discount / 100))}</td>
                            <td><button className="remove-button">✖</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <section className="sales-box">
                <div className="fee-select">
                    <label>Additional Fee:</label>
                    <select className="additional-fee-select">
                        <option>Select Additional Fee</option>
                        {additionalFees.map((fee) => (
                            <option key={fee.id} value={fee.id}>
                                {fee.name} - {fee.amount}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="fee-select">
                    <label>Delivery Fee:</label>
                    <select className="delivery-fee-select">
                        <option>Select Delivery Fee</option>
                        {deliveryFees.map((fee) => (
                            <option key={fee.id} value={fee.id}>
                                {fee.name} - {fee.amount}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <section className="summary-section">
                <div className="summary-details">
                    <div>Products: {products.length}</div>
                    <div>Sale: {totalAmount}</div>
                    <div>Purchase: 9100</div>
                    <div>Profit: {totalAmount - 9100}</div>
                </div>
                <div className="invoice-summary">
                    <div>Gross: {totalAmount}</div>
                    <div>Discount: {totalDiscount}</div>
                    <div>Net Total: {netTotal}</div>
                </div>
            </section>
        </div>
    );
}

export default Transections;
