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

const Brands = () => {
  return (
    <CRow>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/AddBrands">
      <CButton href="#" color="primary" className="me-md-2">Add Brand</CButton>
      </Link>         
        </div>
      <CCol>
      
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Brands</strong> <small></small>
          </CCardHeader>
          <CCardBody>
            {/* <DocsExample href="components/table#table-foot"> */}
              <CTable>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Proposal No.</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Proposal Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Client</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Power Company</CTableHeaderCell>
                    <CTableHeaderCell scope="col">View | DL</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">  </CTableHeaderCell>
                    <CTableDataCell colSpan={2}>  </CTableDataCell>
                    <CTableDataCell>  </CTableDataCell>
                    <CTableDataCell>  </CTableDataCell>
                    <CTableDataCell>  </CTableDataCell>
                    <CTableDataCell>  </CTableDataCell>
                    <CTableDataCell>  </CTableDataCell>
                    
                  </CTableRow>
               
                  <CTableRow>
                  
                  <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Proposal No.</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Proposal Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Client</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Power Company</CTableHeaderCell>
                    <CTableHeaderCell scope="col">View | DL</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
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

export default Brands
