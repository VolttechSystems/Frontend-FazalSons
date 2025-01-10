import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Network, Urls } from '../../../api-config'
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
} from '@mui/material'

const ProductReport = () => {
  const [outlets, setOutlets] = useState([])
  const [selectedOutlet, setSelectedOutlet] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [reportData, setReportData] = useState([])
  const [detailData, setDetailData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOutlets = async () => {
      const response = await Network.get(Urls.fetchtheOutlets)
      if (!response.ok) return consoe.log(response.data.error)
      setOutlets(response.data)
    }

    fetchOutlets()
  }, [])

  useEffect(() => {
    if (selectedOutlet && selectedDate) {
      // Fetch product-wise returns
      axios
        .get(
          `http://195.26.253.123/pos/report/product-wise-returns/${selectedOutlet}/${selectedDate}/`,
        )
        .then((response) => setReportData(response.data || []))
        .catch(() => setError('Failed to fetch product-wise returns. Please try again later.'))
    }
  }, [selectedOutlet, selectedDate])

  const fetchDetailData = (invoiceCode) => {
    axios
      .get(`http://195.26.253.123/pos/report/product-wise-return-detail/${invoiceCode}/`)
      .then((response) => {
        const data = response.data
        if (Array.isArray(data) && data.length > 0) {
          setDetailData({
            items: data,
          })
        } else {
          setDetailData({ items: [] }) // Handle no data case
        }
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
          Product-Wise Returns
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
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Invoice Code</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Grand Total</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.invoice_code}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.grand_total}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => fetchDetailData(item.invoice_code)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Return Details</DialogTitle>
          <DialogContent>
            {detailData && (
              <Box>
                <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
                  Items
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Variation</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detailData.items && detailData.items.length > 0 ? (
                      detailData.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product}</TableCell>
                          <TableCell>{item.variation}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.rate}</TableCell>
                          <TableCell>{item.discount}</TableCell>
                          <TableCell>{item.total}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No items found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
    </Box>
  )
}

export default ProductReport