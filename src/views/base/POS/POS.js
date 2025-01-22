import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'

const POS = () => {
  const [outlets, setOutlets] = useState([]) // State to store outlets data
  const [loading, setLoading] = useState(true) // State for loading indicator

  const { userOutlets } = useAuth()

  useEffect(() => {
    // Fetch outlets data from the API

    fetchOutlets()
  }, [])

  const fetchOutlets = async () => {
    setLoading(true)
    const shopId = localStorage.getItem('shop_id') // Get shop_id from local storage
    const response = await Network.get(`${Urls.fetchAllOutlets}${shopId}/`)
    setLoading(false)
    if (!response.ok) {
      return console.error('Failed to fetch outlets:', response.data.error)
    }

    const outlets = response.data
      .map((outlet) => {
        if (userOutlets.some((o) => o.id === outlet.id)) {
          return outlet
        }
        return null
      })
      .filter((outlet) => outlet !== null)

    setOutlets(outlets) // Assuming the response data is an array of outlets
  }

  console.log({ userOutlets })

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Register Systems</strong>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <p>Loading...</p> // Loading indicator
            ) : (
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
                  {outlets.map((outlet, index) => (
                    <CTableRow key={outlet.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>
                        {outlet.system_name || `System - ${index + 1}`}
                      </CTableDataCell>
                      <CTableDataCell>{outlet.outlet_name}</CTableDataCell>
                      <CTableDataCell>
                        <Link to={`/base/Transections/${outlet.id}`}>
                          <CButton
                            style={{ backgroundColor: '#007bff', color: 'white', border: 'none' }}
                          >
                            →
                          </CButton>
                        </Link>
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

export default POS
