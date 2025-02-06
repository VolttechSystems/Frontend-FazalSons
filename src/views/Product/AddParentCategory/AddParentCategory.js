import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
} from '@coreui/react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddParentCategory = () => {
  const [categoryHeads, setCategoryHeads] = useState([])
  const [hc_name, setCategoryHead] = useState('')
  const [pc_name, setPCname] = useState('')
  const [symbol, setShortForm] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('active')
  const [errorMessage, setErrorMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchCategoryHeads = async () => {
      const shopId = localStorage.getItem('shop_id')
      const response = await Network.get(`${Urls.addHeadCategory}${shopId}`)
      if (!response.ok) return consoe.log(response.data.error)
      setCategoryHeads(response.data.results)
    }

    const fetchParentCategoryDetails = async (page = 0) => {
      if (id) {
        const shopId = localStorage.getItem('shop_id')
        const starting = page // Map the page number to the Starting parameter
        const response = await Network.get(
          `${Urls.updateParentCategory}/${shopId}/${id}/?Starting=${starting}&limit=${pageSize}`,
        )
        if (!response.ok) return console.log(response.data.error)
        const data = response.data
        setCategoryHead(data.hc_name)
        setPCname(data.pc_name)
        setShortForm(data.symbol)
        setDescription(data.description)
        setStatus(data.status)
        setTotalPages(Math.ceil(data.total_count / pageSize)) // Compute total pages if not provided
      }
    }

    fetchCategoryHeads(currentPage)
    fetchParentCategoryDetails(currentPage)
  }, [id, currentPage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const shopId = localStorage.getItem('shop_id') // Retrieve shop_id from localStorag

    const ParentCategoryData = {
      hc_name: hc_name,
      pc_name: pc_name,
      symbol: symbol,
      description: description,
      status: status,
      shop: shopId,
    }

    console.log('ParentCategoryData:', ParentCategoryData)

    // Determine whether to use POST (add) or PUT (update)
    const url = id
      ? `${Urls.updateParentCategory}/${shopId}/${id}/`
      : `${Urls.addParentCategory}${shopId}`
    const req = id ? 'put' : 'post'

    try {
      // Make the API request
      const response = await Network[req](url, ParentCategoryData)

      // Check if the response is not okay
      if (!response.ok) {
        throw new Error(response.data.error || 'parent category with this pc name already exists')
      }

      // Show success toast message
      toast.success(
        id ? 'Parent Category updated successfully!' : 'Parent Category added successfully!',
      )

      // Redirect to the ParentCategory page
      navigate('/Product/ParentCategory')
    } catch (error) {
      console.error('Error:', error.message)

      // Display the error message using toast
      toast.error(error.message || 'An unexpected error occurred')
    }
  }

  const handleAddCategoryHead = () => {
    navigate('/Product/AddHeadCategory')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader className="text-center">
            <h4 className="mb-0 fw-bold">{id ? 'Edit Parent Category' : 'Add Parent Category'}</h4>

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
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/Product/ParentCategory">
                <CButton color="primary">Parent Category</CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                {/* Label Above */}
                <CFormLabel htmlFor="categoryHead">Category Head *</CFormLabel>

                {/* Input + Button in a single row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CFormSelect
                    id="categoryHead"
                    value={hc_name}
                    onChange={(e) => setCategoryHead(e.target.value)}
                    required
                    style={{ flex: 1 }} // Makes input take full space while keeping button aligned
                  >
                    <option value="">Select Category Head</option>
                    {categoryHeads.map((head) => (
                      <option key={head.id} value={head.id}>
                        {head.hc_name}
                      </option>
                    ))}
                  </CFormSelect>

                  {/* Aligned + Button */}
                  <CButton color="primary" onClick={handleAddCategoryHead}>
                    +
                  </CButton>
                </div>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="pc_name">Parent Category *</CFormLabel>
                <CFormInput
                  type="text"
                  id="pc_name"
                  value={pc_name}
                  onChange={(e) => setPCname(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="symbol">Short Form/Symbol</CFormLabel>
                <CFormInput
                  type="text"
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setShortForm(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormInput
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Status</CFormLabel>
                <div>
                  <CFormCheck
                    type="radio"
                    name="status"
                    id="status-active"
                    label="Active"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                  />
                  <CFormCheck
                    type="radio"
                    name="status"
                    id="status-inactive"
                    label="Inactive"
                    value="inactive"
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                  />
                  <CFormCheck
                    type="radio"
                    name="status"
                    id="status-pending"
                    label="Pending"
                    value="pending"
                    checked={status === 'pending'}
                    onChange={() => setStatus('pending')}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <CButton type="submit" color="primary">
                  {id ? 'Update Parent Category' : 'Add Parent Category'}
                </CButton>
                <Link to="/Product/ParentCategory" className="btn btn-secondary ms-2">
                  Cancel
                </Link>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddParentCategory
