import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddBrands = () => {
  const [brandName, setBrandName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('active') // Default status
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { id } = useParams() // Get the brand ID from the URL

  useEffect(() => {
    // Fetch brand details for editing
    if (id) {
      const fetchBrandDetails = async () => {
        try {
          const shopId = localStorage.getItem('shop_id') // Get shop_id from local storage

          if (!shopId) {
            toast.error('Shop ID is missing. Please log in again.')
            return
          }

          // Adjusted URL to include shop_id
          const response = await Network.get(`${Urls.updateBrand}/${shopId}/${id}/`)

          if (response.status === 200) {
            const brand = response.data
            setBrandName(brand.brand_name)
            setSymbol(brand.symbol)
            setDescription(brand.description)
            setStatus(brand.status)
          } else {
            toast.error('Failed to fetch brand details.')
          }
        } catch (error) {
          console.error('Error fetching brand details:', error)
          toast.error('An error occurred while fetching brand details.')
        }
      }
      fetchBrandDetails()
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Get shop_id from local storage
    const shopId = localStorage.getItem('shop_id')

    if (!shopId) {
      toast.error('Shop ID is missing. Please log in again.')
      return
    }

    const brandData = {
      brand_name: brandName,
      symbol: symbol,
      description: description,
      status: status,
      shop: parseInt(shopId), // Include shop_id in the payload
    }

    const url = id ? `${Urls.updateBrand}/${shopId}/${id}/` : `${Urls.addBrand}/${shopId}/`
    const req = id ? 'put' : 'post'

    try {
      const response = await Network[req](url, brandData)

      if (!response.ok) {
        // Handle and display backend errors
        const errorData = response.data
        if (errorData) {
          Object.keys(errorData).forEach((key) => {
            const errorMessages = errorData[key]
            if (Array.isArray(errorMessages)) {
              errorMessages.forEach((message) => {
                toast.error(`${key}: ${message}`)
              })
            } else {
              toast.error(`${key}: ${errorMessages}`)
            }
          })
        } else {
          toast.error('Failed to process the request. Please check your input.')
        }
        return
      }

      // Success case
      toast.success(id ? 'Brand updated successfully!' : 'Brand added successfully!')
      navigate('/Product/Brands')
    } catch (error) {
      console.error('Error processing the request:', error)
      toast.error('An error occurred while processing the request.')
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>{id ? 'Edit Brand' : 'Add Brand'}</strong>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <Link to="/Product/Brands">
            <CButton color="primary">Brands</CButton>
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
        </div>
      </CCardHeader>
      <CCardBody>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CFormLabel htmlFor="brandName" className="col-sm-2 col-form-label">
              Brand *
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="symbol" className="col-sm-2 col-form-label">
              Short Form/Symbol
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="description" className="col-sm-2 col-form-label">
              Description
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CCol>
          </CRow>
          <fieldset className="row mb-3">
            <legend className="col-form-label col-sm-2 pt-0">Status</legend>
            <CCol sm={8}>
              <CFormCheck
                type="radio"
                name="status"
                id="active"
                value="active"
                label="Active"
                checked={status === 'active'}
                onChange={(e) => setStatus(e.target.value)}
              />
              <CFormCheck
                type="radio"
                name="status"
                id="inactive"
                value="inactive"
                label="Inactive"
                checked={status === 'inactive'}
                onChange={(e) => setStatus(e.target.value)}
              />
              <CFormCheck
                type="radio"
                name="status"
                id="pending"
                value="pending"
                label="Pending"
                checked={status === 'pending'}
                onChange={(e) => setStatus(e.target.value)}
              />
            </CCol>
          </fieldset>
          <CButton type="submit" color="primary">
            {id ? 'Update Brand' : 'Add Brand'}
          </CButton>
        </form>
      </CCardBody>
    </CCard>
  )
}

export default AddBrands
