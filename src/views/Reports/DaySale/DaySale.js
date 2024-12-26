import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./DaySale.css";

const DaySale = () => {
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [reportData, setReportData] = useState([]);

  // Fetch all outlets from the provided API
  useEffect(() => {
    axios.get('http://195.26.253.123/pos/products/fetch_all_outlet/')
      .then(response => {
        setOutlets(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the outlets!", error);
      });
  }, []);

  // Fetch dates based on selected outlet
  useEffect(() => {
    if (selectedOutlet) {
      axios.get(`http://195.26.253.123/pos/report/all_outlet_dates/${selectedOutlet}/`)
        .then(response => {
          setDates(response.data.dates);
        })
        .catch(error => {
          console.error("There was an error fetching the dates!", error);
        });
    }
  }, [selectedOutlet]);

  // Fetch daily sales report based on selected outlet and date
  useEffect(() => {
    if (selectedOutlet && selectedDate) {
      axios.get(`http://195.26.253.123/pos/report/daily_sale_report/${selectedOutlet}/${selectedDate}/`)
        .then(response => {
          setReportData(response.data); // Assuming the response is an array of report data
        })
        .catch(error => {
          console.error("There was an error fetching the report data!", error);
        });
    }
  }, [selectedOutlet, selectedDate]);

  return (
    <div className="report-container">
      <h2 className="heading">Sale by Day</h2>
      <div className="dropdowns">
        {/* First Dropdown: Outlet */}
        <div className="dropdown-wrapper">
          <label htmlFor="outlet">Select Outlet</label>
          <select
            className="dropdown"
            value={selectedOutlet}
            onChange={e => setSelectedOutlet(e.target.value)}
          >
            <option value="">Select Outlet</option>
            {outlets.map(outlet => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.outlet_name}
              </option>
            ))}
          </select>
        </div>

        {/* Second Dropdown: Date (based on selected outlet) */}
        <div className="dropdown-wrapper">
          <label htmlFor="date">Select Date</label>
          <select
            className="dropdown"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          >
            <option value="">Select Date</option>
            {dates.map(date => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </div>

      
      {/* Table for displaying the daily sale report */}
{reportData.length > 0 && (
  <div className="report-table-container">
    <table className="report-table">
      <thead>
        <tr>
          <th>Outlet Name</th>
          <th>Invoice Code</th>
          <th>Customer Type</th>
          <th>Total Amount</th>
          <th>Return Amount</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((item, index) => (
          <tr key={index}>
            <td>{item.outlet_name}</td>
            <td>{item.invoice_code}</td>
            <td>{item.customer_type}</td>
            <td>{item.total_amount}</td>
            <td>{item.return_amount}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Displaying the totals */}
    <div className="totals-container">
      <p>
        Total of Total Amount: {reportData.reduce((acc, item) => acc + parseFloat(item.total_amount || 0), 0).toFixed(2)}
      </p>
      <p>
        Total of Return Amount: {reportData.reduce((acc, item) => acc + parseFloat(item.return_amount || 0), 0).toFixed(2)}
      </p>
    </div>
  </div>
)}


    </div>
  );
};

export default DaySale;
