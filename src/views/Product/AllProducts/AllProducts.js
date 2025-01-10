import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Barcode from 'react-barcode'
import { useNavigate, useParams, Link } from 'react-router-dom'
import './AllProducts.css'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Network, Urls } from '../../../api-config'

const Loader = () => (
  <div className="text-center my-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

const AllProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [productDetails, setProductDetails] = useState(null) // Store product details for modal
  const [isModalOpen, setIsModalOpen] = useState(false) // Modal state
  const navigate = useNavigate()
  const { outletId } = useParams()

  // Fetch all products
  const fetchProducts = async () => {
    // try {
    //   const response = await axios.get(
    //     `http://195.26.253.123/pos/products/show_product/${outletId}/`
    //   );
    //   setProducts(response.data);
    //   setLoading(false);
    // } catch (error) {
    //   console.error("Error fetching products:", error);
    //   setError("Failed to fetch products.");
    //   setLoading(false);
    // }
    // (Urls.addBrand)

    // const url = outletId
    //       ? `${Urls.fetchAllProducts}/${outletId}/`
    //       : Urls.addHeadCategory

    const response = await Network.get(`${Urls.fetchAllProducts}${outletId}/`)
    if (!response.ok) return console.log(response.data.error)
    setProducts(response.data)
    setLoading(false)
  }

  // Fetch product details for modal
  const fetchProductDetails = async (productId) => {
    // try {
    //   const response = await axios.get(
    //     `http://195.26.253.123/pos/products/shows_all_product_detail/${productId}/`,
    //   )
    //   setProductDetails(response.data)
    //   setIsModalOpen(true) // Open modal after fetching details
    // } catch (error) {
    //   console.error('Error fetching product details:', error)
    //   alert('Failed to fetch product details.')
    // }

    const response = await Network.get(`${Urls.ShowAllProductDetails}${productId}/`)
    if (!response.ok) return console.log(response.data.error)
    setProductDetails(response.data)
    setIsModalOpen(true) // Open modal after fetching details
  }

  useEffect(() => {
    fetchProducts()
  }, [outletId])

  const handleDelete = async (sku) => {
    if (window.confirm('Are you sure you want to delete this Product?')) {
      try {
        await axios.delete(`http://195.26.253.123/pos/products/action_product/${sku}/`)
        alert('Product deleted successfully!')
        fetchProducts() // Refresh products after deletion
      } catch (error) {
        console.error('Error deleting Product:', error)
        alert('Failed to delete Product.')
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/Product/ProductEdit/${id}`) // Navigate to AddProduct with product ID
  }

  const handleCloseModal = () => {
    setIsModalOpen(false) // Close modal
    setProductDetails(null) // Clear product details
  }

  return (
    <div>
      {loading && <Loader />}
      {error && <p className="text-danger">{error}</p>}
      <h2>ALL PRODUCTS</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Outlet</th>
            <th>Brand</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.product_name}</td>
              <td>{product.outlet}</td>
              <td>{product.brand}</td>
              <td>
                <Button
                  onClick={() => fetchProductDetails(product.id)}
                  variant="contained"
                  style={{ backgroundColor: '#1976d2', color: '#fff' }}
                >
                  Product Detail
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Product Details */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="lg">
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {productDetails ? (
            <div>
              <Typography variant="h6">Parent Information</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Outlet</TableCell>
                    <TableCell>Head Category</TableCell>
                    <TableCell>Parent Category</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Sub Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productDetails.header_array.map((header, index) => (
                    <TableRow key={index}>
                      <TableCell>{header.product_name}</TableCell>
                      <TableCell>{header.outlet}</TableCell>
                      <TableCell>{header.head_category}</TableCell>
                      <TableCell>{header.parent_category}</TableCell>
                      <TableCell>{header.category}</TableCell>
                      <TableCell>{header.sub_category || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Typography variant="h6" style={{ marginTop: '20px' }}>
                Detailed Information
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Cost Price</TableCell>
                    <TableCell>Selling Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productDetails.detail_array.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {/* SKU with Barcode */}
                        <Link to={`/pages/barcode/NewBarcode/${detail.sku}`}>
                          <Barcode
                            value={detail.sku}
                            format="CODE128"
                            width={1.2}
                            height={30}
                            displayValue={false}
                          />
                        </Link>
                        {detail.sku}
                      </TableCell>
                      <TableCell>{detail.description}</TableCell>
                      <TableCell>{detail.cost_price}</TableCell>
                      <TableCell>{detail.selling_price}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleEdit(detail.id)}
                          variant="contained"
                          style={{
                            marginRight: '8px',
                            backgroundColor: '#6ac267',
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(detail.id)}
                          variant="contained"
                          style={{ backgroundColor: '#ee4262' }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Loading product details...</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AllProducts
