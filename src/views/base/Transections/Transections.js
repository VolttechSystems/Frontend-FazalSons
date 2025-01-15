import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './Transections.css'
import { CAlert, CButton } from '@coreui/react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { faPrint, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons'
import AppSidebar from '/src/components/AppSidebar.js' // Your sidebar component
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import Transections from '/Transections.js';

function Transections() {
  useEffect(() => {
    document.body.style.overflow = 'hidden' // Hide scrollbars in full-screen mode
    return () => {
      document.body.style.overflow = 'auto' // Reset overflow after leaving full-screen mode
    }
  }, [])
  //fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const [products, setProducts] = useState([]) // List of products in the table
  const [salesmen, setSalesmen] = useState([])
  const [customer, setCustomer] = useState([])
  const [additionalFees, setAdditionalFees] = useState([])

  const [selectedFees, setSelectedFees] = useState([])

  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedPayments, setSelectedPayments] = useState([])

  const [deliveryFees, setDeliveryFees] = useState([])
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [allProducts, setAllProducts] = useState({})
  const [alertMessage, setAlertMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const [productDetails, setProductDetails] = useState({})
  const [selectedSKU, setSelectedSKU] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedSalesman, setSelectedSalesman] = useState('')
  const [tableData, setTableData] = useState([])
  const [advancePayment, setAdvancePayment] = useState(0)
  const [totalPaymentAfterDiscount, setTotalPaymentAfterDiscount] = useState(0)
  const [dueAmount, setDueAmount] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  //NEW
  const [isDialogOpenTwo, setIsDialogOpenTwo] = useState(false)
  const [dueinvoice, duesetInvoice] = useState('')
  const [receivingType, setReceivingType] = useState('')
  const [dueAmounts, setDueAmounts] = useState('')

  const [invoices, setInvoices] = useState([])
  const [dueinvoices, setdueInvoices] = useState([])
  //const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('')
  const [tabIndex, setTabIndex] = useState(-1) // Start with no tabIndex
  const timerRef = useRef(null) // Reference for the timer
  const inputRef = useRef(null)

  //NEW
  const [price, setPrice] = useState(0) // Price of the product
  const [returnQty, setReturnQty] = useState(0) // Quantity of product being returned
  const [returnAmount, setReturnAmount] = useState(0) // Total amount for the return
  const [isDialogOpenthree, setIsDialogOpenthree] = useState(false)
  const [closingDate, setClosingDate] = useState('')

  //NEW
  const [selectedInvoice, setSelectedInvoice] = useState('') // For selected invoice
  const [selectedDueInvoice, setSelectedDueInvoice] = useState('') // For selected due invoice
  const [newproducts, setnewProducts] = useState([]) // For fetching products of the selected invoice
  const [isOpen, setIsOpen] = useState(false)
  const [salesData, setSalesData] = useState([])
  const { outletId } = useParams() // Get the outletId from the URL parameter
  const [loading, setLoading] = useState([])
  const [sku, setSku] = useState('')

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible)

  const resetTimer = () => {
    clearTimeout(timerRef.current) // Clear previous timer
    timerRef.current = setTimeout(() => {
      setTabIndex(0) // Enable tabIndex
      if (inputRef.current) {
        inputRef.current.focus() // Automatically focus the input
      }
    }, 15000) //
  }

  useEffect(() => {
    // Reset the timer whenever the user interacts with the page
    window.addEventListener('click', resetTimer)
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keydown', resetTimer)

    // Cleanup on unmount
    return () => {
      clearTimeout(timerRef.current)
      window.removeEventListener('click', resetTimer)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keydown', resetTimer)
    }
  }, [])
  useEffect(() => {
    if (window.location.pathname === '/Transactions') {
      setIsSidebarVisible(false) // Hide sidebar on transaction page
    } else {
      setIsSidebarVisible(true) // Show sidebar on other pages
    }
  }, [window.location.pathname])

  const toggleFullScreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        // Firefox
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        document.documentElement.webkitRequestFullscreen()
      } else if (document.documentElement.msRequestFullscreen) {
        // IE/Edge
        document.documentElement.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, Opera
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // Handle Fullscreen Toggle
  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen() // Enter Fullscreen
      setIsSidebarVisible(false) // Hide Sidebar when fullscreen is active
    } else {
      document.exitFullscreen() // Exit Fullscreen
      setIsSidebarVisible(true) // Show Sidebar again
    }
    setIsFullscreen(!isFullscreen) // Toggle fullscreen state
  }

  useEffect(() => {
    // If we're on the Transaction page, hide the sidebar by default
    setIsSidebarVisible(false)

    return () => {
      setIsSidebarVisible(true) // Re-enable the sidebar when leaving this page
    }
  }, [])

  // Calculate total payment after discount
  useEffect(() => {
    const calculatedTotal = tableData.reduce((sum, item) => {
      const discountedPrice = item.selling_price - (item.selling_price * item.discount) / 100
      return sum + item.quantity * discountedPrice
    }, 0)
    setTotalPaymentAfterDiscount(calculatedTotal)
  }, [tableData])

  // Calculate due amount
  useEffect(() => {
    const totalPayment = tableData.reduce(
      (acc, item) =>
        acc +
        (item.discount_price
          ? item.discount_price * item.quantity
          : item.selling_price * item.quantity),
      0,
    )
    const calculatedDue = totalPayment - advancePayment
    setDueAmount(calculatedDue > 0 ? calculatedDue : 0) // Prevent negative values
  }, [tableData, advancePayment])

  // Calculate total discount
  const totalDiscount = tableData.reduce(
    (acc, item) =>
      acc +
      ((item.discount_price ? item.discount_price : item.selling_price) *
        item.quantity *
        item.discount) /
        100,
    0,
  )

  // Function to handle button click and open the dialog
  const handleButton = () => {
    setIsDialogOpen(true)
  }

  // Function to handle dialog close
  const handleDialogClose = (confirmed) => {
    setIsDialogOpen(false)
  }

  const handleOpenDialog = () => {
    setIsDialogOpenTwo(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpenTwo(false)
  }

  const handleOpenDialogthree = () => {
    setIsDialogOpenthree(true)
  }

  const handleCloseDialogthree = () => {
    setIsDialogOpenthree(false)
  }

  const fetchInvoices = async () => {
    setLoading(true) // Set loading to true when starting to fetch data
    try {
      console.log(`Fetching invoices for Outlet ID: ${outletId}`) // Log to confirm outletId
      const response = await fetch(
        `http://195.26.253.123/pos/transaction/get_all_invoices/${outletId}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Wasfa', data) // Log the response data for verification
      setInvoices(data) // Update the invoices state with the fetched data
    } catch (error) {
      console.error('Error fetching invoices:', error)
      setError('Error fetching invoices.') // Set the error state
    } finally {
      setLoading(false) // Set loading to false once the data is fetched or an error occurs
    }
  }

  // Fetch invoices based on the dynamic outlet ID
  useEffect(() => {
    console.log(outletId)

    fetchInvoices() // Fetch invoices when the component mounts or outletId changes
  }, [outletId]) // Dependency array includes outletId to refetch invoices on change

  useEffect(() => {
    const fetchdueInvoices = async () => {
      try {
        console.log(`Fetching due invoices for Outlet ID: ${outletId}`) // Log outletId for verification
        const response = await fetch(
          `http://195.26.253.123/pos/transaction/get_due_invoices/${outletId}`,
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Due Invoices:', data) // Log the response for debugging
        setdueInvoices(data) // Update the due invoices state
      } catch (error) {
        console.error('Error fetching due invoices:', error)
      }
    }

    if (outletId) {
      // Ensure outletId is available
      fetchdueInvoices()
    }
  }, [outletId]) // Refetch due invoices when outletId changes

  //new

  const handleSalesButtonClick = async () => {
    try {
      console.log(`Fetching sales data for Outlet ID: ${outletId}`) // Log outletId for verification
      const response = await axios.get(
        `http://195.26.253.123/pos/transaction/today_sale_report/${outletId}`,
      )
      console.log('Sales Data:', response.data) // Check the structure of the response data
      setSalesData(response.data) // Update the sales data state
      setIsOpen(true) // Open the sales modal/dialog
    } catch (error) {
      console.error('Error fetching sales data:', error)
    }
  }

  const handleClose = () => {
    setIsOpen(false) // Close the modal dialog
  }

  // Handle invoice selection
  const handleInvoiceChange = (event) => {
    const invoiceCode = event.target.value // Get the selected invoice code (e.g., INV-1)
    setSelectedInvoice(invoiceCode) // Set the selected invoice code to state
  }

  // Handle invoice selection
  const handledueInvoiceChange = (event) => {
    const DueinvoiceCode = event.target.value // Get the selected invoice code (e.g., INV-1)
    setSelectedDueInvoice(DueinvoiceCode) // Set the selected invoice code to state
  }

  // Handle Dropdown Selection
  const handleFeeSelection = (event) => {
    const selectedFeeId = event.target.value
    const selectedFee = additionalFees.find((fee) => fee.id === parseInt(selectedFeeId))

    // Avoid duplicates
    if (selectedFee && !selectedFees.some((fee) => fee.id === selectedFee.id)) {
      setSelectedFees([
        ...selectedFees,
        {
          ...selectedFee,
          fee_code: selectedFee.fee_code || '', // Fee code from dropdown
          fee_amount: '', // Default additional fee (number input)
        },
      ])
    }
  }

  //PAYMENT METHOD

  // Handle Payment Method Selection
  const handlePaymentSelection = (event) => {
    const selectedPaymentId = event.target.value
    const selectedPayment = paymentMethods.find(
      (method) => method.id === parseInt(selectedPaymentId),
    )

    // Avoid duplicates
    if (selectedPayment && !selectedPayments.some((payment) => payment.id === selectedPayment.id)) {
      setSelectedPayments([
        ...selectedPayments,
        {
          ...selectedPayment,
          payment_method_name: selectedPayment.pm_name || '', // Payment method name from dropdown
          payment_method_amount: '', // Default payment amount (number input)
        },
      ])
    }
  }

  // Handle input change for payment method amount
  const handlePaymentInputChange = (paymentId, value) => {
    setSelectedPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, payment_method_amount: value } : payment,
      ),
    )
  }

  // Remove selected payment method
  const handleRemovePayment = (paymentId) => {
    setSelectedPayments((prevPayments) =>
      prevPayments.filter((payment) => payment.id !== paymentId),
    )
  }
  //PAYMENT

  // Handle Input Change for Fee Value
  const handleInputChange = (id, value) => {
    setSelectedFees((prevFees) =>
      prevFees.map((fee) =>
        fee.id === id
          ? { ...fee, fee_amount: parseFloat(value) || '' } // Update the fee value
          : fee,
      ),
    )
  }

  // Remove Fee
  const handleRemoveFee = (id) => {
    setSelectedFees((prevFees) => prevFees.filter((fee) => fee.id !== id))
  }

  // Fetch products for the selected invoice
  const fetchNewProducts = async () => {
    if (!selectedInvoice) return // Do not fetch if no invoice is selected

    try {
      // Make the API request to get products for the selected invoice code
      const response = await fetch(
        `http://195.26.253.123/pos/transaction/get_invoice_products/${selectedInvoice}/`,
      )

      // Check if the response is successful
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText)
        throw new Error(`Failed to fetch products: ${response.statusText}`)
      }

      // Parse the JSON response
      const data = await response.json()
      console.log('Products fetched:', data) // Debug log

      // Assuming data is an array of products
      setnewProducts(data) // Update the state with the fetched products
    } catch (error) {
      console.error('Error fetching products:', error) // Error logging
    }
  }

  useEffect(() => {
    fetchNewProducts() // Fetch products when an invoice is selected
  }, [selectedInvoice]) // Dependency on selectedInvoice

  //new
  const fetchNewProductDetails = async () => {
    if (!selectedProduct || !selectedInvoice) {
      console.log('Product or Invoice not selected')
      return // Exit if no product or invoice is selected
    }

    console.log('Fetching product details for:', selectedProduct, selectedInvoice)

    try {
      const response = await fetch(
        `http://195.26.253.123/pos/transaction/get_product_detail/${selectedInvoice}/${selectedProduct}/`,
      )

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText)
        throw new Error('Failed to fetch product details')
      }

      const data = await response.json()
      console.log('Fetched Product Details:', data)

      if (data.length > 0) {
        const product = data[0] // Assuming the API returns an array with one object

        // Map API fields to your state variables
        setPrice(product.rate || 0) // Backend field 'rate' sets Price
        setReturnQty(product.quantity || 0) // Backend field 'quantity' sets Return Qty
        setReturnAmount(product.rate || 0) // Backend field 'rate' sets Return Amount
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
    }
  }

  const handleSalesReturn = async () => {
    if (!selectedProduct || !selectedInvoice) {
      // Check for selected product and invoice code
      console.error('Invalid return: Product not selected or invoice code is missing.')
      return
    }

    // Prepare the data as lists for the API
    const requestData = {
      sku: [selectedProduct], // SKU as a list
      rate: [price], // Price (Rate) as a list
      quantity: [returnQty], // Quantity as a list
      invoice_code: selectedInvoice, // Add invoice code instead of quantity
    }

    console.log('Submitting return data:', requestData)

    try {
      const response = await fetch('http://195.26.253.123/pos/transaction/transactions_return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Send the data as JSON
      })

      if (!response.ok) {
        console.error('Error in return API:', response.status, response.statusText)
        throw new Error('Failed to process return')
      }

      const responseData = await response.json()
      console.log('Return processed successfully:', responseData)

      // Optional: Show a success message or reset fields
      alert('Return processed successfully!')
      setIsDialogOpen(false) // Close the dialog
    } catch (error) {
      console.error('Error processing return:', error)
      alert('An error occurred while processing the return. Please try again.')
    }
  }

  // Fetch data when selectedProduct or selectedInvoice changes
  useEffect(() => {
    if (selectedProduct) {
      fetchNewProductDetails()
    }
  }, [selectedProduct])

  const handleScan = async (event) => {
    if (event.key === 'Enter') {
      const product = await fetchProductDetailbyScanner(sku)
      console.log(product)

      if (product) {
        setProducts((prev) => {
          const existingProductIndex = prev.findIndex((p) => p.sku === product.sku)
          console.log('3')

          if (existingProductIndex !== -1) {
            console.log('Product already exists, updating quantity')
            // If product already exists, update its quantity
            const updatedProducts = [...prev]
            updatedProducts[existingProductIndex].quantity += 1
            return updatedProducts
          } else {
            console.log("Product doesn't exist, adding to the list")
            // If product doesn't exist, add it with a quantity of 1
            return [...prev, { ...product, quantity: 1 }]
          }
        })
      }

      //    else {
      //     alert("Product not found.");
      // }
      setSku('') // Reset input field

      // console.log("Product:", product);
      //     if (product) {
      //         setProducts((prev) => [...prev, product]);
      //     }
      //     // else {
      //     //     alert("Product not found.");
      //     // }
      //     setSku(""); // Reset input field
    }
  }

  // For the Product Dropdown
  const handleProductChange = (event) => {
    const selectedValue = event.target.value
    console.log('Selected Product:', selectedValue) // Log selected value
    setSelectedProduct(selectedValue) // Update the selected product
  }

  useEffect(() => {
    const fetchSalesmen = async () => {
      if (!outletId) return // If no outletId, skip fetching

      try {
        const response = await fetch(
          `http://195.26.253.123/pos/transaction/outlet-wise-salesman/${outletId}/`,
        )
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setSalesmen(data)
        }
      } catch (error) {
        console.error('Error fetching salesmen:', error)
      }
    }

    const fetchAdditionalFees = async () => {
      try {
        const response = await fetch('http://195.26.253.123/pos/transaction/add_additional_fee')
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setAdditionalFees(data)
        }
      } catch (error) {
        console.error('Error fetching additional fees:', error)
      }
    }

    const fetchPayment = async () => {
      try {
        const response = await fetch('http://195.26.253.123/pos/transaction/add_payment')
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setPaymentMethods(data)
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error)
      }
    }

    const fetchDeliveryFees = async () => {
      try {
        const response = await fetch(
          'http://195.26.253.123/pos/transaction/action_additional_fee/id/',
        )
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setDeliveryFees(data)
        }
      } catch (error) {
        console.error('Error fetching delivery fees:', error)
      }
    }

    const fetchAllProducts = async (outletId) => {
      try {
        const response = await fetch(
          `http://195.26.253.123/pos/transaction/all_product/${outletId}/`,
        )
        const data = await response.json()
        if (Array.isArray(data)) {
          const groupedData = groupByProductName(data)
          setAllProducts(groupedData)
        }
      } catch (error) {
        console.error('Error fetching all products:', error)
      }
    }

    const fetchCustomer = async () => {
      try {
        const response = await fetch('http://195.26.253.123/pos/customer/add_customer')
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setCustomer(data)
        }
      } catch (error) {
        console.error('Error fetching customer:', error)
      }
    }

    fetchSalesmen()
    fetchAdditionalFees()
    fetchDeliveryFees()
    fetchAllProducts(outletId) // Pass outletId to fetchAllProducts
    fetchCustomer()
    fetchPayment()
    const interval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [outletId])

  // Fetch product details by SKU and add to the table
  const fetchProductDetails = async (sku) => {
    console.log('Fetching product details for SKU:', sku) // Debug log
    try {
      const response = await fetch(`http://195.26.253.123/pos/transaction/products_detail/${sku}/`)
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText)
        return
      }

      const product = await response.json()
      console.log('Product Details Fetched:', product) // Debug log

      setTableData((prevTableData) => [
        ...prevTableData,
        {
          // sku: product.sku || 'N/A',
          // product_name: product.product_name || 'Unknown Product',
          // quantity: 1,
          // discount: 0,
          // selling_price: product.discount_price || product.selling_price || 0, // Use discount_price if available
          // // discount_price: product.discount_price || null, // Ensure discount_price is included
          // discount_value: 0,
          // total_after_discount: product.discount_price || product.selling_price || 0, // Set initial total

          sku: product.sku || 'N/A',
          product_name: product.product_name || 'Unknown Product',
          quantity: 1,
          discount: 0,
          selling_price: product.selling_price || 0, // Keep the original selling_price
          discount_price: product.discount_price || null, // Include the discount_price separately
          discount_value: 0,
          total_after_discount: product.discount_price || product.selling_price || 0, // Set initial total
        },
      ])
    } catch (error) {
      console.error('Error fetching product details:', error)
    }
  }

  useEffect(() => {
    console.log('Updated Table Data:', tableData)
  }, [tableData])

  //fetch product by scanner

  const fetchProductDetailbyScanner = async (sku) => {
    console.log('Fetching product details for SKU:', sku) // Debug log
    try {
      const response = await fetch(`http://195.26.253.123/pos/transaction/products_detail/${sku}/`)
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText)
        return
      }
      const product = await response.json()
      console.log('Product Details Fetched:', product) // Debug log

      setTableData((prevTableData) => {
        // Check if the SKU already exists in the table data
        const existingProductIndex = prevTableData.findIndex((item) => item.sku === sku)

        if (existingProductIndex !== -1) {
          // Update the quantity of the existing product
          const updatedTableData = [...prevTableData]
          updatedTableData[existingProductIndex].quantity += 1
          return updatedTableData
        } else {
          // Add a new product to the table data
          return [
            ...prevTableData,
            {
              sku: product.sku || 'N/A',
              product_name: product.product_name || 'Unknown Product',
              quantity: 1,
              discount: 0,
              selling_price: product.selling_price || 0,
            },
          ]
        }
      })
    } catch (error) {
      console.error('Error fetching product details:', error)
    }
  }

  const groupByProductName = (products) => {
    return products.reduce((acc, product) => {
      const { sku, product_name, item_name, color } = product
      const groupName = product_name || 'Uncategorized' // Fallback for null names
      if (!acc[groupName]) {
        acc[groupName] = []
      }
      acc[groupName].push({
        sku,
        item_name: item_name || 'Unnamed Item',
        color: color || '',
      })
      return acc
    }, {})
  }

  const handlePayment = async () => {
    // Create arrays for fee codes and amounts
    const feeCodes = selectedFees.map((fee) => fee.fee_code) // Create an array for fee codes
    const fees = selectedFees.map((fee) => fee.fee_amount) // Create an array for fee amounts

    // Create arrays for payment methods and their amounts
    const paymentMethods = selectedPayments.map((payment) => payment.id) // Payment method IDs
    const paymentAmounts = selectedPayments.map((payment) => payment.payment_method_amount) // Payment method amounts

    const payload = {
      sku: tableData.map((item) => item.sku), // SKU of the items
      quantity: tableData.map((item) => item.quantity), // Quantity of each item
      rate: tableData.map((item) =>
        item.discount_price ? item.discount_price : item.selling_price,
      ), // Use discount price if available, else selling price
      item_discount: tableData.map((item) => item.discount), // Item discount
      cust_code: selectedCustomer, // Customer code
      overall_discount: '0', // Overall discount (can be updated as needed)
      outlet_code: outletId, // Outlet code
      saleman_code: selectedSalesman, // Salesman code
      advanced_payment: advancePayment, // Advanced payment amount
      fee_code: feeCodes, // Fee codes array (can be empty if no fees are selected)
      fee_amount: fees, // Fee amounts array (can be empty if no fees are selected)
      pm_method: paymentMethods, // Payment method IDs array
      pm_amount: paymentAmounts, // Payment amounts array
    }

    try {
      // Sending POST request with the payload
      const response = await fetch('http://195.26.253.123/pos/transaction/add_transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Transaction added successfully!')
      } else {
        const errorData = await response.json()
        console.error('API Error Response:', errorData)

        // Display backend errors
        if (errorData) {
          Object.keys(errorData).forEach((key) => {
            const errorMessages = errorData[key]
            if (Array.isArray(errorMessages)) {
              errorMessages.forEach((message) => {
                toast.error(`${key}: ${message}`)
              })
            } else {
              toast.error(`${key}: ${errorMessages}`)
            }
          })
        } else {
          toast.error('Failed to add transaction! Please check your input.')
        }
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      toast.error('An error occurred while processing the payment.')
    }
  }

  // Handle SKU selection
  const handleProductSelect = (e) => {
    const sku = e.target.value
    console.log('Selected SKU:', sku) // Debug log
    if (sku && sku !== 'Select Product') {
      fetchProductDetails(sku)
    }
  }

  const calculateTotal = () => {
    let totalAmount = products.reduce((sum, p) => sum + p.qty * p.price, 0)
    let totalDiscount = products.reduce((sum, p) => sum + p.qty * p.price * (p.discount / 100), 0)
    let netTotal = totalAmount - totalDiscount
    return { totalAmount, totalDiscount, netTotal }
  }

  const { totalAmount, netTotal } = calculateTotal()

  const formatDateTime = (date) => {
    return (
      date.toLocaleTimeString() +
      ' | ' +
      date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
  }

  // const toggleFullScreen = () => {
  //     if (!document.fullscreenElement) {
  //         document.documentElement.requestFullscreen();
  //     } else if (document.exitFullscreen) {
  //         document.exitFullscreen();
  //     }
  // };

  // Function to handle button click and show alert
  const handleButtonClick = (message) => {
    setAlertMessage(message)
    setVisible(true)
  }

  const handleCustomerChange = (e) => {
    const value = e.target.value
    setSelectedCustomer(value)
    console.log('Selected Customer:', value) // Debugging log
  }

  const handleSalesmanChange = (e) => {
    const value = e.target.value
    setSelectedSalesman(value)
    console.log('Selected Salesman:', value) // Debugging log
  }

  // Handle return submission
  const handleReturn = async () => {
    const payload = {
      invoice: selectedInvoice,
      sku: selectedProduct,
      return_qty: returnQty,
      return_amount: returnAmount,
    }

    try {
      const response = await fetch('http://195.26.253.123/pos/transaction/add_transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON payload
        },
        body: JSON.stringify(payload), // Convert payload to JSON string
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Return processed successfully:', data)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error processing return:', error)
    }
  }

  return (
    <div
      id="transaction-container"
      className={`container ${isFullscreen ? 'fullscreen-mode' : 'simple-mode'}`}
    >
      <div className={`transactions-page ${isSidebarVisible ? 'with-sidebar' : 'no-sidebar'}`}>
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

        <header className="t-header">
          {/* <h1 className="t-logo">FAZAL SONS</h1> */}
          <div className="t-header-info">
            <Box>
              {/* Button to Fetch Sales Data */}
              <Button variant="contained" onClick={handleSalesButtonClick}>
                Today Sales
              </Button>

              {/* Sales Data Dialog */}
              <Dialog open={isOpen} onClose={handleClose} fullWidth>
                <DialogTitle>Today's Sales Report</DialogTitle>
                <DialogContent>
                  {salesData.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Sr#.
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Invoice#.
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Customer
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Total
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Salesman
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" fontWeight="bold">
                              Action
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {salesData.map((sale, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{sale.invoice_code}</TableCell>
                            <TableCell>{sale.customer}</TableCell>
                            <TableCell>{sale.total}</TableCell>
                            <TableCell>{sale.salesman}</TableCell>
                            <TableCell>
                              <Button onClick={() => handlePrint(sale.invoice_code)}>
                                <FontAwesomeIcon icon={faPrint} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography>No sales data available.</Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>

            <Button variant="contained" onClick={handleButton}>
              Sales Return
            </Button>
            {/* Styled Sales Return Dialog */}
            <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
              <DialogTitle>Sale Return</DialogTitle>
              <DialogContent sx={{ padding: '10px 20px' }}>
                {/* Invoice Dropdown */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ marginBottom: '10px' }}>
                  Select Invoice:
                </Typography>

                <select
                  value={selectedInvoice} // Bind the selected invoice code
                  onChange={handleInvoiceChange} // Update selected invoice
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                  }}
                >
                  <option value="">Select Invoice</option>
                  {invoices.map((invoice) => (
                    <option key={invoice.invoice_code} value={invoice.invoice_code}>
                      {invoice.invoice} {/* Display invoice name (e.g., Invoice #: 1) */}
                    </option>
                  ))}
                </select>

                {/* Product Dropdown */}
                <div>
                  <label htmlFor="product">Select Product:</label>
                  <select
                    onChange={handleProductChange}
                    value={selectedProduct}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontSize: '16px',
                      cursor: 'pointer',
                      marginBottom: '20px',
                    }}
                  >
                    <option value="">Select Product</option>
                    {newproducts.length > 0 ? (
                      newproducts.map((product) => (
                        <option key={product.id} value={product.sku}>
                          {product.sku} - {product.product_name} - {product.items}
                        </option>
                      ))
                    ) : (
                      <option value="">No Products Available</option>
                    )}
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  {/* Price Field */}
                  <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={price} // Auto-updated by API
                      readOnly
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    />
                  </div>

                  {/* Return Quantity Field */}
                  <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="returnQty" style={{ display: 'block', marginBottom: '5px' }}>
                      Return Qty
                    </label>
                    <input
                      type="number"
                      id="returnQty"
                      value={returnQty} // Auto-updated by API
                      readOnly
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    />
                  </div>

                  {/* Return Amount Field */}
                  <div>
                    <label htmlFor="returnAmount" style={{ display: 'block', marginBottom: '5px' }}>
                      Return Amount
                    </label>
                    <input
                      type="number"
                      id="returnAmount"
                      value={returnAmount} // Auto-updated by API
                      readOnly
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    />
                  </div>
                </div>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setIsDialogOpen(false)} color="secondary" variant="outlined">
                  Close
                </Button>
                <Button
                  onClick={handleSalesReturn} // Trigger the API call
                  color="primary"
                  variant="contained"
                  disabled={!selectedProduct || returnQty <= 0} // Disable if invalid
                >
                  Return
                </Button>
              </DialogActions>
            </Dialog>
            {/* <button className="t-header-button" onClick={() => handleButtonClick("Due Receivable clicked!")}>Due Receivable</button> */}
            <Button variant="contained" onClick={handleOpenDialog}>
              Due Receivable
            </Button>

            {/* Dialog */}
            <Dialog
              open={isDialogOpenTwo}
              onClose={handleCloseDialog}
              sx={{ '& .MuiDialog-paper': { width: '600px' } }} // Adjust dialog width
            >
              <DialogTitle>Due Receivable</DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Invoice Dropdown */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ marginBottom: '10px' }}>
                      Select Invoice:
                    </Typography>
                    <select
                      value={selectedDueInvoice} // Bind the selected invoice code
                      onChange={async (e) => {
                        const invoiceCode = e.target.value
                        setSelectedDueInvoice(invoiceCode) // Update selected invoice state

                        if (invoiceCode) {
                          try {
                            // Fetch the due amount for the selected invoice
                            const response = await fetch(
                              `http://195.26.253.123/pos/transaction/get_amount_of_due_invoices/${invoiceCode}`,
                            )
                            if (response.ok) {
                              const data = await response.json()
                              setDueAmounts(data.due_amount) // Update dueAmounts state
                            } else {
                              console.error('Failed to fetch due amount.')
                            }
                          } catch (error) {
                            console.error('Error fetching due amount:', error)
                          }
                        } else {
                          setDueAmounts('') // Reset the due amount field if no invoice is selected
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                      }}
                    >
                      <option value="">Select Invoice</option>
                      {dueinvoices.map((invoice) => (
                        <option key={invoice.invoice_code} value={invoice.invoice_code}>
                          {invoice.invoice} {/* Display invoice name (e.g., Invoice #: 1) */}
                        </option>
                      ))}
                    </select>
                  </Box>

                  {/* Receiving Type Dropdown */}
                  <Box>
                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                      Receiving Type *
                    </Typography>
                    <Select
                      fullWidth
                      value={receivingType}
                      onChange={(e) => setReceivingType(e.target.value)}
                    >
                      <MenuItem value="Debit Card">Debit Card</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                    </Select>
                  </Box>

                  {/* Due Amount Input */}
                  <Box>
                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                      Due Amount *
                    </Typography>
                    <input
                      value={dueAmounts}
                      onChange={(e) => setDueAmounts(e.target.value)}
                      type="number"
                      readOnly // Make the field read-only
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '16px',
                      }}
                    />
                  </Box>
                </Box>
              </DialogContent>

              {/* Dialog Actions */}
              <DialogActions>
                {/* Close Button */}
                <Button onClick={handleCloseDialog} variant="outlined" color="secondary">
                  Close
                </Button>

                {/* Receive Button */}
                <Button
                  onClick={async () => {
                    if (selectedDueInvoice && dueAmounts && receivingType) {
                      try {
                        // Convert dueAmounts to a number
                        const dueAmountNumeric = parseFloat(dueAmounts)

                        // Send PUT request to the API
                        const response = await fetch(
                          `http://195.26.253.123/pos/transaction/receive_due_invoice/${selectedDueInvoice}`,
                          {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              due_amount: dueAmountNumeric, // Ensure numeric type
                              receiving_type: receivingType,
                            }),
                          },
                        )

                        if (response.ok) {
                          const result = await response.json()
                          alert('Due amount received successfully!')
                          handleCloseDialog()
                        } else {
                          const error = await response.json()
                          alert(
                            `Failed to receive the due amount: ${error.detail || 'Please try again.'}`,
                          )
                        }
                      } catch (error) {
                        console.error('Error while receiving due amount:', error)
                        alert('An error occurred. Please try again later.')
                      }
                    } else {
                      alert('Please select an invoice and complete all required fields.')
                    }
                  }}
                  color="secondary"
                  variant="outlined"
                >
                  Receive
                </Button>
              </DialogActions>
            </Dialog>

            <div>
              {/* Trigger Button */}
              <Button variant="contained" onClick={handleOpenDialogthree}>
                Close Till
              </Button>

              {/* Dialog */}
              <Dialog
                open={isDialogOpenthree}
                onClose={handleCloseDialogthree}
                sx={{ '& .MuiDialog-paper': { width: '500px' } }}
              >
                <DialogTitle>Close Till</DialogTitle>
                <DialogContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Till Closing Date Input */}
                    <Box>
                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Till Closing Date *
                      </Typography>
                      <TextField
                        fullWidth
                        value={closingDate}
                        onChange={(e) => setClosingDate(e.target.value)}
                        placeholder="Year/Month/Day | 0000/00/00"
                      />
                      <Typography variant="caption" sx={{ color: 'gray', marginTop: '4px' }}>
                        Date Format: Year/Month/Day | 0000/00/00
                      </Typography>
                    </Box>
                  </Box>
                </DialogContent>

                <DialogActions>
                  {/* Close Button */}
                  <Button onClick={handleCloseDialogthree} variant="outlined" color="secondary">
                    Close
                  </Button>
                  {/* Save Button */}
                  <Button
                    onClick={() => {
                      console.log('Closing Date:', closingDate)
                      handleCloseDialogthree()
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </div>

            <span className="t-date-time">{formatDateTime(currentDateTime)}</span>
          </div>
          {/* Fullscreen Toggle Button */}
          <div className="t-header-left">
            {/* Fullscreen Toggle Button */}

            {isSidebarVisible && <AppSidebar />}
            {/* <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <button onClick={toggleFullScreen}>Toggle Full-Screen</button> */}
            <Button
              variant="contained"
              onClick={handleFullscreenToggle}
              sx={{ marginRight: '10px' }}
            >
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
            </Button>
            {/* <Transactions/> */}
          </div>
        </header>

        <CAlert color="primary" dismissible visible={visible} onClose={() => setVisible(false)}>
          {alertMessage}
        </CAlert>

        <section className="customer-section">
          <select className="customer-select" onChange={handleCustomerChange}>
            <option>Select Customer</option>
            {customer.map((cust) => (
              <option key={cust.cust_code} value={cust.cust_code}>
                {cust.first_name}
              </option>
            ))}
          </select>
          <Link to="/Customer/AddCustomer">
            <button className="add-customer">+</button>
          </Link>

          <select className="salesman-select" onChange={handleSalesmanChange}>
            <option>Select Salesman</option>
            {salesmen.map((salesman) => (
              <option key={salesman.id} value={salesman.salesman_code}>
                {salesman.salesman_name}
              </option>
            ))}
          </select>
          <Link to="/Admin/Salesman">
            <button className="add-customer">+</button>
          </Link>

          <input
            ref={inputRef}
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            onKeyDown={handleScan} // Capture "Enter" key
            placeholder="Scan Here..."
            tabIndex={tabIndex} // Dynamically set tabIndex
            autoFocus // Keep input in focus
          />
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
          <table border="1" width="100%" cellPadding="10" style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Selling Price</th>
                <th>Total</th>
                <th>Discount %</th>
                <th>Discount Value</th>
                <th>Total After Discount</th>
                <th>Actions</th>
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
                        const qty = e.target.value
                        setTableData((prevData) => {
                          const updatedData = [...prevData]
                          updatedData[index].quantity = parseInt(qty) || 1
                          return updatedData
                        })
                      }}
                      className="no-spinner"
                    />
                  </td>
                  <td>
                    {product.discount_price ? (
                      <>
                        <span
                          style={{
                            textDecoration: 'line-through',
                            color: 'red',
                            marginRight: '10px',
                          }}
                        >
                          {product.selling_price}
                        </span>
                        <span>{product.discount_price}</span>
                      </>
                    ) : (
                      <span>{product.selling_price}</span>
                    )}
                  </td>
                  <td>
                    {(product.discount_price ? product.discount_price : product.selling_price) *
                      product.quantity}
                  </td>

                  {/* Multiply and return as integer */}
                  <td>
                    <input
                      type="number"
                      value={product.discount}
                      onChange={(e) => {
                        const discount = parseInt(e.target.value) || 0 // Ensure discount is an integer
                        setTableData((prevData) => {
                          const updatedData = [...prevData]
                          updatedData[index].discount = discount
                          return updatedData
                        })
                      }}
                      className="no-spinner"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={(product.selling_price * product.quantity * product.discount) / 100} // Result will be an integer now
                      onChange={(e) => {
                        const discountValue = parseInt(e.target.value) || 0
                        setTableData((prevData) => {
                          const updatedData = [...prevData]
                          updatedData[index].discount =
                            (discountValue / (product.selling_price * product.quantity)) * 100 || 0
                          updatedData[index].discountValue = discountValue
                          return updatedData
                        })
                      }}
                      className="no-spinner"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={
                        product.discount_price
                          ? product.discount_price * product.quantity -
                            (product.discount_price * product.quantity * product.discount) / 100
                          : product.selling_price * product.quantity -
                            (product.selling_price * product.quantity * product.discount) / 100
                      } // Calculate based on discount_price or selling_price
                      onChange={(e) => {
                        const netAmount = parseInt(e.target.value) || 0 // Ensure netAmount is an integer
                        setTableData((prevData) => {
                          const updatedData = [...prevData]
                          updatedData[index].netAmount = netAmount
                          return updatedData
                        })
                      }}
                      className="no-spinner"
                    />
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
                  {tableData
                    .reduce(
                      (acc, item) =>
                        acc +
                        (item.discount_price
                          ? item.discount_price * item.quantity
                          : item.selling_price * item.quantity),
                      0,
                    )
                    .toFixed(2)}
                </td>
                <td className="summary-label">GROSS</td>
                <td className="summary-value">
                  {tableData
                    .reduce(
                      (acc, item) =>
                        acc +
                        (item.discount_price
                          ? item.discount_price * item.quantity
                          : item.selling_price * item.quantity),
                      0,
                    )
                    .toFixed(2)}
                </td>

                <td className="summary-label">ADVANCE</td>
                <td>
                  <input
                    type="number"
                    className="fee-input"
                    placeholder="0"
                    value={advancePayment}
                    onChange={(e) => setAdvancePayment(parseFloat(e.target.value) || 0)}
                  />
                </td>
              </tr>
              <tr>
                <td className="summary-label">SALE</td>
                <td className="summary-value">{totalPaymentAfterDiscount.toFixed(2)}</td>
                <td className="summary-label">PURCHASE</td>
                <td className="summary-value">
                  {tableData
                    .reduce(
                      (acc, item) =>
                        acc +
                        (item.discount_price
                          ? item.discount_price * item.quantity
                          : item.selling_price * item.quantity),
                      0,
                    )
                    .toFixed(2)}
                </td>

                <td className="summary-label">DISCOUNT</td>
                <td className="summary-value">{totalDiscount.toFixed(2)}</td>
                <td className="summary-label">DUE</td>
                <td className="summary-value">{dueAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="fee-section">
            {/* Fee Select Dropdown */}
            <div className="fee-dropdown">
              <label htmlFor="additional-fee">Additional Fee:</label>
              <select id="additional-fee" onChange={handleFeeSelection}>
                <option value="">Select Additional Fee</option>
                {additionalFees.map((fee) => (
                  <option key={fee.id} value={fee.id}>
                    {fee.fee_name}
                  </option>
                ))}
              </select>
              <Link to="/Admin/AdditionalFee">
                <button className="add-fee-btn">+</button>
              </Link>
            </div>

            {/* Dynamically Render Input Fields */}
            <div className="selected-fees">
              {selectedFees.map((fee) => (
                <div key={fee.id} className="fee-item">
                  <label>{fee.fee_name}:</label>
                  <input
                    type="number"
                    value={fee.fee_amount}
                    onChange={(e) => handleInputChange(fee.id, e.target.value)}
                  />
                  <button className="remove-btn" onClick={() => handleRemoveFee(fee.id)}>
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* /* PAYMENT METHOD DROPDOWN */}
          <div className="payment-summary">
            {/* Payment Method Dropdown */}
            <div className="payment-method-dropdown">
              <label htmlFor="payment-method">Payment Method:</label>
              <select id="payment-method" onChange={handlePaymentSelection}>
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.pm_name}
                  </option>
                ))}
              </select>
              <Link to="/Admin/Payment">
                <button className="add-payment-method-btn">+</button>
              </Link>
            </div>

            {/* Dynamically Render Input Fields for Selected Payment Methods */}
            <div className="selected-payment-methods">
              {selectedPayments.map((payment) => (
                <div key={payment.id} className="payment-item">
                  <label>{payment.pm_name}:</label>
                  <input
                    type="number"
                    value={payment.payment_method_amount}
                    onChange={(e) => handlePaymentInputChange(payment.id, e.target.value)}
                  />
                  <button className="remove-btn" onClick={() => handleRemovePayment(payment.id)}>
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="payment-total">
              <span className="total-amount">
                {(
                  tableData.reduce(
                    (acc, item) =>
                      acc +
                      ((item.discount_price
                        ? item.discount_price * item.quantity
                        : item.selling_price * item.quantity) -
                        ((item.discount_price
                          ? item.discount_price * item.quantity
                          : item.selling_price * item.quantity) *
                          item.discount) /
                          100),
                    0,
                  ) + selectedFees.reduce((acc, fee) => acc + (fee.fee_amount || 0), 0)
                ) // Add additional fees
                  .toFixed(2)}
              </span>

              <CButton color="primary" onClick={handlePayment}>
                Payment
              </CButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Transections
