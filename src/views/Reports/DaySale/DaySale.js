import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'

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
  TextField,
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

const DaySale = () => {
  const [outlets, setOutlets] = useState([])
  const [selectedOutlet, setSelectedOutlet] = useState('')
  const [dates, setDates] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [reportData, setReportData] = useState([])
  const [detailData, setDetailData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const { userOutlets } = useAuth()

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

  useEffect(() => {
    if (selectedOutlet) {
      const url = `${Urls.ProfitReportDates}/${selectedOutlet}/`

      Network.get(url)
        .then((response) => setDates(response.data.dates || []))
        .catch(() => setError('Failed to fetch dates. Please try again later.'))
    }
  }, [selectedOutlet])

  useEffect(() => {
    if (selectedOutlet && selectedDate) {
      const url = `${Urls.dailySaleReport}/${selectedOutlet}/${selectedDate}/`

      Network.get(url)
        .then((response) => setReportData(response.data || []))
        .catch(() => setError('Failed to fetch report data. Please try again later.'))
    }
  }, [selectedOutlet, selectedDate])

  const fetchDetailData = (invoiceCode) => {
    const url = `${Urls.dailySaleReportDetail}/${invoiceCode}/`

    Network.get(url)
      .then((response) => {
        setDetailData(response.data)
        setShowModal(true)
      })
      .catch(() => setError('Failed to fetch detailed report data.'))
  }

  const closeModal = () => {
    setShowModal(false)
    setDetailData(null)
  }

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
          Sale by Day
        </Typography>
        {error && <Typography sx={{ color: 'red', marginBottom: 2 }}>{error}</Typography>}
        <Box sx={{ display: 'flex', gap: 3, marginBottom: 3 }}>
          {/* <Select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            displayEmpty
            fullWidth
            sx={{
              backgroundColor: '#fff',
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
          </Select> */}
          {/* Autocomplete for Outlet with search feature */}
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

          {/* <Select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            displayEmpty
            fullWidth
            sx={{
              backgroundColor: '#fff',
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
          </Select> */}
          {/* Autocomplete for Date with search feature */}
          <Autocomplete
            value={selectedDate}
            onChange={(event, newValue) => setSelectedDate(newValue)}
            options={dates}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Select Date" />}
            fullWidth
            disableClearable
          />
        </Box>
        {reportData.length > 0 && (
          <Table sx={{ backgroundColor: '#fff', borderRadius: 1 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Outlet Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Invoice Code</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Customer Type</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Total Amount</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Return Amount</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
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
          <DialogTitle sx={{ fontWeight: 'bold' }}>Report Details</DialogTitle>
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
                        <TableCell>{item.product || 'N/A'}</TableCell>
                        <TableCell>{item.variation || 'N/A'}</TableCell>
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
                    <strong>Method:</strong> {payment.payment_method}, <strong>Amount:</strong>{' '}
                    {payment.amount}
                  </Typography>
                ))}
                <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                  Additional Fees
                </Typography>
                {detailData.additional_fee.map((additionalfee, index) => (
                  <Typography key={index} sx={{ marginBottom: 1 }}>
                    <strong>Method:</strong> {additionalfee.fee_method}, <strong>Fee:</strong>{' '}
                    {additionalfee.fee}
                  </Typography>
                ))}
                <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                  Returns
                </Typography>
                {detailData.returns.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Variation</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Per Rate</TableCell>
                        <TableCell>Item Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detailData.returns.map((returnItem, index) => (
                        <TableRow key={index}>
                          <TableCell>{returnItem.product}</TableCell>
                          <TableCell>{returnItem.variation}</TableCell>
                          <TableCell>{returnItem.quantity}</TableCell>
                          <TableCell>{returnItem.per_rate}</TableCell>
                          <TableCell>{returnItem.item_total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
      </Box>{' '}
    </Box>
  )
}

export default DaySale
