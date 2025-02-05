import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './SaleReport.css'
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'

const SaleReport = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reportData, setReportData] = useState([])
  const [outlets, setOutlets] = useState([]) // State to hold outlet data
  const [selectedOutlet, setSelectedOutlet] = useState('') // State to store selected outlet
  const { userOutlets } = useAuth()

  // Fetch outlets for the dropdown
  // useEffect(() => {
  //   const fetchOutlets = async () => {
  //     const response = await Network.get(Urls.fetchtheOutlets)
  //     if (!response.ok) return consoe.log(response.data.error)
  //     setOutlets(response.data)
  //   }

  //   fetchOutlets()
  // }, [])

  // Fetch outlets on component mount
  useEffect(() => {
    fetchOutlets()
  }, [])

  const fetchOutlets = async () => {
    const shopId = localStorage.getItem('shop_id') // Get shop_id from local storage
    const response = await Network.get(`${Urls.addOutlets}/${shopId}/`)

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

  // Fetch the sales report based on the selected dates and outlet
  // useEffect(() => {
  //   if (startDate && endDate && selectedOutlet) {
  //     const formattedStartDate = new Date(startDate).toISOString().split('T')[0] // Format to yyyy-mm-dd
  //     const formattedEndDate = new Date(endDate).toISOString().split('T')[0] // Format to yyyy-mm-dd
  //     const url = `http://195.26.253.123/pos/report/sales_report/${selectedOutlet}/${formattedStartDate}/${formattedEndDate}/`

  //     axios
  //       .get(url)
  //       .then((response) => {
  //         setReportData(response.data) // Assuming the response is an array of report data
  //       })
  //       .catch((error) => {
  //         console.error('There was an error fetching the report data!', error)
  //       })
  //   }
  // }, [startDate, endDate, selectedOutlet]) // The effect runs whenever startDate, endDate, or selectedOutlet changes

  useEffect(() => {
    if (startDate && endDate && selectedOutlet) {
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0] // Format to yyyy-mm-dd
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0] // Format to yyyy-mm-dd
      const url = `${Urls.salesReport}/${selectedOutlet}/${formattedStartDate}/${formattedEndDate}/`

      Network.get(url)
        .then((response) => {
          setReportData(response.data) // Assuming the response is an array of report data
        })
        .catch((error) => {
          console.error('There was an error fetching the report data!', error)
        })
    }
  }, [startDate, endDate, selectedOutlet]) // The effect runs whenever startDate, endDate, or selectedOutlet changes

  return (
    <div className="report-container">
      <h2 className="heading">Sale Report</h2>

      <div className="dropdowns">
        {/* Outlet Dropdown */}

        {/* <select
            id="outlet"
            className="dropdown"
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
          >
            <option value="">Select an Outlet</option>
            {outlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.outlet_name}
              </option>
            ))}
          </select> */}
        <Autocomplete
          value={outlets.find((outlet) => outlet.id === selectedOutlet) || null} // Find the outlet object based on selected id
          onChange={(event, newValue) => {
            // Store only the outlet ID (when an outlet is selected)
            setSelectedOutlet(newValue ? newValue.id : null)
          }}
          options={outlets}
          getOptionLabel={(option) => option.outlet_name}
          renderInput={(params) => <TextField {...params} label="Select Outlet" />}
          fullWidth
          disableClearable
        />

        {/* Start Date Picker */}
        <div className="date-wrapper">
          <label htmlFor="start-date" className="label">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            className="date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date Picker */}
        <div className="date-wrapper">
          <label htmlFor="end-date" className="label">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            className="date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      {/* Table for displaying the sales report */}
      {reportData.length > 0 && (
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Till Date</th>
                <th>Total Sale</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td>{item.till_date}</td>
                  <td>{item.total_sale}</td>
                </tr>
              ))}

              {/* Row for displaying the total of total_sale */}
              <tr className="totals-row">
                <td>
                  <strong>Total:</strong>
                </td>
                <td>
                  <strong>
                    {reportData
                      .reduce((acc, item) => acc + parseFloat(item.total_sale || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SaleReport
