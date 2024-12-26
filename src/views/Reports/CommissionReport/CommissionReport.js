import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommissionReport.css';

const CommissionReport = () => {
  const [outlets, setOutlets] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [commissionData, setCommissionData] = useState([]);

  useEffect(() => {
    axios.get('http://195.26.253.123/pos/products/fetch_all_outlet/')
      .then(response => {
        setOutlets(response.data);
      })
      .catch(error => {
        console.error('Error fetching outlets:', error);
      });
  }, []);

  const handleOutletChange = (event) => {
    const outletId = event.target.value;
    setSelectedOutlet(outletId);

    axios.get(`http://195.26.253.123/pos/report/outlet_wise_salesman/${outletId}/`)
      .then(response => {
        setSalesmen(response.data);
      })
      .catch(error => {
        console.error('Error fetching salesmen:', error);
      });
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleGenerateReport = () => {
    if (selectedOutlet && selectedSalesman && startDate && endDate) {
      // Convert the start and end dates to YYYY-MM-DD format
      const formattedStartDate = startDate;  // already in YYYY-MM-DD format
      const formattedEndDate = endDate;  // already in YYYY-MM-DD format

      // Make sure the format is correct
      if (!/^(\d{4})-(\d{2})-(\d{2})$/.test(formattedStartDate) || !/^(\d{4})-(\d{2})-(\d{2})$/.test(formattedEndDate)) {
        alert('Invalid date format. Use YYYY-MM-DD.');
        return;
      }

      // Make API request with the formatted dates
      axios.get(`http://195.26.253.123/pos/report/salesman_commission_report/${selectedOutlet}/${selectedSalesman}/${formattedStartDate}/${formattedEndDate}/`)
        .then(response => {
          setCommissionData(response.data);
        })
        .catch(error => {
          console.error('Error fetching commission report:', error);
        });
    } else {
      alert('Please select all fields');
    }
  };

  return (
    <div className="report-container">
      <h1 className="heading">Commission Report</h1>

      <div className="dropdowns">
        <div className="dropdown-wrapper">
          <label>Choose Outlet</label>
          <select
            className="dropdown"
            value={selectedOutlet || ''}
            onChange={handleOutletChange}
          >
            <option value="">Select Outlet</option>
            {outlets.map(outlet => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.outlet_name}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown-wrapper">
          <label>Choose Salesman</label>
          <select
            className="dropdown"
            value={selectedSalesman || ''}
            onChange={(e) => setSelectedSalesman(e.target.value)}
            disabled={!selectedOutlet}
          >
            <option value="">Select Salesman</option>
            {salesmen.map(salesman => (
              <option key={salesman.salesman_code} value={salesman.salesman_code}>
                {salesman.salesman_name}
              </option>
            ))}
          </select>
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
            <td>{item["Per(%)"]}</td>
            <td>{item.Commission}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


    </div>
  );
};

export default CommissionReport;
