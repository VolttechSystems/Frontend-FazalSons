import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Typography,
  TextField,
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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'

const CustomerType = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    customer_type: '',
    shop: '',
  })
  const [customerTypes, setCustomerTypes] = useState([])
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
    fetchCustomerTypes(currentPage)
  }, [currentPage])

  const fetchCustomerTypes = async (page = 0) => {
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      toast.error('Shop ID not found in local storage.')
      return
    }

    try {
      const response = await Network.get(
        `${Urls.addCustomerType}/${shopId}?Starting=${page}&limit=${pageSize}`,
      )
      if (response.ok && response.data) {
        setCustomerTypes(response.data)
        setTotalPages(Math.ceil(response.data.count / pageSize))
      } else {
      }
    } catch (error) {
      console.error('Error fetching customer types:', error)
      toast.error('Error fetching customer types.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddOrUpdateType = async (e) => {
    e.preventDefault()

    // Ensure shop ID is included in formData
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      toast.error('Shop ID not found in local storage.')
      return
    }

    const updatedFormData = { ...formData, shop: shopId }

    try {
      if (isEditing) {
        const response = await Network.put(
          `${Urls.actionCustomerType}/${shopId}/${editId}`,
          updatedFormData,
        )
        if (response.ok) {
          setCustomerTypes((prev) =>
            prev.map((type) => (type.id === editId ? { ...type, ...updatedFormData } : type)),
          )
          toast.success('Customer Type updated successfully!')
        } else {
          toast.error('Error updating customer type.')
        }
      } else {
        const response = await Network.post(`${Urls.addCustomerType}/${shopId}`, updatedFormData)
        if (response.ok && response.data) {
          setCustomerTypes((prev) => [response.data, ...prev])
          toast.success('Customer Type added successfully!')
        } else {
          toast.error('Error adding customer type.')
        }
      }
      resetForm()
    } catch (error) {
      console.error('Error adding/updating customer type:', error)
      toast.error('Error adding/updating customer type.')
    }
  }

  const handleEdit = (id) => {
    const typeToEdit = customerTypes.find((type) => type.id === id)
    if (typeToEdit) {
      setFormData({
        customer_type: typeToEdit.customer_type,
        shop: localStorage.getItem('shop_id'), // Ensure shop ID is included
      })
      setIsEditing(true)
      setEditId(id)
    }
  }

  const resetForm = () => {
    setFormData({
      customer_type: '',
      shop: localStorage.getItem('shop_id'), // Retain the shop ID when resetting the form
    })
    setIsEditing(false)
    setEditId(null)
  }

  const handleDelete = async (id) => {
    const shopId = localStorage.getItem('shop_id')
    if (!shopId) {
      toast.error('Shop ID not found in local storage.')
      return
    }

    try {
      const response = await Network.delete(`${Urls.actionCustomerType}/${shopId}/${id}`)
      if (response.ok) {
        setCustomerTypes((prev) => prev.filter((type) => type.id !== id))
        toast.success('Customer Type deleted successfully.')
      } else {
        toast.error('Error deleting customer type.')
      }
    } catch (error) {
      console.error('Error deleting customer type:', error)
      toast.error('Error deleting customer type.')
    }
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page - 1)
  }

  return (
    <Card
      sx={{
        border: '1px solid #ddd',
        maxWidth: 1100,
        maxHeight: 550,
        margin: '0 auto',
        padding: 2,
      }}
    >
      <CardHeader>
        <Typography variant="h4" align="center" gutterBottom>
          {isEditing ? 'Edit Customer Type' : 'Add Customer Type'}
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
          Customer Type
        </Typography>

        <form onSubmit={handleAddOrUpdateType}>
          <Box mb={2}>
            <TextField
              label="Type"
              name="customer_type"
              value={formData.customer_type}
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
          Customer Types
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
                  Type
                </TableCell>
                <TableCell sx={{ color: '#fff', textAlign: 'center', width: '33%' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerTypes.length > 0 ? (
                customerTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell align="center">{type.id}</TableCell>
                    <TableCell align="center">{type.customer_type}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(type.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(type.id)}
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
                    No customer types found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <Pagination
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
        /> */}
      </CardContent>
    </Card>
  )
}

export default CustomerType
