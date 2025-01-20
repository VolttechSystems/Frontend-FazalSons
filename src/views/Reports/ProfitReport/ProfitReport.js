// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import './ProfitReport.css' // Assuming the CSS from previous styles
// import { Network, Urls } from '../../../api-config'
// import useAuth from '../../../hooks/useAuth'
// import Autocomplete from '@mui/material/Autocomplete'
// import { TextField } from '@mui/material'

// const ProfitReport = () => {
//   const [outlets, setOutlets] = useState([])
//   const [dates, setDates] = useState([])
//   const [selectedOutlet, setSelectedOutlet] = useState(null)
//   const [selectedDate, setSelectedDate] = useState('')
//   const [reportData, setReportData] = useState([])
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

//   // Fetch available dates when outlet is selected
//   const handleOutletChange = (event) => {
//     const outletId = event.target.value
//     setSelectedOutlet(outletId)

//     // Fetch dates for the selected outlet
//     Network.get(`${Urls.ProfitReportDates}/${outletId}/`)
//       .then((response) => {
//         setDates(response.data.dates)
//       })
//       .catch((error) => {
//         console.error('Error fetching dates:', error)
//       })
//   }

//   const handleDateChange = (event) => {
//     const selectedDate = event.target.value
//     setSelectedDate(selectedDate)

//     if (selectedOutlet && selectedDate) {
//       Network.get(`${Urls.ProfitReport}${selectedOutlet}/${selectedDate}/`)
//         .then((response) => {
//           setReportData(response.data)
//         })
//         .catch((error) => {
//           console.error('Error fetching profit report:', error)
//         })
//     }
//   }

//   return (
//     <div className="report-container">
//       <h1 className="heading">Profit Report</h1>

//       <div className="dropdowns">
//         {/* First dropdown for outlet selection */}
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

//         {/* Second dropdown for date selection */}
//         <div className="dropdown-wrapper">
//           <label>Choose Date</label>
//           <select
//             className="dropdown"
//             value={selectedDate || ''}
//             onChange={handleDateChange}
//             disabled={!selectedOutlet}
//           >
//             <option value="">Select Date</option>
//             {dates.map((date, index) => (
//               <option key={index} value={date}>
//                 {date}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Table to display the profit report */}
//       {reportData.length > 0 && (
//         <table className="report-table">
//           <thead>
//             <tr>
//               <th>Invoice Code</th>
//               <th>SKU</th>
//               <th>Product Name</th>
//               <th>Quantity</th>
//               <th>Cost Price</th>
//               <th>Total Cost</th>
//               <th>Selling Price</th>
//               <th>Total</th>
//               <th>Profit</th>
//               <th>Return Rate</th>
//               <th>Return Quantity</th>
//               <th>Return Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reportData.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.invoice_code}</td>
//                 <td>{item.sku}</td>
//                 <td>{item.product_name}</td>
//                 <td>{item.quantity}</td>
//                 <td>{item.cost_price}</td>
//                 <td>{item.total_cost}</td>
//                 <td>{item.selling_price}</td>
//                 <td>{item.total}</td>
//                 <td>{item.profit}</td>
//                 <td>{item.return_rate}</td>
//                 <td>{item.return_quantity}</td>
//                 <td>{item.return_total}</td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
//                 Totals:
//               </td>
//               <td>
//                 <strong>
//                   {reportData.reduce((acc, item) => acc + parseFloat(item.quantity || 0), 0)}
//                 </strong>
//               </td>
//               <td>
//                 <strong>
//                   {reportData
//                     .reduce((acc, item) => acc + parseFloat(item.cost_price || 0), 0)
//                     .toFixed(2)}
//                 </strong>
//               </td>
//               <td>
//                 <strong>
//                   {reportData
//                     .reduce((acc, item) => acc + parseFloat(item.total_cost || 0), 0)
//                     .toFixed(2)}
//                 </strong>
//               </td>
//               <td>
//                 <strong>
//                   {reportData
//                     .reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
//                     .toFixed(2)}
//                 </strong>
//               </td>
//               <td>
//                 <strong>
//                   {reportData
//                     .reduce((acc, item) => acc + parseFloat(item.selling_price || 0), 0)
//                     .toFixed(2)}
//                 </strong>
//               </td>
//               <td>
//                 <strong>
//                   {reportData
//                     .reduce((acc, item) => acc + parseFloat(item.profit || 0), 0)
//                     .toFixed(2)}
//                 </strong>
//               </td>
//               <td>
//                 <strong>
//                   {reportData
//                     .reduce((acc, item) => acc + parseFloat(item.return_rate || 0), 0)
//                     .toFixed(2)}
//                 </strong>
//               </td>
//               <td>
//                 <strong>
//                   {reportData
//                     .reduce((acc, item) => acc + parseFloat(item.return_quantity || 0), 0)
//                     .toFixed(2)}
//                 </strong>
//               </td>
//               <td>
//                 <strong>
//                   {reportData
//                     .reduce((acc, item) => acc + parseFloat(item.return_total || 0), 0)
//                     .toFixed(2)}
//                 </strong>
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       )}
//     </div>
//   )
// }

// export default ProfitReport

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './ProfitReport.css' // Assuming the CSS from previous styles
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'

const ProfitReport = () => {
  const [outlets, setOutlets] = useState([])
  const [dates, setDates] = useState([])
  const [selectedOutlet, setSelectedOutlet] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [reportData, setReportData] = useState([])
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

  // Fetch available dates when outlet is selected
  const handleOutletChange = (event, value) => {
    const outletId = value?.id
    setSelectedOutlet(outletId)

    // Fetch dates for the selected outlet
    if (outletId) {
      Network.get(`${Urls.ProfitReportDates}/${outletId}/`)
        .then((response) => {
          setDates(response.data.dates)
        })
        .catch((error) => {
          console.error('Error fetching dates:', error)
        })
    }
  }

  const handleDateChange = (event, value) => {
    const selectedDate = value
    setSelectedDate(selectedDate)

    if (selectedOutlet && selectedDate) {
      Network.get(`${Urls.ProfitReport}${selectedOutlet}/${selectedDate}/`)
        .then((response) => {
          setReportData(response.data)
        })
        .catch((error) => {
          console.error('Error fetching profit report:', error)
        })
    }
  }

  return (
    <div className="report-container">
      <h1 className="heading">Profit Report</h1>

      <div className="dropdowns">
        {/* First dropdown for outlet selection with Autocomplete */}
        <div className="dropdown-wrapper">
          <label>Choose Outlet</label>
          <Autocomplete
            disablePortal
            id="outlet-select"
            value={outlets.find((outlet) => outlet.id === selectedOutlet) || null}
            onChange={handleOutletChange}
            options={outlets}
            getOptionLabel={(option) => option.outlet_name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Select Outlet" />}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.outlet_name}
              </li>
            )}
          />
        </div>

        {/* Second dropdown for date selection with Autocomplete */}
        <div className="dropdown-wrapper">
          <label>Choose Date</label>
          <Autocomplete
            disablePortal
            id="date-select"
            value={selectedDate}
            onChange={handleDateChange}
            options={dates}
            renderInput={(params) => <TextField {...params} label="Select Date" />}
            disabled={!selectedOutlet}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          />
        </div>
      </div>

      {/* Table to display the profit report */}
      {reportData.length > 0 && (
        <table className="report-table">
          <thead>
            <tr>
              <th>Invoice Code</th>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Total Cost</th>
              <th>Selling Price</th>
              <th>Total</th>
              <th>Profit</th>
              <th>Return Rate</th>
              <th>Return Quantity</th>
              <th>Return Total</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.invoice_code}</td>
                <td>{item.sku}</td>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{item.cost_price}</td>
                <td>{item.total_cost}</td>
                <td>{item.selling_price}</td>
                <td>{item.total}</td>
                <td>{item.profit}</td>
                <td>{item.return_rate}</td>
                <td>{item.return_quantity}</td>
                <td>{item.return_total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                Totals:
              </td>
              <td>
                <strong>
                  {reportData.reduce((acc, item) => acc + parseFloat(item.quantity || 0), 0)}
                </strong>
              </td>
              <td>
                <strong>
                  {reportData
                    .reduce((acc, item) => acc + parseFloat(item.cost_price || 0), 0)
                    .toFixed(2)}
                </strong>
              </td>
              <td>
                <strong>
                  {reportData
                    .reduce((acc, item) => acc + parseFloat(item.total_cost || 0), 0)
                    .toFixed(2)}
                </strong>
              </td>
              <td>
                <strong>
                  {reportData
                    .reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
                    .toFixed(2)}
                </strong>
              </td>
              <td>
                <strong>
                  {reportData
                    .reduce((acc, item) => acc + parseFloat(item.selling_price || 0), 0)
                    .toFixed(2)}
                </strong>
              </td>
              <td>
                <strong>
                  {reportData
                    .reduce((acc, item) => acc + parseFloat(item.profit || 0), 0)
                    .toFixed(2)}
                </strong>
              </td>
              <td>
                <strong>
                  {reportData
                    .reduce((acc, item) => acc + parseFloat(item.return_rate || 0), 0)
                    .toFixed(2)}
                </strong>
              </td>
              <td>
                <strong>
                  {reportData
                    .reduce((acc, item) => acc + parseFloat(item.return_quantity || 0), 0)
                    .toFixed(2)}
                </strong>
              </td>
              <td>
                <strong>
                  {reportData
                    .reduce((acc, item) => acc + parseFloat(item.return_total || 0), 0)
                    .toFixed(2)}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}

export default ProfitReport
