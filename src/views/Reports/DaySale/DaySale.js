// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import "./DaySale.css";

// const DaySale = () => {
//   const [outlets, setOutlets] = useState([]);
//   const [selectedOutlet, setSelectedOutlet] = useState('');
//   const [dates, setDates] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [reportData, setReportData] = useState([]);

//   // Fetch all outlets from the provided API
//   useEffect(() => {
//     axios.get('http://195.26.253.123/pos/products/fetch_all_outlet/')
//       .then(response => {
//         setOutlets(response.data);
//       })
//       .catch(error => {
//         console.error("There was an error fetching the outlets!", error);
//       });
//   }, []);

//   // Fetch dates based on selected outlet
//   useEffect(() => {
//     if (selectedOutlet) {
//       axios.get(`http://195.26.253.123/pos/report/all_outlet_dates/${selectedOutlet}/`)
//         .then(response => {
//           setDates(response.data.dates);
//         })
//         .catch(error => {
//           console.error("There was an error fetching the dates!", error);
//         });
//     }
//   }, [selectedOutlet]);

//   // Fetch daily sales report based on selected outlet and date
//   useEffect(() => {
//     if (selectedOutlet && selectedDate) {
//       axios.get(`http://195.26.253.123/pos/report/daily_sale_report/${selectedOutlet}/${selectedDate}/`)
//         .then(response => {
//           setReportData(response.data); // Assuming the response is an array of report data
//         })
//         .catch(error => {
//           console.error("There was an error fetching the report data!", error);
//         });
//     }
//   }, [selectedOutlet, selectedDate]);

//   return (
//     <div className="report-container">
//       <h2 className="heading">Sale by Day</h2>
//       <div className="dropdowns">
//         {/* First Dropdown: Outlet */}
//         <div className="dropdown-wrapper">
//           <label htmlFor="outlet">Select Outlet</label>
//           <select
//             className="dropdown"
//             value={selectedOutlet}
//             onChange={e => setSelectedOutlet(e.target.value)}
//           >
//             <option value="">Select Outlet</option>
//             {outlets.map(outlet => (
//               <option key={outlet.id} value={outlet.id}>
//                 {outlet.outlet_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Second Dropdown: Date (based on selected outlet) */}
//         <div className="dropdown-wrapper">
//           <label htmlFor="date">Select Date</label>
//           <select
//             className="dropdown"
//             value={selectedDate}
//             onChange={e => setSelectedDate(e.target.value)}
//           >
//             <option value="">Select Date</option>
//             {dates.map(date => (
//               <option key={date} value={date}>
//                 {date}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

      
//    {/* Table for displaying the daily sale report */}
// {reportData.length > 0 && (
//   <div className="report-table-container">
//     <table className="report-table">
//       <thead>
//         <tr>
//           <th>Outlet Name</th>
//           <th>Invoice Code</th>
//           <th>Customer Type</th>
//           <th>Total Amount</th>
//           <th>Return Amount</th>
//         </tr>
//       </thead>
//       <tbody>
//         {reportData.map((item, index) => (
//           <tr key={index}>
//             <td>{item.outlet_name}</td>
//             <td>{item.invoice_code}</td>
//             <td>{item.customer_type}</td>
//             <td>{item.total_amount}</td>
//             <td>{item.return_amount}</td>
//           </tr>
//         ))}
        
//         {/* Row for displaying the totals */}
//         <tr className="totals-row">
         
//           <td></td> {/* Empty cell for invoice code */}
//           <td></td> {/* Empty cell for customer type */}
//           <td><strong>Total:</strong></td>
//           <td><strong>{reportData.reduce((acc, item) => acc + parseFloat(item.total_amount || 0), 0).toFixed(2)}</strong></td>
//           <td><strong>{reportData.reduce((acc, item) => acc + parseFloat(item.return_amount || 0), 0).toFixed(2)}</strong></td>
//         </tr>
//       </tbody>
//     </table>
//   </div>
// )}


//     </div>
//   );
// };

// export default DaySale;



import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const DaySale = () => {
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://195.26.253.123/pos/products/fetch_all_outlet/")
      .then((response) => setOutlets(response.data))
      .catch(() => setError("Failed to fetch outlets. Please try again later."));
  }, []);

  useEffect(() => {
    if (selectedOutlet) {
      axios
        .get(`http://195.26.253.123/pos/report/all_outlet_dates/${selectedOutlet}/`)
        .then((response) => setDates(response.data.dates || []))
        .catch(() => setError("Failed to fetch dates. Please try again later."));
    }
  }, [selectedOutlet]);

  useEffect(() => {
    if (selectedOutlet && selectedDate) {
      axios
        .get(`http://195.26.253.123/pos/report/daily_sale_report/${selectedOutlet}/${selectedDate}/`)
        .then((response) => setReportData(response.data || []))
        .catch(() => setError("Failed to fetch report data. Please try again later."));
    }
  }, [selectedOutlet, selectedDate]);

  const fetchDetailData = (invoiceCode) => {
    axios
      .get(`http://195.26.253.123/pos/report/daily_sale_report_detail/${invoiceCode}/`)
      .then((response) => {
        setDetailData(response.data);
        setShowModal(true);
      })
      .catch(() => setError("Failed to fetch detailed report data."));
  };

  const closeModal = () => {
    setShowModal(false);
    setDetailData(null);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f4f4f4", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
        Sale by Day
      </Typography>
      {error && (
        <Typography sx={{ color: "red", marginBottom: 2 }}>{error}</Typography>
      )}
      <Box sx={{ display: "flex", gap: 3, marginBottom: 3 }}>
        <Select
          value={selectedOutlet}
          onChange={(e) => setSelectedOutlet(e.target.value)}
          displayEmpty
          fullWidth
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1,
            padding: 1,
          }}
        >
          <MenuItem value="">Select Outlet</MenuItem>
          {outlets.map((outlet) => (
            <MenuItem key={outlet.id} value={outlet.id}>
              {outlet.outlet_name}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          displayEmpty
          fullWidth
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1,
            padding: 1,
          }}
        >
          <MenuItem value="">Select Date</MenuItem>
          {dates.map((date) => (
            <MenuItem key={date} value={date}>
              {date}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {reportData.length > 0 && (
        <Table sx={{ backgroundColor: "#fff", borderRadius: 1 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Outlet Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Invoice Code</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Customer Type</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Total Amount</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Return Amount</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.outlet_name}</TableCell>
                <TableCell>{item.invoice_code}</TableCell>
                <TableCell>{item.customer_type}</TableCell>
                <TableCell>{item.total_amount}</TableCell>
                <TableCell>{item.return_amount}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => fetchDetailData(item.invoice_code)}
                  >
                    Report Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>Report Details</DialogTitle>
        <DialogContent>
          {detailData && (
            <Box>
              <Typography sx={{ marginBottom: 1 }}>
                <strong>Customer Type:</strong> {detailData.customer_type}
              </Typography>
              <Typography sx={{ marginBottom: 1 }}>
                <strong>Date:</strong> {detailData.date}
              </Typography>
              <Typography sx={{ marginBottom: 1 }}>
                <strong>Gross Total:</strong> {detailData.gross_total}
              </Typography>
              <Typography sx={{ marginBottom: 1 }}>
                <strong>Discount:</strong> {detailData.discount}
              </Typography>
              <Typography sx={{ marginBottom: 1 }}>
                <strong>Grand Total:</strong> {detailData.grand_total}
              </Typography>
              <Typography sx={{ marginBottom: 1 }}>
                <strong>Status:</strong> {detailData.status}
              </Typography>
              <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                Items
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                  <TableCell>SKU</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Variation</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Per Rate</TableCell>
                    <TableCell>Gross Total</TableCell>
                    <TableCell>Discounted Value</TableCell>
                    <TableCell>Item Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.product || "N/A"}</TableCell>
                      <TableCell>{item.variation || "N/A"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.per_rate}</TableCell>
                      <TableCell>{item.gross_total}</TableCell>
                      <TableCell>{item.discounted_value}</TableCell>
                      <TableCell>{item.item_total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                Payments
              </Typography>
              {detailData.Payment.map((payment, index) => (
                <Typography key={index} sx={{ marginBottom: 1 }}>
                  <strong>Method:</strong> {payment.payment_method},{" "}
                  <strong>Amount:</strong> {payment.amount}
                </Typography>
              ))}
              <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                Returns
              </Typography>
              {detailData.returns.length > 0 ? (
                detailData.returns.map((returnItem, index) => (
                  <Typography key={index} sx={{ marginBottom: 1 }}>
                    <strong>Return Details:</strong> {JSON.stringify(returnItem)}
                  </Typography>
                ))
              ) : (
                <Typography>No Returns</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} variant="contained" color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DaySale;
