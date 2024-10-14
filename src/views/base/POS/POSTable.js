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

const POSTable = () => {
  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Register Systems</strong> <small></small>
          </CCardHeader>
          <CCardBody>
            {/* <DocsExample href="components/table#table-foot"> */}
              <CTable>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Registerd Systems</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Outlet</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>Otto</CTableDataCell>
                    <CTableDataCell>@mdo</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">2</CTableHeaderCell>
                    <CTableDataCell>Jacob</CTableDataCell>
                    <CTableDataCell>Thornton</CTableDataCell>
                    <CTableDataCell>@fat</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">3</CTableHeaderCell>
                    <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                    <CTableDataCell>@twitter</CTableDataCell>
                  </CTableRow>
                </CTableBody>
                <CTableHead>
                  <CTableRow>
                  <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Registerd Systems</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Outlet</CTableHeaderCell>
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

export default POSTable
