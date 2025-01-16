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
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ParentCategory = () => {
  const [pc, setParentcategory] = useState([])
  const [hc, setHeadcategory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchParentcategory = async () => {
      // try {
      //   const response = await axios.get('http://195.26.253.123/pos/products/add_parent_category')
      //   setParentcategory(response.data)
      // } catch (error) {
      //   console.error('Error fetching parent categories:', error)
      //   setError('Failed to fetch parent categories.')
      // }

      const response = await Network.get(Urls.addParentCategory)
      if (!response.ok) return consoe.log(response.data.error)
      setParentcategory(response.data)
    }

    const fetchHeadcategory = async () => {
      // try {
      //   const response = await axios.get('http://195.26.253.123/pos/products/add_head_category') // Adjust to your actual API endpoint
      //   setHeadcategory(response.data)
      // } catch (error) {
      //   console.error('Error fetching head categories:', error)
      //   setError('Failed to fetch head categories.')
      // }
      const response = await Network.get(Urls.addHeadCategory)
      if (!response.ok) return consoe.log(response.data.error)
      setHeadcategory(response.data)
    }

    const fetchData = async () => {
      await Promise.all([fetchParentcategory(), fetchHeadcategory()])
      setLoading(false) // Set loading to false after both fetches
    }

    fetchData()
  }, [])

  const getCategoryHead = (categoryHeadName) => {
    const headcat = hc.find((attr) => attr.hc_name_id === categoryHeadName)
    return headcat ? headcat.hc_name : 'Category Head not found'
  }
  const handleDelete = async (id) => {
    try {
      const response = await Network.delete(`${Urls.updateParentCategory}/${id}/`)
      if (!response.ok) {
        console.log(response.data.error)
        toast.error('Failed to delete Parent Category.')
        return
      }

      toast.success('Parent Category deleted successfully!')

      // Update the state to remove the deleted category
      setParentcategory((prev) => prev.filter((parent) => parent.id !== id))
    } catch (error) {
      console.error('Error deleting Parent Category:', error)
      toast.error('Failed to delete Parent Category.')
    }
  }

  const handleEdit = (id) => {
    console.log('Editing Parent Category with ID:', id)
    navigate(`/Product/AddParentCategory/${id}`)
    toast.success('Parent Category updated successfully!')
  }

  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/AddParentCategory">
          <CButton color="primary" className="me-md-2">
            Add Parent Category
          </CButton>
        </Link>
      </div>
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
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>All Parent Categories</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <p>Loading parent category...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <CTable striped>
                <thead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.#</CTableHeaderCell>
                    <CTableHeaderCell>Category Head</CTableHeaderCell>
                    <CTableHeaderCell>Parent Category</CTableHeaderCell>
                    <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </thead>
                <CTableBody>
                  {pc.map((parent, index) => (
                    <CTableRow key={parent.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{parent.hc_name}</CTableDataCell>
                      <CTableDataCell>{parent.pc_name}</CTableDataCell>
                      <CTableDataCell>{parent.symbol}</CTableDataCell>
                      <CTableDataCell>{parent.description}</CTableDataCell>
                      <CTableDataCell>{parent.status}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="warning" size="sm" onClick={() => handleEdit(parent.id)}>
                          Edit
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(parent.id)}
                          className="ms-2"
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ParentCategory
