import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
  CTableDataCell,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddHeadCategory = () => {
  const [hc_name, setHCname] = useState('')
  const [status, setStatus] = useState('active')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [types, setTypes] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)
  const navigate = useNavigate()

  const fetchHeadCategory = async (page = 0) => {
    const shopId = localStorage.getItem('shop_id')
    const starting = page // Map the page number to the Starting parameter
    const response = await Network.get(
      `${Urls.addHeadCategory}${shopId}?Starting=${starting}&limit=${pageSize}`,
    )

    if (!response.ok) return consoe.log(response.data.error)
    setTypes(response.data.results)
    setTotalPages(Math.ceil(data.total_count / pageSize)) // Compute total pages if not provided
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const shopId = localStorage.getItem('shop_id') // Retrieve shop_id from localStorag
    const requestData = { hc_name: hc_name, symbol, description, status, shop: shopId }

    // Determine if editing or adding
    const isEditing = editingIndex !== null

    const url = isEditing
      ? `${Urls.updateHeadCategory}/${shopId}/${types[editingIndex].id}`
      : `${Urls.addHeadCategory}${shopId}`

    const req = isEditing ? 'put' : 'post'

    try {
      // Make the API call
      const response = await Network[req](url, requestData)

      // Handle API response errors
      if (!response.ok) {
        throw new Error(response.data.error || 'Head Category with this name already exists!')
      }

      // Display success toast message
      toast.success(
        isEditing ? 'Head Category updated successfully!' : 'Head Category added successfully!',
      )

      // Reset form and state
      setEditingIndex(null)
      setHCname('')
      setStatus('active')
      setSymbol('')
      setDescription('')

      // Refresh the HeadCategory list
      fetchHeadCategory(currentPage)
    } catch (error) {
      console.error('Error:', error.message)

      // Display error message using toast
      toast.error(error.message || 'An unexpected error occurred')
    }
  }

  // Function to handle edit button click
  const handleEdit = (index) => {
    const selectedType = types[index]

    setHCname(selectedType.hc_name)
    setStatus(selectedType.status)
    setSymbol(selectedType.symbol)
    setDescription(selectedType.description)
    setEditingIndex(index)
  }

  const handlePageChange = (page) => {
    if (page >= 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Function to handle delete button click
  const handleDelete = async (index) => {
    const shopId = localStorage.getItem('shop_id')
    const id = types[index].id // Assuming each type has a unique `id`
    if (!shopId) {
      console.error('Shop ID is missing in localStorage.')
      return
    }

    try {
      const response = await Network.delete(`${Urls.updateHeadCategory}/${shopId}/${id}`)
      if (!response.ok) {
        console.error('Error deleting Head Category:', response.data.error)
        return toast.error('Failed to delete Head Category.')
      }

      toast.success('Head Category deleted successfully!')
      fetchHeadCategory(currentPage)
    } catch (error) {
      console.error('Error deleting Head Category:', error)
    }
  }

  useEffect(() => {
    fetchHeadCategory(currentPage)
  }, [currentPage])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>{editingIndex !== null ? 'Edit category head' : 'Add category head'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
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
              <CRow className="mb-3">
                <CFormLabel htmlFor="hc_name" className="col-sm-2 col-form-label">
                  Head Category Name
                </CFormLabel>
                <CCol sm={8}>
                  <CFormInput
                    type="text"
                    id="hc_name"
                    value={hc_name || ''}
                    onChange={(e) => setHCname(e.target.value)}
                    required
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
              <CRow className="mb-3">
                <CFormLabel htmlFor="symbol" className="col-sm-2 col-form-label">
                  Symbol
                </CFormLabel>
                <CCol sm={8}>
                  <CFormInput
                    type="text"
                    id="symbol"
                    value={symbol || ''}
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
                    value={description || ''}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </CCol>
              </CRow>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  {editingIndex !== null ? 'Update' : 'Add'}
                </CButton>
                <CButton color="secondary" onClick={() => navigate('/Product/AddParentCategory')}>
                  Go to Add Parent Category
                </CButton>
              </div>
            </CForm>

            <CTable className="mt-3">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Head Category Name</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {types.map((item, index) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.hc_name}</CTableDataCell>
                    <CTableDataCell>{item.status}</CTableDataCell>
                    <CTableDataCell>{item.symbol}</CTableDataCell>
                    <CTableDataCell>{item.description}</CTableDataCell>

                    <CTableDataCell>
                      <CButton color="warning" onClick={() => handleEdit(index)}>
                        Edit
                      </CButton>
                      <CButton color="danger" onClick={() => handleDelete(index)}>
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <div
              className="pagination"
              style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}
            >
              <button
                style={{
                  padding: '5px 8px',
                  marginRight: '5px',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <button
                style={{
                  padding: '5px 8px',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddHeadCategory
