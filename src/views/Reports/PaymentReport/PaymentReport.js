import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Network, Urls } from '../../../api-config'
import {
  Button,
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

const PaymentReport = () => {
  const [outlets, setOutlets] = useState([])
  const [selectedOutlet, setSelectedOutlet] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [reportData, setReportData] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOutlets = async () => {
      const response = await Network.get(Urls.fetchtheOutlets)
      if (!response.ok) return consoe.log(response.data.error)
      setOutlets(response.data)
    }

    fetchOutlets()
  }, [])

  // useEffect(() => {
  //   if (selectedOutlet && selectedDate) {
  //     // Fetch payment method report
  //     axios
  //       .get(
  //         `http://195.26.253.123/pos/report/payment-method-report/${selectedOutlet}/${selectedDate}/`,
  //       )
  //       .then((response) => setReportData(response.data || []))
  //       .catch(() => setError('Failed to fetch payment method report. Please try again later.'))
  //   }
  // }, [selectedOutlet, selectedDate])

  useEffect(() => {
    if (selectedOutlet && selectedDate) {
      // Fetch payment method report
      const url = `${Urls.paymentMethodReport}/${selectedOutlet}/${selectedDate}/`

      Network.get(url)
        .then((response) => setReportData(response.data || []))
        .catch(() => setError('Failed to fetch payment method report. Please try again later.'))
    }
  }, [selectedOutlet, selectedDate])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          backgroundColor: '#fff',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}
        >
          Payment Method Report
        </Typography>
        {error && <Typography sx={{ color: 'red', marginBottom: 2 }}>{error}</Typography>}
        <Box sx={{ display: 'flex', gap: 3, marginBottom: 3 }}>
          <Select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">Select Outlet</MenuItem>
            {outlets.map((outlet) => (
              <MenuItem key={outlet.id} value={outlet.id}>
                {outlet.outlet_name}
              </MenuItem>
            ))}
          </Select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </Box>
        {reportData.length > 0 && (
          <Table sx={{ backgroundColor: '#fff', borderRadius: 1 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Payment Method</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.payment_method}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  )
}

export default PaymentReport
