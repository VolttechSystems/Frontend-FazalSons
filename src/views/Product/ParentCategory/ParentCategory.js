import React from 'react'
import {
    CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'; // Import Link here
import { DocsExample } from 'src/components'

const ParentCategory = () => {
  return (
    <CRow>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/AddParentCategory">
      <CButton href="#" color="primary" className="me-md-2">Add Parent Category</CButton>
      </Link>         
        </div>
      <CCol>
      
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Parent Category</strong> <small></small>
          </CCardHeader>
          <CCardBody>
            {/* <DocsExample href="components/table#table-foot"> */}
              <CTable>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Parent Category</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status | Action</CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">  </CTableHeaderCell>
                    <CTableDataCell colSpan={2}>  </CTableDataCell>
                    <CTableDataCell>  </CTableDataCell>
                    <CTableDataCell>  </CTableDataCell>
                    <CTableDataCell>  </CTableDataCell>
                  
                    
                  </CTableRow>
               
                  <CTableRow>
                  
                  <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Parent Category</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status | Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                
              </CTable>
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
      </CRow>
    )
}

export default ParentCategory
