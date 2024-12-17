import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const POSTable = () => {
  const [outlets, setOutlets] = useState([]); // State to store outlets data
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    // Fetch outlets data from the API
    const fetchOutlets = async () => {
      try {
        const response = await axios.get('http://195.26.253.123/pos/products/fetch_all_outlet/');
        setOutlets(response.data); // Assuming the response data is an array of outlets
        setLoading(false);
      } catch (error) {
        console.error('Error fetching outlets:', error);
        setLoading(false);
      }
    };

    fetchOutlets();
  }, []);

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
                      <CTableDataCell>{outlet.system_name || `System - ${index + 1}`}</CTableDataCell>
                      <CTableDataCell>{outlet.outlet_name}</CTableDataCell>
                      <CTableDataCell>
                        <Link to={`/base/Transections/${outlet.id}`}>
                          <CButton color="primary">→</CButton>
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
  );
};

export default POSTable;
