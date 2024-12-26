import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./SaleReport.css";

const SaleReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  // Fetch the sales report based on the selected dates whenever start or end date changes
  useEffect(() => {
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0]; // Format to yyyy-mm-dd
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0]; // Format to yyyy-mm-dd
      const url = `http://195.26.253.123/pos/report/sales_report/${formattedStartDate}/${formattedEndDate}/`;

      axios.get(url)
        .then(response => {
          setReportData(response.data); // Assuming the response is an array of report data
        })
        .catch(error => {
          console.error("There was an error fetching the report data!", error);
        });
    }
  }, [startDate, endDate]); // The effect runs whenever startDate or endDate changes

  return (
    <div className="report-container">
      <h2 className="heading">Sale Report</h2>

      <div className="date-picker-container">
        {/* Start Date Picker */}
        <div className="date-picker">
          <label htmlFor="start-date">Start Date</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date Picker */}
        <div className="date-picker">
          <label htmlFor="end-date">End Date</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

     {/* Table for displaying the sales report */}
{reportData.length > 0 && (
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
    </tbody>
  </table>
)}

    </div>
  );
};

export default SaleReport;
