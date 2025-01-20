// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { Network, Urls } from '../../../api-config'
// import useAuth from '../../../hooks/useAuth'
// import {
//   Button,
//   Select,
//   MenuItem,
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from '@mui/material'

// const PaymentReport = () => {
//   const [outlets, setOutlets] = useState([])
//   const [selectedOutlet, setSelectedOutlet] = useState('')
//   const [selectedDate, setSelectedDate] = useState('')
//   const [reportData, setReportData] = useState([])
//   const [error, setError] = useState('')
//   const { userOutlets } = useAuth()

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

//   useEffect(() => {
//     if (selectedOutlet && selectedDate) {
//       // Fetch payment method report
//       const url = `${Urls.paymentMethodReport}/${selectedOutlet}/${selectedDate}/`

//       Network.get(url)
//         .then((response) => setReportData(response.data || []))
//         .catch(() => setError('Failed to fetch payment method report. Please try again later.'))
//     }
//   }, [selectedOutlet, selectedDate])

//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
//       <Box
//         sx={{
//           width: '100%',
//           maxWidth: 1200,
//           backgroundColor: '#fff',
//           padding: 4,
//           borderRadius: 2,
//           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         }}
//       >
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}
//         >
//           Payment Method Report
//         </Typography>
//         {error && <Typography sx={{ color: 'red', marginBottom: 2 }}>{error}</Typography>}
//         <Box sx={{ display: 'flex', gap: 3, marginBottom: 3 }}>
//           <Select
//             value={selectedOutlet}
//             onChange={(e) => setSelectedOutlet(e.target.value)}
//             displayEmpty
//             fullWidth
//           >
//             <MenuItem value="">Select Outlet</MenuItem>
//             {outlets.map((outlet) => (
//               <MenuItem key={outlet.id} value={outlet.id}>
//                 {outlet.outlet_name}
//               </MenuItem>
//             ))}
//           </Select>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             style={{
//               padding: '10px',
//               borderRadius: '4px',
//               border: '1px solid #ccc',
//               width: '100%',
//             }}
//           />
//         </Box>
//         {reportData.length > 0 && (
//           <Table sx={{ backgroundColor: '#fff', borderRadius: 1 }}>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: '#1976d2' }}>
//                 <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Payment Method</TableCell>
//                 <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Amount</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {reportData.map((item, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{item.payment_method}</TableCell>
//                   <TableCell>{item.amount}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </Box>
//     </Box>
//   )
// }

// export default PaymentReport

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'
import {
  Button,
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

const PaymentReport = () => {
  const [outlets, setOutlets] = useState([])
  const [selectedOutlet, setSelectedOutlet] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [reportData, setReportData] = useState([])
  const [error, setError] = useState('')
  const { userOutlets } = useAuth()

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

  useEffect(() => {
    if (selectedOutlet && selectedDate) {
      // Fetch payment method report
      const url = `${Urls.paymentMethodReport}/${selectedOutlet.id}/${selectedDate}/`

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
          {/* Autocomplete Field */}
          <Autocomplete
            options={outlets}
            getOptionLabel={(option) => option.outlet_name}
            onChange={(event, newValue) => setSelectedOutlet(newValue)}
            value={selectedOutlet}
            renderInput={(params) => (
              <TextField {...params} label="Select Outlet" variant="outlined" fullWidth />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ flex: 1 }}
          />
          {/* Date Field */}
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ flex: 1 }}
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
