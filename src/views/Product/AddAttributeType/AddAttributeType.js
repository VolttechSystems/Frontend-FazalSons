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
import { useNavigate } from 'react-router-dom'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddAttributeType = () => {
  const [attributeType, setAttributeType] = useState('')
  const [status, setStatus] = useState('active') // Default status
  const [types, setTypes] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [currentPage, setCurrentPage] = useState(0) // Pagination start from 0
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10) // Items per page
  const navigate = useNavigate()

  const shopId = localStorage.getItem('shop_id')

  if (!shopId) {
    toast.error('Shop ID not found in local storage.')
    return
  }

  // Function to fetch attribute types from the API
  const fetchAttributeTypes = async (page = 0) => {
    try {
      const response = await Network.get(
        `${Urls.addAttributeTypes}/${shopId}?Starting=${page}&limit=${pageSize}`,
      )
      if (response.ok && response.data) {
        setTypes(response.data.results)
        setTotalPages(Math.ceil(response.data.count / pageSize))
      } else {
        toast.error('Failed to fetch attribute types.')
      }
    } catch (error) {
      console.error('Error fetching attribute types:', error)
      toast.error('Error fetching attribute types.')
    }
  }

  // Function to handle form submission for adding/editing attribute types
  const handleSubmit = async (e) => {
    e.preventDefault()
    const requestData = { att_type: attributeType, status, shop: shopId }

    // Determine if editing or adding
    const isEditing = editingIndex !== null

    const url = isEditing
      ? `${Urls.updateAttributeType}/${shopId}/${types[editingIndex].id}`
      : `${Urls.addAttributeTypes}/${shopId}`

    const req = isEditing ? 'put' : 'post'

    try {
      // Make the API call
      const response = await Network[req](url, requestData)

      // Handle API response errors
      if (response.ok && response.data) {
        toast.success(
          isEditing ? 'Attribute Type updated successfully!' : 'Attribute Type added successfully!',
        )

        if (isEditing) {
          setTypes((prev) =>
            prev.map((item, index) =>
              index === editingIndex ? { ...item, ...response.data } : item,
            ),
          )
        } else {
          setTypes((prev) => [response.data, ...prev]) // Add new type to the top of the list
        }

        // Reset form fields
        setAttributeType('')
        setStatus('active') // Reset to default status
        setEditingIndex(null) // Reset editing index
      } else {
        toast.error(response.data?.error || 'An unexpected error occurred.')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred.')
    }
  }

  // Function to handle edit button click
  const handleEdit = (index) => {
    const selectedType = types[index]
    setAttributeType(selectedType.att_type)
    setStatus(selectedType.status)
    setEditingIndex(index)
  }

  // Function to handle delete button click
  const handleDelete = async (index) => {
    const id = types[index].id // Assuming each type has a unique `id`

    try {
      const response = await Network.delete(`${Urls.updateAttributeType}/${shopId}/${id}`)
      if (response.ok) {
        toast.success('Attribute Type deleted successfully!')
        fetchAttributeTypes(currentPage)
      } else {
        toast.error('Failed to delete attribute type.')
      }
    } catch (error) {
      console.error('Error deleting attribute type:', error)
      toast.error('Error deleting attribute type.')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
      fetchAttributeTypes(page)
    }
  }

  useEffect(() => {
    fetchAttributeTypes(currentPage) // Fetch attribute types when component mounts
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>{editingIndex !== null ? 'Edit Attribute Type' : 'Add Attribute Type'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <ToastContainer />
              <CRow className="mb-3">
                <CFormLabel htmlFor="attributeType" className="col-sm-2 col-form-label">
                  Attribute Type
                </CFormLabel>
                <CCol sm={8}>
                  <CFormInput
                    type="text"
                    id="attributeType"
                    value={attributeType}
                    onChange={(e) => setAttributeType(e.target.value)}
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
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  {editingIndex !== null ? 'Update' : 'Add'}
                </CButton>
                <CButton color="secondary" onClick={() => navigate('/Product/AddAtt')}>
                  Go to Attributes
                </CButton>
              </div>
            </CForm>

            <CTable className="mt-3">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Attribute Type</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {types.map((item, index) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.att_type}</CTableDataCell>
                    <CTableDataCell>{item.status}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="warning"
                        size="sm" // Makes the button smaller
                        style={{ marginRight: '5px' }} // Adds space between the buttons
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm" // Makes the button smaller
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Pagination */}
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

export default AddAttributeType
