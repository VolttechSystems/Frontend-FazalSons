// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import './CustomerChannel.css'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import { Network, Urls } from '../../../api-config'
// import { Link } from 'react-router-dom'

// const CustomerChannel = () => {
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     code: '',
//     customer_channel: '',
//     shop: '',
//   })
//   const [channels, setChannels] = useState([])
//   const [isEditing, setIsEditing] = useState(false)
//   const [editId, setEditId] = useState(null)
//   const [currentPage, setCurrentPage] = useState(0)
//   const [totalPages, setTotalPages] = useState(1)
//   const [pageSize] = useState(10)

//   useEffect(() => {
//     const shopId = localStorage.getItem('shop_id')
//     if (shopId) {
//       setFormData((prev) => ({ ...prev, shop: shopId }))
//     } else {
//       toast.error('Shop ID not found in local storage.')
//     }
//     fetchChannels(currentPage)
//   }, [currentPage])

//   const fetchChannels = async (page = 0) => {
//     const shopId = localStorage.getItem('shop_id')
//     if (!shopId) {
//       toast.error('Shop ID not found in local storage.')
//       return
//     }

//     try {
//       const response = await Network.get(
//         `${Urls.addCustomerChannel}/${shopId}?Starting=${page}&limit=${pageSize}`,
//       )
//       if (response.ok && response.data) {
//         setChannels(response.data)
//         setTotalPages(Math.ceil(response.data.count / pageSize))
//       } else {
//         toast.error('Failed to fetch channels.')
//       }
//     } catch (error) {
//       console.error('Error fetching channels:', error)
//       toast.error('Error fetching channels.')
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })
//   }

//   const handleAddOrUpdateChannel = async (e) => {
//     e.preventDefault()
//     const shopId = localStorage.getItem('shop_id')
//     if (!shopId) {
//       toast.error('Shop ID not found in local storage.')
//       return
//     }

//     try {
//       if (isEditing) {
//         const response = await Network.put(
//           `${Urls.actionCustomerChannel}/${shopId}/${editId}`,
//           formData,
//         )
//         if (response.ok) {
//           setChannels((prev) =>
//             prev.map((channel) => (channel.id === editId ? { ...channel, ...formData } : channel)),
//           )
//           toast.success('Channel updated successfully!')
//         } else {
//           toast.error('Error updating channel.')
//         }
//       } else {
//         const response = await Network.post(`${Urls.addCustomerChannel}/${shopId}`, formData)
//         if (response.ok && response.data) {
//           setChannels((prev) => [response.data, ...prev]) // Add new channel to the top of the table
//           toast.success('Channel added successfully!')
//         } else {
//           toast.error('Error adding channel.')
//         }
//       }
//       resetForm()
//     } catch (error) {
//       console.error('Error adding/updating channel:', error)
//       toast.error('Error adding/updating channel.')
//     }
//   }

//   const handleEdit = (id) => {
//     const channelToEdit = channels.find((channel) => channel.id === id)
//     if (channelToEdit) {
//       setFormData({
//         customer_channel: channelToEdit.customer_channel,
//         code: channelToEdit.code || '',
//         shop: channelToEdit.shop,
//       })
//       setIsEditing(true)
//       setEditId(id)
//     }
//   }

//   const handleDelete = async (id) => {
//     const shopId = localStorage.getItem('shop_id')
//     if (!shopId) {
//       toast.error('Shop ID not found in local storage.')
//       return
//     }

//     try {
//       const response = await Network.delete(`${Urls.actionCustomerChannel}/${shopId}/${id}`)
//       if (response.ok) {
//         setChannels((prev) => prev.filter((channel) => channel.id !== id))
//         toast.success('Channel deleted successfully!')
//       } else {
//         toast.error('Error deleting channel.')
//       }
//     } catch (error) {
//       console.error('Error deleting channel:', error)
//       toast.error('Error deleting channel.')
//     }
//   }

//   const resetForm = () => {
//     setFormData({ code: '', customer_channel: '', shop: localStorage.getItem('shop_id') })
//     setIsEditing(false)
//     setEditId(null)
//   }

//   const handlePageChange = (page) => {
//     if (page >= 0 && page < totalPages) {
//       setCurrentPage(page)
//     }
//   }

//   return (
//     <div className="customer-channel-container">
//       <Link to="/Customer/AddCustomer" className="back-button">
//         Back to Add Customer
//       </Link>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//       <h2>{isEditing ? 'Edit' : 'Add'} Customer Channel</h2>
//       <form onSubmit={handleAddOrUpdateChannel} className="channel-form">
//         <div className="form-group">
//           <label>Channel:</label>
//           <input
//             type="text"
//             name="customer_channel"
//             value={formData.customer_channel}
//             onChange={handleChange}
//             required
//             className="form-input"
//           />
//         </div>
//         <button type="submit" className={`submit-button ${isEditing ? 'edit' : 'add'}`}>
//           {isEditing ? 'Update' : 'Add'}
//         </button>
//       </form>

//       <h3>Customer Channels</h3>
//       <table className="channel-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Channel</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {channels && channels.length > 0 ? (
//             channels.map((channel) => (
//               <tr key={channel.id}>
//                 <td>{channel.id}</td>
//                 <td>{channel.customer_channel}</td>
//                 <td>
//                   <button onClick={() => handleEdit(channel.id)} className="edit-button">
//                     Edit
//                   </button>
//                   <button onClick={() => handleDelete(channel.id)} className="delete-button">
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="3">No channels found.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <div
//         className="pagination"
//         style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}
//       >
//         <button
//           style={{
//             padding: '5px 10px',
//             marginRight: '5px',
//             backgroundColor: '#007BFF', // Blue background
//             color: 'white', // White text
//             border: 'none', // Remove border
//             borderRadius: '4px', // Rounded corners
//             cursor: 'pointer',
//           }}
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 0}
//         >
//           Previous
//         </button>
//         <button
//           style={{
//             padding: '5px 10px',
//             backgroundColor: '#007BFF', // Blue background
//             color: 'white', // White text
//             border: 'none', // Remove border
//             borderRadius: '4px', // Rounded corners
//             cursor: 'pointer',
//           }}
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages - 1}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   )
// }

// export default CustomerChannel

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'
import { Link } from 'react-router-dom'

import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material'

const CustomerChannel = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    code: '',
    customer_channel: '',
    shop: '',
  })
  const [channels, setChannels] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)

  useEffect(() => {
    const shopId = localStorage.getItem('shop_id')
    if (shopId) {
      setFormData((prev) => ({ ...prev, shop: shopId }))
    } else {
      toast.error('Shop ID not found in local storage.')
    }
    fetchChannels(currentPage)
  }, [currentPage])

  const fetchChannels = async (page = 0) => {
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      toast.error('Shop ID not found in local storage.')
      return
    }

    try {
      const response = await Network.get(
        `${Urls.addCustomerChannel}/${shopId}?Starting=${page}&limit=${pageSize}`,
      )
      if (response.ok && response.data) {
        setChannels(response.data)
        setTotalPages(Math.ceil(response.data.count / pageSize))
      } else {
        toast.error('Failed to fetch channels.')
      }
    } catch (error) {
      console.error('Error fetching channels:', error)
      toast.error('Error fetching channels.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddOrUpdateChannel = async (e) => {
    e.preventDefault()
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      toast.error('Shop ID not found in local storage.')
      return
    }

    try {
      if (isEditing) {
        const response = await Network.put(
          `${Urls.actionCustomerChannel}/${shopId}/${editId}`,
          formData,
        )
        if (response.ok) {
          setChannels((prev) =>
            prev.map((channel) => (channel.id === editId ? { ...channel, ...formData } : channel)),
          )
          toast.success('Channel updated successfully!')
        } else {
          toast.error('Error updating channel.')
        }
      } else {
        const response = await Network.post(`${Urls.addCustomerChannel}/${shopId}`, formData)
        if (response.ok && response.data) {
          setChannels((prev) => [response.data, ...prev]) // Add new channel to the top of the table
          toast.success('Channel added successfully!')
        } else {
          toast.error('Error adding channel.')
        }
      }
      resetForm()
    } catch (error) {
      console.error('Error adding/updating channel:', error)
      toast.error('Error adding/updating channel.')
    }
  }

  const handleEdit = (id) => {
    const channelToEdit = channels.find((channel) => channel.id === id)
    if (channelToEdit) {
      setFormData({
        customer_channel: channelToEdit.customer_channel,
        code: channelToEdit.code || '',
        shop: channelToEdit.shop,
      })
      setIsEditing(true)
      setEditId(id)
    }
  }

  const handleDelete = async (id) => {
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      toast.error('Shop ID not found in local storage.')
      return
    }

    try {
      const response = await Network.delete(`${Urls.actionCustomerChannel}/${shopId}/${id}`)
      if (response.ok) {
        setChannels((prev) => prev.filter((channel) => channel.id !== id))
        toast.success('Channel deleted successfully!')
      } else {
        toast.error('Error deleting channel.')
      }
    } catch (error) {
      console.error('Error deleting channel:', error)
      toast.error('Error deleting channel.')
    }
  }

  const resetForm = () => {
    setFormData({ code: '', customer_channel: '', shop: localStorage.getItem('shop_id') })
    setIsEditing(false)
    setEditId(null)
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page - 1)
  }

  return (
    <Card sx={{ border: '1px solid #ddd', maxWidth: 1200, margin: '0 auto' }}>
      <CardHeader>
        <Typography variant="h4" align="center" gutterBottom>
          {isEditing ? 'Edit Customer Channel' : 'Add Customer Channel'}
        </Typography>
      </CardHeader>
      <CardContent>
        {/* <Link to="/Customer/AddCustomer">
          <Button variant="outlined" color="primary" sx={{ mb: 2 }}>
            Back to Add Customer
          </Button>
        </Link> */}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Typography variant="h6" gutterBottom>
          Customer Channel
        </Typography>

        <form onSubmit={handleAddOrUpdateChannel}>
          <Box mb={2}>
            <TextField
              label="Channel"
              name="customer_channel"
              value={formData.customer_channel}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </form>

        <Typography variant="h5" sx={{ mt: 4 }} gutterBottom>
          Customer Channels
        </Typography>

        <TableContainer component={Paper} sx={{ border: '1px solid #ddd' }}>
          <Table
            sx={{
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              '& td, & th': { border: '1px solid #ddd', padding: '8px' },
            }}
          >
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff', textAlign: 'center', width: '33%' }}>ID</TableCell>
                <TableCell sx={{ color: '#fff', textAlign: 'center', width: '33%' }}>
                  Channel
                </TableCell>
                <TableCell sx={{ color: '#fff', textAlign: 'center', width: '33%' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {channels.length > 0 ? (
                channels.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell align="center">{channel.id}</TableCell>
                    <TableCell align="center">{channel.customer_channel}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(channel.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(channel.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No channels found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={handlePageChange}
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            '& .MuiPaginationItem-root': {
              backgroundColor: '#1976d2',
              color: '#fff',
              borderRadius: '50%',
            },
          }}
        />
      </CardContent>
    </Card>
  )
}

export default CustomerChannel
