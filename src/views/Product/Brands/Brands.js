import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Loader = () => {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

const Brands = () => {
  const [brands, setBrands] = useState([])
  const [originalBrands, setOriginalBrands] = useState([]) // Store original brands data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 5 // Number of items to display per page
  const [searchInput, setSearchInput] = useState('') // State for search input
  const navigate = useNavigate()

  useEffect(() => {
    fetchBrands()
  }, [currentPage])

  const fetchBrands = async () => {
    // try {
    //   const response = await axios.get(
    //     `http://195.26.253.123/pos/products/add_brand?page=${currentPage}&limit=${itemsPerPage}`,
    //   )
    //   const brandsData = response.data.results || []
    //   setBrands(Array.isArray(brandsData) ? brandsData : [])
    //   setOriginalBrands(Array.isArray(brandsData) ? brandsData : []) // Save original data
    //   setTotalCount(response.data.count) // Total number of brands for pagination
    //   setLoading(false)
    // } catch (error) {
    //   console.error('Error fetching brands:', error)
    //   setError('Failed to fetch brands.')
    //   setLoading(false)
    // }

    const response = await Network.get(`${Urls.addBrand}?page=${currentPage}&limit=${itemsPerPage}`)
    if (!response.ok) return console.log(response.data.error)
    const brandsData = response.data.results || []
    setBrands(Array.isArray(brandsData) ? brandsData : [])
    setOriginalBrands(Array.isArray(brandsData) ? brandsData : []) // Save original data
    setTotalCount(response.data.count) // Total number of brands for pagination
    setLoading(false)
  }

  const handleDelete = async (id) => {
    // if (window.confirm('Are you sure you want to delete this brand?')) {
    //   try {
    //     await axios.delete(`http://195.26.253.123/pos/products/action_brand/${id}/`)
    //     alert('Brand deleted successfully!')
    //     fetchBrands() // Refresh the brands list after deletion
    //   } catch (error) {
    //     console.error('Error deleting brand:', error)
    //     alert('Failed to delete brand.')
    //   }
    // }
    const response = await Network.delete(`${Urls.updateBrand}/${id}/`)
    if (!response.ok) return console.log(response.data.error)
    toast.success('Brand deleted successfully!')
    fetchBrands() // Refresh the brands list after deletion
  }

  const handleEdit = (id) => {
    console.log('Editing brand with ID:', id)
    navigate(`/Product/AddBrands/${id}`)
    toast.success('Brand updated successfully!')
  }

  // Handle search
  const handleSearch = () => {
    if (searchInput.trim() === '') {
      setBrands(originalBrands) // Reset to original brands if input is empty
    } else {
      const filteredBrands = originalBrands.filter((brand) =>
        brand.brand_name.toLowerCase().includes(searchInput.toLowerCase()),
      )
      setBrands(filteredBrands) // Update brands to only include searched items
    }
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage) // Calculate total pages

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/AddBrands">
          <CButton color="primary" className="me-md-2">
            Add Brand
          </CButton>
        </Link>
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
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} // Update search input state
          />
          <CButton color="secondary" onClick={handleSearch}>
            Search
          </CButton>{' '}
          {/* Search button */}
        </div>
      </div>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Brands</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <Loader />}
            {loading && <p>Loading brands...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <>
                <CTable>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell>Sr.#</CTableHeaderCell>
                      <CTableHeaderCell>Brand Name</CTableHeaderCell>
                      <CTableHeaderCell>Symbol</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {brands.map((brand, index) => (
                      <CTableRow key={brand.id}>
                        <CTableDataCell>
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </CTableDataCell>
                        <CTableDataCell>{brand.brand_name}</CTableDataCell>
                        <CTableDataCell>{brand.symbol}</CTableDataCell>
                        <CTableDataCell>{brand.description}</CTableDataCell>
                        <CTableDataCell>{brand.status}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="warning" size="sm" onClick={() => handleEdit(brand.id)}>
                            Edit
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(brand.id)}
                            className="ms-2"
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                <div className="d-flex justify-content-end mt-3">
                  <CButton
                    color="secondary"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="me-2"
                  >
                    Previous
                  </CButton>
                  <CButton
                    color="secondary"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </CButton>
                </div>
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Brands
