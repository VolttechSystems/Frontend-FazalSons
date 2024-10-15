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

const ParentCategory = () => {
  const [pc, setParentcategory] = useState([]); // State to store attributes data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(''); // State for error messages

  useEffect(() => {
    const fetchParentcategory = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_parent_category'); // Replace with your API endpoint
        setParentcategory(response.data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attributes:', error);
        setError('Failed to fetch attributes.');
        setLoading(false);
      }
    };

    fetchParentcategory();
  }, []);

  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/AddParentCategory">
          <CButton color="primary" className="me-md-2">Add Parent Category</CButton>
        </Link>
      </div>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Parent Categories</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <p>Loading parent category...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <CTable>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Category Head</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Parent Category</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Short Form/Symbol</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {pc.map((pc, index) => (
                    <CTableRow key={pc.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{pc.category_head}</CTableDataCell> 
                      <CTableDataCell>{pc.pc_name}</CTableDataCell> {/* Attribute name */}
                      <CTableDataCell>{pc.symbol}</CTableDataCell> {/* Short form or symbol */}
                      <CTableDataCell>{pc.description}</CTableDataCell> {/* Description */}
                      <CTableDataCell>{pc.status}</CTableDataCell> {/* Status: 'Active', 'Pending', 'Inactive' */}
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

export default ParentCategory;
