import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell, CButton } from '@coreui/react'
import { Link } from 'react-router-dom'

const POSTable = () => {
  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Register Systems</strong> <small></small>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Registered Systems</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Outlet</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell scope="row">1</CTableHeaderCell>
                  <CTableDataCell>FS - Till 01</CTableDataCell>
                  <CTableDataCell>Fazal Sons</CTableDataCell>
                  <CTableDataCell>
                  <Link to="/base/Transections">
                      <CButton color="primary">→</CButton>
                    </Link>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">2</CTableHeaderCell>
                  <CTableDataCell>YR - Till 01</CTableDataCell>
                  <CTableDataCell>YR Fashion</CTableDataCell>
                  <CTableDataCell>
                  <Link to="/base/Transections">
                      <CButton color="primary">→</CButton>
                    </Link>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">3</CTableHeaderCell>
                  <CTableDataCell>MG Till - 01</CTableDataCell>
                  <CTableDataCell>Musharaf Garments</CTableDataCell>
                  <CTableDataCell>
                    <Link to="/base/Transections">
                      <CButton color="primary">→</CButton>
                    </Link>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default POSTable
