// import React from 'react'
// import {
//     CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableCaption,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from '@coreui/react'
// import { Link } from 'react-router-dom'; // Import Link here
// import { DocsExample } from 'src/components'

// const Attributes = () => {
//   return (
//     <CRow>
//         <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//         <Link to="/Product/AddAttributes">
//       <CButton href="#" color="primary" className="me-md-2">Add Attributes</CButton>
//       </Link>         
//         </div>
//       <CCol>
      
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>Attributes</strong> <small></small>
//           </CCardHeader>
//           <CCardBody>
//             {/* <DocsExample href="components/table#table-foot"> */}
//               <CTable>
//                 <CTableHead color="light">
//                   <CTableRow>
//                     <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Proposal No.</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Proposal Name</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Client</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Power Company</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">View | DL</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                   </CTableRow>
//                   <CTableRow>
//                     <CTableHeaderCell scope="row">  </CTableHeaderCell>
//                     <CTableDataCell colSpan={2}>  </CTableDataCell>
//                     <CTableDataCell>  </CTableDataCell>
//                     <CTableDataCell>  </CTableDataCell>
//                     <CTableDataCell>  </CTableDataCell>
//                     <CTableDataCell>  </CTableDataCell>
                    
//                   </CTableRow>
               
//                   <CTableRow>
                  
//                   <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Proposal No.</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Proposal Name</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Client</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Power Company</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">View | DL</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
                
//               </CTable>
//             {/* </DocsExample> */}
//           </CCardBody>
//         </CCard>
//       </CCol>
//       </CRow>
//     )
// }

// export default Attributes
import React, { useEffect, useState } from 'react';
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
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Attributes = () => {
  const [attributes, setAttributes] = useState([]); // State to store attributes data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(''); // State for error messages

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_attribute'); // Replace with your API endpoint
        setAttributes(response.data); // Assuming the response contains the list of attributes
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attributes:', error);
        setError('Failed to fetch attributes.');
        setLoading(false);
      }
    };

    fetchAttributes();
  }, []);

  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/AddAttributes">
          <CButton color="primary" className="me-md-2">Add Attribute</CButton>
        </Link>
      </div>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Attributes</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <p>Loading attributes...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <CTable>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Attribute Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Attribute</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Short Form/Symbol</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {attributes.map((attribute, index) => (
                    <CTableRow key={attribute.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{attribute.type}</CTableDataCell> {/* Example: 'Color' or 'Size' */}
                      <CTableDataCell>{attribute.attribute_name}</CTableDataCell> {/* Attribute name */}
                      <CTableDataCell>{attribute.symbol}</CTableDataCell> {/* Short form or symbol */}
                      <CTableDataCell>{attribute.description}</CTableDataCell> {/* Description */}
                      <CTableDataCell>{attribute.status}</CTableDataCell> {/* Status: 'Active', 'Pending', 'Inactive' */}
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

export default Attributes;
