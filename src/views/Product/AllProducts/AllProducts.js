import React from 'react'
import {
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
import { DocsExample } from 'src/components'

const AllProducts = () => {
  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Products</strong> <small></small>
          </CCardHeader>
          <CCardBody>
            {/* <DocsExample href="components/table#table-foot"> */}
              <CTable>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Product SKU</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Qty.</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cost</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Parent Category</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
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

export default AllProducts
