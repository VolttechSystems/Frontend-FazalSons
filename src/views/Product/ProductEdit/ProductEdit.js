import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, TextField, Typography } from '@mui/material'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProductEdit = () => {
  const { id } = useParams() // Get the product ID from the URL
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      // try {
      //   const response = await axios.get(`http://195.26.253.123/pos/products/action_product/${id}/`)
      //   setProduct(response.data)
      //   setLoading(false)
      // } catch (error) {
      //   console.error('Error fetching product details:', error)
      //   setError('Failed to fetch product details.')
      //   setLoading(false)
      // }

      try {
        const response = await Network.get(`${Urls.actionProductsagain}/${id}/`)
        setProduct(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product details:', error)
        setError('Failed to fetch product details.')
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://195.26.253.123/pos/products/action_product/${id}/`, product)
      alert('Product updated successfully!')
      navigate(`/base/POSTable2`) // Redirect after saving
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product.')
    }

    // const response = await Network.put(`${Urls.actionProductsagain}/${id}/`, product)
    // if (response.ok) {
    //   toast.success('Product updated successfully!')
    //   navigate(`/base/POSTable2`) // Redirect after saving
    // } else {
    //   toast.error('Failed to update product.')
    // }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div>
      <Typography variant="h4">Edit Product</Typography>
      <form onSubmit={handleSubmit}>
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
        <TextField
          label="Product Name"
          name="product_name"
          value={product.product_name || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true, // Makes the field read-only
          }}
        />
        <TextField
          label="SKU"
          name="sku"
          value={product.sku || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true, // Makes the field read-only
          }}
        />
        <TextField
          label="Cost Price"
          name="cost_price"
          type="number"
          value={product.cost_price || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Selling Price"
          name="selling_price"
          type="number"
          value={product.selling_price || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Discount Price"
          name="discount_price"
          type="number"
          value={product.discount_price || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Wholesale Price"
          name="wholesale_price"
          type="number"
          value={product.wholesale_price || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Retail Price"
          name="retail_price"
          type="number"
          value={product.retail_price || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Token Price"
          name="token_price"
          type="number"
          value={product.token_price || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Save Changes
        </Button>
      </form>
      <Button
        variant="outlined"
        color="secondary"
        style={{ marginTop: '10px' }}
        onClick={() => navigate(`/base/POSTable2`)} // Use the outlet ID from the product
      >
        Cancel
      </Button>
    </div>
  )
}

export default ProductEdit
