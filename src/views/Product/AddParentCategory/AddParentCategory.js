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

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchCategoryHeads = async () => {
      const response = await Network.get(Urls.addHeadCategory)
      if (!response.ok) return consoe.log(response.data.error)
      setCategoryHeads(response.data)

      // try {
      //   const response = await axios.get('http://195.26.253.123/pos/products/add_head_category');
      //   setCategoryHeads(response.data);
      // } catch (error) {
      //   console.error('Error fetching category heads:', error);
      //   setErrorMessage('Failed to fetch category heads.');
      // }
    }

    const fetchParentCategoryDetails = async () => {
      // try {
      //   const response = await axios.get(
      //     `http://195.26.253.123/pos/products/action_parent_category/${id}/`,
      //   )
      //   const data = response.data
      //   setCategoryHead(data.hc_name)
      //   setPCname(data.pc_name)
      //   setShortForm(data.symbol)
      //   setDescription(data.description)
      //   setStatus(data.status)
      // } catch (error) {
      //   console.error('Error fetching parent category details:', error)
      //   setErrorMessage('Failed to fetch category details.')
      // }

      if (id) {
        const response = await Network.get(`${Urls.updateParentCategory}/${id}/`)
        if (!response.ok) return console.log(response.data.error)
        const data = response.data
        setCategoryHead(data.hc_name)
        setPCname(data.pc_name)
        setShortForm(data.symbol)
        setDescription(data.description)
        setStatus(data.status)
      }
    }

    fetchCategoryHeads()
    fetchParentCategoryDetails()
  }, [id])

  const handleSubmit = async (e) => {
    // try {
    //   if (id) {
    //     await axios.put(
    //       `http://195.26.253.123/pos/products/action_parent_category/${id}/`,
    //       ParentCategoryData,
    //     )
    //     alert('Parent Category updated successfully!')
    //   } else {
    //     await axios.post(
    //       'http://195.26.253.123/pos/products/add_parent_category',
    //       ParentCategoryData,
    //     )
    //     alert('Parent Category added successfully!')
    //   }

    //   navigate('/Product/ParentCategory')
    // } catch (error) {
    //   console.error('There was an error saving the Parent Category!', error)
    //   setErrorMessage('Error saving Parent Category. Please try again.')
    // }

    e.preventDefault()

    const ParentCategoryData = {
      hc_name: hc_name,
      pc_name: pc_name,
      symbol: symbol,
      description: description,
      status: status,
    }

    console.log('ParentCategoryData:', ParentCategoryData)

    // Determine whether to use POST (add) or PUT (update)
    const url = id ? `${Urls.updateParentCategory}/${id}/` : Urls.addParentCategory
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
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{id ? 'Edit Parent Category' : 'Add Parent Category'}</strong>
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
                <CFormLabel htmlFor="categoryHead">Category Head *</CFormLabel>
                <CFormSelect
                  id="categoryHead"
                  value={hc_name}
                  onChange={(e) => setCategoryHead(e.target.value)}
                  required
                >
                  <option value="">Select Category Head</option>
                  {categoryHeads.map((head) => (
                    <option key={head.id} value={head.id}>
                      {head.hc_name}
                    </option>
                  ))}
                </CFormSelect>
                <CButton color="primary" onClick={handleAddCategoryHead} className="ms-2">
                  {' '}
                  +{' '}
                </CButton>
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
              <CButton type="submit" color="primary">
                {id ? 'Update Parent Category' : 'Add Parent Category'}
              </CButton>
              <Link to="/Product/ParentCategory" className="btn btn-secondary ms-2">
                Cancel
              </Link>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddParentCategory
