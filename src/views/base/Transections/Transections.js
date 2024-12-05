
import React, { useState, useEffect } from 'react';
import './Transections.css';
import { CAlert, CButton } from '@coreui/react'; 

// Helper function to group products by name
const groupByProductName = (products) => {
    return products.reduce((acc, product) => {
      const { sku, product_name, item_name, color } = product;
      const groupName = product_name || "Uncategorized"; // Handle null product_name
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push({ sku, item_name, color });
      return acc;
    }, {});
  };


  function Transections() {
    const [products, setProducts] = useState([]); // List of products in the table
    const [salesmen, setSalesmen] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [additionalFees, setAdditionalFees] = useState([]);
    const [deliveryFees, setDeliveryFees] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [allProducts, setAllProducts] = useState({});
    const [alertMessage, setAlertMessage] = useState("");
    const [visible, setVisible] = useState(false);
    const [productDetails, setProductDetails] = useState({});
    const [selectedSKU, setSelectedSKU] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [tableData, setTableData] = useState([]);
  
   

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
        const response = await fetch(
          "http://16.171.145.107/pos/transaction/all_product"
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          const groupedData = groupByProductName(data);
          setAllProducts(groupedData);
        }
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    const fetchCustomer = async () => {
      try {
          const response = await fetch('http://16.171.145.107/pos/customer/add_customer');
          const data = await response.json();
          if (data && Array.isArray(data)) {
              setCustomer(data);
          }
      } catch (error) {
          console.error('Error fetching salesmen:', error);
      }
  };

   

        fetchSalesmen();
        fetchAdditionalFees();
        fetchDeliveryFees();
        fetchAllProducts();
        fetchCustomer();

        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);


   // Fetch product details by SKU and add to the table
   const fetchProductDetails = async (sku) => {
    console.log("Fetching product details for SKU:", sku); // Debug log
    try {
      const response = await fetch(
        `http://16.171.145.107/pos/transaction/products_detail/${sku}/`
      );
      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);
        return;
      }
      const product = await response.json();
      console.log("Product Details Fetched:", product); // Debug log
      setTableData((prevTableData) => [
        ...prevTableData,
        {
          sku: product.sku || "N/A",
          product_name: product.product_name || "Unknown Product",
          quantity: 1,
          discount: 0,
          selling_price: product.selling_price || 0,
        },
      ]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  
  
  useEffect(() => {
    console.log("Updated Table Data:", tableData);
  }, [tableData]);

  
  const groupByProductName = (products) => {
    return products.reduce((acc, product) => {
      const { sku, product_name, item_name, color } = product;
      const groupName = product_name || "Uncategorized"; // Fallback for null names
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push({
        sku,
        item_name: item_name || "Unnamed Item",
        color: color || "",
      });
      return acc;
    }, {});
  };
  
  const handlePayment = async () => {
    const payload = {
      sku: tableData.map((item) => item.sku),
      quantity: tableData.map((item) => item.quantity),
      rate: tableData.map((item) => item.selling_price),
      item_discount: tableData.map((item) => item.discount),
      cust_code: selectedCustomer,
      overall_discount: "0", // Adjust if you have an overall discount field
      outlet_code: "1", // Replace with dynamic outlet code if applicable
      saleman_code: selectedSalesman,
      advanced_payment: "0",
      additional_fee_code: "",
      additional_fee: "",
    };
  
    try {
      const response = await fetch("http://16.171.145.107/pos/transaction/add_transaction", {
        method: "POST", // Changed to POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send payload as body
      });
  
      if (response.ok) {
        const result = await response.json();
        setAlertMessage("Transaction added successfully!");
        setVisible(true);
      } else {
        setAlertMessage("Failed to add transaction!");
        setVisible(true);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setAlertMessage("An error occurred while processing the payment.");
      setVisible(true);
    }
  };

  
    // Handle SKU selection
    const handleProductSelect = (e) => {
        const sku = e.target.value;
        console.log("Selected SKU:", sku); // Debug log
        if (sku && sku !== "Select Product") {
          fetchProductDetails(sku);
        }
      };
      
      

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

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };


    // Function to handle button click and show alert
    const handleButtonClick = (message) => {
        setAlertMessage(message);
        setVisible(true);
    };

    const handleCustomerChange = (e) => {
      const value = e.target.value;
      setSelectedCustomer(value);
      console.log("Selected Customer:", value); // Debugging log
    };
    
    const handleSalesmanChange = (e) => {
      const value = e.target.value;
      setSelectedSalesman(value);
      console.log("Selected Salesman:", value); // Debugging log
    };
    


    return (
        <div className="transactions-page">
            <header className="t-header">
                {/* Fullscreen Toggle Button */}
                

                {/* <h1 className="t-logo">FAZAL SONS</h1> */}
                <div className="t-header-info">
                    <button className="t-header-button" onClick={() => handleButtonClick("Today's Sales clicked!")}>Today Sales</button>
                    <button className="t-header-button" onClick={() => handleButtonClick("Sales Return clicked!")}>Sales Return</button>
                    <button className="t-header-button" onClick={() => handleButtonClick("Due Receivable clicked!")}>Due Receivable</button>
                    <button className="t-header-button" onClick={() => handleButtonClick("Close Till clicked!")}>Close Till</button>
                    <span className="t-date-time">{formatDateTime(currentDateTime)} | IP: 39.55.138.194</span>
                </div>
                {/* <div className="t-profile">
                    <span className="t-notification-badge">5</span>
                    <span className="t-profile-name">Ali Tehseen</span>
                </div> */}
                <button 
                    className="fullscreen-toggle" 
                    onClick={toggleFullScreen}
                >
                    Fullscreen
                </button>
            </header>

            
            <CAlert color="primary" dismissible visible={visible} onClose={() => setVisible(false)}>
                {alertMessage}
            </CAlert>

            <section className="customer-section">
               
            <select
  className="customer-select"
  onChange={handleCustomerChange}
        >
          <option>Select Customer</option>
          {customer.map((cust) => (
            <option key={cust.id} value={cust.cust_code}>
              {cust.first_name}
            </option>
          ))}
        </select>
                <button className="add-customer">+</button>
                <select
  className="salesman-select"
  onChange={handleSalesmanChange}
        >
          <option>Select Salesman</option>
          {salesmen.map((salesman) => (
            <option key={salesman.id} value={salesman.salesman_code}>
              {salesman.salesman_name}
            </option>
          ))}
        </select>
                <select className="product-dropdown" onChange={handleProductSelect}>
                console.log("All Products:", allProducts);
          <option>Select Product</option>
          {Object.entries(allProducts).map(([productName, productDetails]) => (
            <optgroup key={productName} label={productName}>
              {productDetails.map((product) => (
                <option key={product.sku} value={product.sku}>
                  {product.sku} - {product.item_name} {product.color && `- ${product.color}`}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
            </section>

            {/* Display Table if a product is selected */}
            {tableData.length > 0 ? (
  <table border="1" width="100%" cellPadding="10" style={{ marginTop: "20px" }}>
    <thead>
      <tr>
        <th>SKU</th>
        <th>Product Name</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Amount</th>
        <th>Disc. %</th>
        <th>Disc. Value</th>
        <th>Net Amount</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {tableData.map((product, index) => (
        <tr key={index}>
          <td>{product.sku}</td>
          <td>{product.product_name}</td>
          <td>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => {
                const qty = e.target.value;
                setTableData((prevData) => {
                  const updatedData = [...prevData];
                  updatedData[index].quantity = parseInt(qty) || 1;
                  return updatedData;
                });
              }}
            />
          </td>
          <td>{product.selling_price}</td>
          <td>{(product.selling_price * product.quantity).toFixed(2)}</td>
          <td>
            <input
              type="number"
              value={product.discount}
              onChange={(e) => {
                const discount = e.target.value;
                setTableData((prevData) => {
                  const updatedData = [...prevData];
                  updatedData[index].discount = parseFloat(discount) || 0;
                  return updatedData;
                });
              }}
            />
          </td>
          <td>
            {(
              (product.selling_price * product.quantity * product.discount) /
              100
            ).toFixed(2)}
          </td>
          <td>
            {(
              product.selling_price * product.quantity -
              (product.selling_price * product.quantity * product.discount) / 100
            ).toFixed(2)}
          </td>
          <td>
            <button
              onClick={() =>
                setTableData((prevData) => prevData.filter((_, i) => i !== index))
              }
            >
              ❌
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No products selected yet.</p>
)}


<section className="sales-summary">
  <table className="summary-table">
    <tbody>
      <tr>
        <td className="summary-label">PRODUCTS</td>
        <td className="summary-value">{tableData.length}</td>
        <td className="summary-label">INVOICE</td>
        <td className="summary-value">
          {(
            tableData.reduce((acc, item) => acc + item.selling_price * item.quantity, 0)
          ).toFixed(2)}
        </td>
        <td className="summary-label">GROSS</td>
        <td className="summary-value">
          {(
            tableData.reduce((acc, item) => acc + item.selling_price * item.quantity, 0)
          ).toFixed(2)}
        </td>
        <td className="summary-label">ADVANCE</td>
        <td>
          <input
            type="number"
            className="fee-input"
            placeholder="0"
            onChange={(e) => setAdvance(parseFloat(e.target.value) || 0)}
          />
        </td>
      </tr>
      <tr>
        <td className="summary-label">SALE</td>
        <td className="summary-value">
          {tableData
            .reduce(
              (acc, item) =>
                acc +
                item.selling_price * item.quantity - 
                (item.selling_price * item.quantity * item.discount) / 100,
              0
            )
            .toFixed(2)}
        </td>
        <td className="summary-label">PURCHASE</td>
        <td className="summary-value">1300</td>
        <td className="summary-label">DISCOUNT</td>
        <td className="summary-value">
          {tableData
            .reduce(
              (acc, item) =>
                acc + (item.selling_price * item.quantity * item.discount) / 100,
              0
            )
            .toFixed(2)}
        </td>
        <td className="summary-label">DUE</td>
        <td className="summary-value">0</td>
      </tr>
    </tbody>
  </table>

  {/* Fee Select Dropdowns */}
  <div className="fee-dropdowns">
    <div className="fee-dropdown">
      <label htmlFor="additional-fee">Additional Fee:</label>
      <select
        id="additional-fee"
        className="additional-fee-select"
        onChange={(e) => setAltFee(parseFloat(e.target.value) || 0)}
      >
        <option value="0">Select Additional Fee</option>
        {additionalFees.map((fee) => (
          <option key={fee.id} value={fee.amount}>
            {fee.name} - {fee.amount}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className="payment-summary">
    <div className="payment-row">
      <label className="payment-label">
        CARD:
        <input type="number" className="payment-input" placeholder="0" />
      </label>
      <label className="payment-label">
        CASH:
        <input type="number" className="payment-input" placeholder="0" />
      </label>
      <label className="payment-label">
        CHANGE:
        <input type="number" className="payment-input" placeholder="0" />
      </label>
    </div>
    <div className="payment-total">
      <span className="total-amount">
        {(
          tableData.reduce(
            (acc, item) =>
              acc +
              item.selling_price * item.quantity - 
              (item.selling_price * item.quantity * item.discount) / 100,
            0
          )
        ).toFixed(2)}
      </span>
      <CAlert color="primary" dismissible visible={visible} onClose={() => setVisible(false)}>
        {alertMessage}
      </CAlert>

      <CButton color="primary" onClick={handlePayment}>
        Payment
      </CButton>
    </div>
  </div>
</section>



        </div>
    );
}

export default Transections;
