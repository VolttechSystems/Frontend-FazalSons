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
          const response = await axios.get(`http://195.26.253.123/pos/products/action_brand/${id}/`)
          const brand = response.data
          setBrandName(brand.brand_name)
          setSymbol(brand.symbol)
          setDescription(brand.description)
          setStatus(brand.status)
        } catch (error) {
          console.error('Failed to fetch brand for editing:', error)
          setErrorMessage('Failed to load brand details.')
        }
      }
      fetchBrandDetails()
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const brandData = {
      brand_name: brandName,
      symbol: symbol,
      description: description,
      status: status,
    }

    const url = id ? `${Urls.updateBrand}/${id}` : Urls.addBrand
    const req = id ? 'put' : 'post'

    const response = await Network[req](url, brandData)
    if (!response.ok) return consoe.log(response.data.error)
    alert(id ? 'Brand updated successfully!' : 'Brand added successfully!')
    navigate('/Product/Brands')
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>{id ? 'Edit Brand' : 'Add Brand'}</strong>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <Link to="/Product/Brands">
            <CButton color="primary">Brands</CButton>
          </Link>
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
