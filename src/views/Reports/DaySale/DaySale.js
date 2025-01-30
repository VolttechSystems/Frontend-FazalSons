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

  const printInvoice = () => {
    if (!detailData) return

    const printWindow = window.open('', '_blank')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            .container { padding: 20px; border: 2px solid black; width: 300px; margin: auto; }
            .header { font-weight: bold; text-transform: uppercase; font-size: 14px; margin-bottom: 10px; }
            .info, .table { font-size: 12px; width: 100%; text-align: left; margin-top: 10px; }
            .table th, .table td { border-bottom: 1px solid black; padding: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">POINT OF SALE</div>
            <div class="info">Sample Address</div>
            <div class="info">Tel: 010101010</div>
            <div class="info">Email: abc@pos.com</div>

            <div class="header">SALES INVOICE</div>

            <div class="info"><strong>Customer Type:</strong> ${detailData.customer_type}</div>
            <div class="info"><strong>Date:</strong> ${detailData.date}</div>
            <div class="info"><strong>Gross Total:</strong> ₨ ${detailData.gross_total}</div>
            <div class="info"><strong>Discount:</strong> ₨ ${detailData.discount}</div>
            <div class="info"><strong>Grand Total:</strong> ₨ ${detailData.grand_total}</div>
            <div class="info"><strong>Status:</strong> ${detailData.status}</div>

            <table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${detailData.items
                  .map(
                    (item) =>
                      `<tr>
                        <td>${item.product || 'N/A'}</td>
                        <td>${item.quantity}</td>
                        <td>₨ ${item.item_total}</td>
                      </tr>`,
                  )
                  .join('')}
              </tbody>
            </table>

            <div class="info"><strong>Additional Fee:</strong> ${
              detailData?.additional_fee?.length
                ? `${detailData.additional_fee[0].fee_method} - ₨ ${detailData.additional_fee[0].fee}`
                : 'None'
            }</div>

            <div class="info"><strong>Returns:</strong> ${
              detailData?.returns?.length ? `${detailData.returns.length} items` : 'None'
            }</div>

            <div class="info"><strong>Paid:</strong> ₨ ${detailData?.Payment[0]?.amount}</div>
            <div class="info"><strong>Paid Via:</strong> ${detailData?.Payment[0]?.payment_method}</div>
          </div>

          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
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
        <Dialog open={showModal} onClose={closeModal} maxWidth="xs" fullWidth>
          <DialogContent
            sx={{
              fontFamily: 'monospace',
              textAlign: 'center',
              padding: '15px 15px',
              background: '#fff',
              border: 'none',
              overflow: 'hidden',
              minHeight: 'auto',
              width: '300px',
              margin: 'auto',
              boxShadow: 'none',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                marginBottom: 1,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              POINT OF SALE
            </Typography>
            <Typography sx={{ fontSize: '12px' }}>Sample Address</Typography>
            <Typography sx={{ fontSize: '12px' }}>Tel: 010101010</Typography>
            <Typography sx={{ fontSize: '12px', marginBottom: 2 }}>Email: abc@pos.com</Typography>

            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', textDecoration: 'none', marginBottom: 2 }}
            >
              SALES INVOICE
            </Typography>

            {detailData && (
              <Box sx={{ textAlign: 'left', fontSize: '12px', marginBottom: 2, lineHeight: '1.5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    <strong>Customer Type:</strong>
                  </Typography>
                  <Typography>{detailData.customer_type}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    <strong>Date:</strong>
                  </Typography>
                  <Typography>{detailData.date}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    <strong>Gross Total:</strong>
                  </Typography>
                  <Typography>₨ {detailData.gross_total}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    <strong>Discount:</strong>
                  </Typography>
                  <Typography>₨ {detailData.discount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    <strong>Grand Total:</strong>
                  </Typography>
                  <Typography>₨ {detailData.grand_total}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    <strong>Status:</strong>
                  </Typography>
                  <Typography>{detailData.status}</Typography>
                </Box>
              </Box>
            )}

            <Table
              size="small"
              sx={{
                borderTop: '2px solid black',
                borderBottom: '2px solid black',
                marginBottom: '10px',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'left' }}>
                    Item
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>
                    Qty
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'right' }}>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailData?.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '12px', textAlign: 'left' }}>
                      {item.product || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px', textAlign: 'center' }}>
                      {item.quantity}
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px', textAlign: 'right' }}>
                      ₨ {item.item_total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box sx={{ textAlign: 'left', fontSize: '12px', lineHeight: '1.5', marginBottom: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>
                  <strong>Additional Fee:</strong>
                </Typography>
                <Typography>
                  {detailData?.additional_fee?.length
                    ? `${detailData.additional_fee[0].fee_method} - ₨ ${detailData.additional_fee[0].fee}`
                    : 'None'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>
                  <strong>Returns:</strong>
                </Typography>
                <Typography>
                  {detailData?.returns?.length ? `${detailData.returns.length} items` : 'None'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>
                  <strong>Paid:</strong>
                </Typography>
                <Typography>₨ {detailData?.Payment[0]?.amount}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>
                  <strong>Paid Via:</strong>
                </Typography>
                <Typography>{detailData?.Payment[0]?.payment_method}</Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeModal}
              variant="contained"
              color="secondary"
              sx={{ fontSize: '12px' }}
            >
              Close
            </Button>
            <Button onClick={printInvoice} variant="contained" color="primary">
              Print Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>{' '}
    </Box>
  )
}

export default DaySale
