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

const AddAttributeType = () => {
  const [attributeType, setAttributeType] = useState('')
  const [status, setStatus] = useState('active') // Default status
  const [types, setTypes] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const navigate = useNavigate()

  // Function to fetch attribute types from the API
  const fetchAttributeTypes = async () => {
    // try {
    //   const response = await axios.get('http://195.26.253.123/pos/products/add_attribute_type');
    //   setTypes(response.data); // Assuming the response data is an array of attribute types
    // } catch (error) {
    //   console.error('Error fetching attribute types:', error);
    // }
    const response = await Network.get(Urls.addAttributeTypes)
    if (!response.ok) return consoe.log(response.data.error)
    setTypes(response.data)
  }

  // Function to handle form submission for adding/editing attribute types
  const handleSubmit = async (e) => {
    e.preventDefault()
    const requestData = { att_type: attributeType, status }

    // try {
    //   if (editingIndex !== null) {
    //     // Edit existing attribute type
    //     await axios.put(
    //       `http://195.26.253.123/pos/products/action_attribute_type/${types[editingIndex].id}/`,
    //       requestData,
    //     )
    //     setEditingIndex(null) // Reset editing index
    //   } else {
    //     // Add new attribute type
    //     await axios.post('http://195.26.253.123/pos/products/add_attribute_type', requestData)
    //   }
    //   // Reset the form
    //   setAttributeType('')
    //   setStatus('active') // Reset to default status
    //   fetchAttributeTypes() // Refetch attribute types after submission
    // } catch (error) {
    //   console.error('Error adding/editing attribute type:', error)
    // }

    // Determine if editing or adding
    const isEditing = editingIndex !== null

    const url = isEditing
      ? `${Urls.updateAttributeType}/${types[editingIndex].id}/`
      : Urls.addAttributeTypes

    const req = isEditing ? 'put' : 'post'

    try {
      // Make the API call
      const response = await Network[req](url, requestData)

      // Handle API response errors
      if (!response.ok) {
        throw new Error(response.data.error || 'Attribute Type with this name already exists!')
      }

      // Display success toast message
      toast.success(
        isEditing ? 'Attribute Type updated successfully!' : 'Attribute Type added successfully!',
      )

      // Reset form fields
      setAttributeType('')
      setStatus('active') // Reset to default status
      setEditingIndex(null) // Reset editing index

      // Refresh the attribute types list
      fetchAttributeTypes()
    } catch (error) {
      console.error('Error:', error.message)

      // Display error message using toast
      toast.error(error.message || 'An unexpected error occurred')
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
    // try {
    //   await axios.delete(`http://195.26.253.123/pos/products/action_attribute_type/${id}/`)
    //   fetchAttributeTypes() // Refetch attribute types after deletion
    // } catch (error) {
    //   console.error('Error deleting attribute type:', error)
    // }

    const response = await Network.delete(`${Urls.updateAttributeType}/${id}/`)
    if (!response.ok) return console.log(response.data.error)
    toast.success('Attribute Type deleted successfully!')
    fetchAttributeTypes()
  }

  useEffect(() => {
    fetchAttributeTypes() // Fetch attribute types when component mounts
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddAttributeType
