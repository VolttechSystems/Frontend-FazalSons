// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import './CommissionReport.css'
// import { Network, Urls } from '../../../api-config'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import useAuth from '../../../hooks/useAuth'
// import { Autocomplete, TextField } from '@mui/material'

// const CommissionReport = () => {
//   const [outlets, setOutlets] = useState([])
//   const [salesmen, setSalesmen] = useState([])
//   const [selectedOutlet, setSelectedOutlet] = useState(null)
//   const [selectedSalesman, setSelectedSalesman] = useState('')
//   const [startDate, setStartDate] = useState('')
//   const [endDate, setEndDate] = useState('')
//   const [commissionData, setCommissionData] = useState([])
//   const { userOutlets } = useAuth()

//   // Fetch outlets on component mount
//   useEffect(() => {
//     fetchOutlets()
//   }, [])

//   const fetchOutlets = async () => {
//     const response = await Network.get(Urls.fetchAllOutlets)

//     if (!response.ok) {
//       return console.error('Failed to fetch outlets:', response.data.error)
//     }

//     const outlets = response.data
//       .map((outlet) => {
//         if (userOutlets.some((o) => o.id === outlet.id)) {
//           return outlet
//         }
//         return null
//       })
//       .filter((outlet) => outlet !== null)

//     setOutlets(outlets)
//   }

//   const handleOutletChange = async (event) => {
//     const outletId = event.target.value
//     setSelectedOutlet(outletId)

//     try {
//       const response = await Network.get(`${Urls.outletWiseSalesman}${outletId}/`)

//       // Check if the response contains data
//       if (!response || !response.data) {
//         console.error('Error: Invalid response structure', response)
//         return
//       }

//       setSalesmen(response.data)
//     } catch (error) {
//       console.error('Error fetching salesmen:', error)
//     }
//   }

//   const handleStartDateChange = (event) => {
//     setStartDate(event.target.value)
//   }

//   const handleEndDateChange = (event) => {
//     setEndDate(event.target.value)
//   }

//   const handleGenerateReport = async () => {
//     if (selectedOutlet && selectedSalesman && startDate && endDate) {
//       // Convert the start and end dates to YYYY-MM-DD format
//       const formattedStartDate = startDate
//       const formattedEndDate = endDate

//       // Validate the date format
//       const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/
//       if (!dateRegex.test(formattedStartDate) || !dateRegex.test(formattedEndDate)) {
//         toast.error('Invalid date format. Use YYYY-MM-DD.')
//         return
//       }

//       // Construct the API endpoint
//       const endpoint = `${Urls.commissionReport}${selectedOutlet}/${selectedSalesman}/${formattedStartDate}/${formattedEndDate}/`

//       try {
//         // Fetch commission report
//         const response = await Network.get(endpoint)

//         // Check for valid response data
//         if (response && response.data) {
//           if (response.data.length === 0) {
//             toast.warning('No data available for the selected criteria.')
//           } else {
//             setCommissionData(response.data)
//             toast.success('Report generated successfully.')
//           }
//         } else {
//           toast.error('Error: Invalid response structure.')
//           console.error('Error: Invalid response structure', response)
//         }
//       } catch (error) {
//         console.error('Error fetching commission report:', error)

//         // Handle backend errors with toast
//         if (error.response && error.response.data) {
//           const errorData = error.response.data
//           Object.keys(errorData).forEach((key) => {
//             const errorMessages = errorData[key]
//             if (Array.isArray(errorMessages)) {
//               errorMessages.forEach((message) => {
//                 toast.error(`${key}: ${message}`)
//               })
//             } else {
//               toast.error(`${key}: ${errorMessages}`)
//             }
//           })
//         } else {
//           toast.error('An unexpected error occurred while generating the report.')
//         }
//       }
//     } else {
//       toast.error('Please select all fields.')
//     }
//   }

//   return (
//     <div className="report-container">
//       <h1 className="heading">Commission Report</h1>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />

//       <div className="dropdowns">
//         <div className="dropdown-wrapper">
//           <label>Choose Outlet</label>
//           <select className="dropdown" value={selectedOutlet || ''} onChange={handleOutletChange}>
//             <option value="">Select Outlet</option>
//             {outlets.map((outlet) => (
//               <option key={outlet.id} value={outlet.id}>
//                 {outlet.outlet_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="dropdown-wrapper">
//           <label>Choose Salesman</label>
//           <select
//             className="dropdown"
//             value={selectedSalesman || ''}
//             onChange={(e) => setSelectedSalesman(e.target.value)}
//             disabled={!selectedOutlet}
//           >
//             <option value="">Select Salesman</option>
//             {salesmen.map((salesman) => (
//               <option key={salesman.salesman_code} value={salesman.salesman_code}>
//                 {salesman.salesman_name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="date-range">
//         <div className="date-wrapper">
//           <label>Start Date</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={handleStartDateChange}
//             className="date-input"
//           />
//         </div>

//         <div className="date-wrapper">
//           <label>End Date</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={handleEndDateChange}
//             className="date-input"
//           />
//         </div>
//       </div>

//       <button className="generate-report-btn" onClick={handleGenerateReport}>
//         Generate Report
//       </button>

//       {commissionData.length > 0 && (
//         <div className="report-table-container">
//           <table className="report-table">
//             <thead>
//               <tr>
//                 <th>Till Date</th>
//                 <th>Invoice</th>
//                 <th>SKU</th>
//                 <th>Product</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Gross Total</th>
//                 <th>Discount</th>
//                 <th>Total</th>
//                 <th>Percentage (%)</th>
//                 <th>Commission</th>
//               </tr>
//             </thead>
//             <tbody>
//               {commissionData.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.till_date}</td>
//                   <td>{item.invoice}</td>
//                   <td>{item.sku}</td>
//                   <td>{item.product}</td>
//                   <td>{item.quantity}</td>
//                   <td>{item.Price}</td>
//                   <td>{item.gross_total}</td>
//                   <td>{item.discount}</td>
//                   <td>{item.total}</td>
//                   <td>{item['Per(%)']}</td>
//                   <td>{item.Commission}</td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>
//                   Totals:
//                 </td>
//                 <td>
//                   <strong>
//                     {commissionData.reduce((acc, item) => acc + parseFloat(item.quantity || 0), 0)}
//                   </strong>
//                 </td>
//                 <td>
//                   <strong>
//                     {commissionData
//                       .reduce((acc, item) => acc + parseFloat(item.Price || 0), 0)
//                       .toFixed(2)}
//                   </strong>
//                 </td>
//                 <td>
//                   <strong>
//                     {commissionData
//                       .reduce((acc, item) => acc + parseFloat(item.gross_total || 0), 0)
//                       .toFixed(2)}
//                   </strong>
//                 </td>
//                 <td>
//                   <strong>
//                     {commissionData
//                       .reduce((acc, item) => acc + parseFloat(item.discount || 0), 0)
//                       .toFixed(2)}
//                   </strong>
//                 </td>
//                 <td>
//                   <strong>
//                     {commissionData
//                       .reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
//                       .toFixed(2)}
//                   </strong>
//                 </td>
//                 <td></td>
//                 <td>
//                   <strong>
//                     {commissionData
//                       .reduce((acc, item) => acc + parseFloat(item.Commission || 0), 0)
//                       .toFixed(2)}
//                   </strong>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }

// export default CommissionReport

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './CommissionReport.css'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useAuth from '../../../hooks/useAuth'
import { Autocomplete, TextField } from '@mui/material'

const CommissionReport = () => {
  const [outlets, setOutlets] = useState([])
  const [salesmen, setSalesmen] = useState([])
  const [selectedOutlet, setSelectedOutlet] = useState(null)
  const [selectedSalesman, setSelectedSalesman] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [commissionData, setCommissionData] = useState([])
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

  const handleOutletChange = async (event, newValue) => {
    const outletId = newValue ? newValue.id : null
    setSelectedOutlet(outletId)

    try {
      const response = await Network.get(`${Urls.outletWiseSalesman}${outletId}/`)

      if (response && response.data) {
        setSalesmen(response.data)
      } else {
        console.error('Error: Invalid response structure', response)
      }
    } catch (error) {
      console.error('Error fetching salesmen:', error)
    }
  }

  const handleSalesmanChange = (event, newValue) => {
    setSelectedSalesman(newValue ? newValue.salesman_code : '')
  }

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value)
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value)
  }

  const handleGenerateReport = async () => {
    if (selectedOutlet && selectedSalesman && startDate && endDate) {
      const formattedStartDate = startDate
      const formattedEndDate = endDate

      const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/
      if (!dateRegex.test(formattedStartDate) || !dateRegex.test(formattedEndDate)) {
        toast.error('Invalid date format. Use YYYY-MM-DD.')
        return
      }

      const endpoint = `${Urls.commissionReport}${selectedOutlet}/${selectedSalesman}/${formattedStartDate}/${formattedEndDate}/`

      try {
        const response = await Network.get(endpoint)

        if (response && response.data) {
          if (response.data.length === 0) {
            toast.warning('No data available for the selected criteria.')
          } else {
            setCommissionData(response.data)
            toast.success('Report generated successfully.')
          }
        } else {
          toast.error('Error: Invalid response structure.')
          console.error('Error: Invalid response structure', response)
        }
      } catch (error) {
        console.error('Error fetching commission report:', error)

        if (error.response && error.response.data) {
          const errorData = error.response.data
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
          toast.error('An unexpected error occurred while generating the report.')
        }
      }
    } else {
      toast.error('Please select all fields.')
    }
  }

  return (
    <div className="report-container">
      <h1 className="heading">Commission Report</h1>
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

      <div className="dropdowns">
        <div className="dropdown-wrapper">
          <label>Choose Outlet</label>
          <Autocomplete
            value={outlets.find((outlet) => outlet.id === selectedOutlet) || null}
            onChange={handleOutletChange}
            options={outlets}
            getOptionLabel={(option) => option.outlet_name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} />}
            disableClearable
          />
        </div>

        <div className="dropdown-wrapper">
          <label>Choose Salesman</label>
          <Autocomplete
            value={salesmen.find((salesman) => salesman.salesman_code === selectedSalesman) || null}
            onChange={handleSalesmanChange}
            options={salesmen}
            getOptionLabel={(option) => option.salesman_name}
            isOptionEqualToValue={(option, value) => option.salesman_code === value.salesman_code}
            renderInput={(params) => <TextField {...params} />}
            disableClearable
            disabled={!selectedOutlet}
          />
        </div>
      </div>

      <div className="date-range">
        <div className="date-wrapper">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="date-input"
          />
        </div>

        <div className="date-wrapper">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="date-input"
          />
        </div>
      </div>

      <button className="generate-report-btn" onClick={handleGenerateReport}>
        Generate Report
      </button>

      {commissionData.length > 0 && (
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Till Date</th>
                <th>Invoice</th>
                <th>SKU</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Gross Total</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Percentage (%)</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {commissionData.map((item, index) => (
                <tr key={index}>
                  <td>{item.till_date}</td>
                  <td>{item.invoice}</td>
                  <td>{item.sku}</td>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>{item.Price}</td>
                  <td>{item.gross_total}</td>
                  <td>{item.discount}</td>
                  <td>{item.total}</td>
                  <td>{item['Per(%)']}</td>
                  <td>{item.Commission}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  Totals:
                </td>
                <td>
                  <strong>
                    {commissionData.reduce((acc, item) => acc + parseFloat(item.quantity || 0), 0)}
                  </strong>
                </td>
                <td>
                  <strong>
                    {commissionData
                      .reduce((acc, item) => acc + parseFloat(item.Price || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td>
                  <strong>
                    {commissionData
                      .reduce((acc, item) => acc + parseFloat(item.gross_total || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td>
                  <strong>
                    {commissionData
                      .reduce((acc, item) => acc + parseFloat(item.discount || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td>
                  <strong>
                    {commissionData
                      .reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td></td>
                <td>
                  <strong>
                    {commissionData
                      .reduce((acc, item) => acc + parseFloat(item.Commission || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}

export default CommissionReport
