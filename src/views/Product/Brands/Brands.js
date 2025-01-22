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
  const shopId = localStorage.getItem('shop_id') // Get shop_id from local storage

  useEffect(() => {
    fetchBrands()
  }, [currentPage])

  const fetchBrands = async () => {
    try {
      if (!shopId) {
        setError('Shop ID is missing. Please log in again.')
        setLoading(false)
        return
      }

      // Adjusted URL to include shop_id in the path
      const response = await Network.get(
        `${Urls.addBrand}/${shopId}/?page=${currentPage}&limit=${itemsPerPage}`,
      )

      if (response.status === 200) {
        const brandsData = response.data.results || []
        setBrands(Array.isArray(brandsData) ? brandsData : [])
        setOriginalBrands(Array.isArray(brandsData) ? brandsData : []) // Save original data
        setTotalCount(response.data.count) // Total number of brands for pagination
      } else {
        setError('Failed to fetch brands.')
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      setError('An error occurred while fetching brands.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      if (!shopId) {
        toast.error('Shop ID is missing. Please log in again.')
        return
      }

      const response = await Network.delete(`${Urls.updateBrand}/${shopId}/${id}/`)
      if (response.status === 204) {
        toast.success('Brand deleted successfully!')
        fetchBrands()
      } else {
        toast.error('Failed to delete brand.')
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
      toast.error('An error occurred while deleting the brand.')
    }
  }

  const handleEdit = (id) => {
    if (!shopId) {
      toast.error('Shop ID is missing. Please log in again.')
      return
    }
    navigate(`/Product/AddBrands/${id}`)
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
