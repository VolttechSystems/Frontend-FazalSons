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

// const Brands = () => {
//   return (
//     <CRow>
//         <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//         <Link to="/Product/AddBrands">
//       <CButton href="#" color="primary" className="me-md-2">Add Brand</CButton>
//       </Link>         
//         </div>
//       <CCol>
      
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>All Brands</strong> <small></small>
//           </CCardHeader>
//           <CCardBody>
//             {/* <DocsExample href="components/table#table-foot"> */}
//               <CTable>
//                 <CTableHead color="light">
//                   <CTableRow>
//                     <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Date</CTableHeaderCell>
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
//                     <CTableDataCell>  </CTableDataCell>
                    
//                   </CTableRow>
               
//                   <CTableRow>
                  
//                   <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Date</CTableHeaderCell>
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

// export default Brands


// import React, { useEffect, useState } from 'react';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from '@coreui/react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const Brands = () => {
//   const [brands, setBrands] = useState([]); // State to store brands data
//   const [loading, setLoading] = useState(true); // State to manage loading state
//   const [error, setError] = useState(''); // State for error messages

//   useEffect(() => {
//     const fetchBrands = async () => {
//       try {
//         const response = await axios.get('http://16.170.232.76/pos/products/add_brand'); // Replace with your API endpoint
//         setBrands(response.data); // Assuming the response contains the list of brands
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching brands:', error);
//         setError('Failed to fetch brands.');
//         setLoading(false);
//       }
//     };

//     fetchBrands();
//   }, []);

//   return (
//     <CRow>
//       <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//         <Link to="/Product/AddBrands">
//           <CButton href="#" color="primary" className="me-md-2">Add Brand</CButton>
//         </Link>
//       </div>
//       <CCol>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>All Brands</strong>
//           </CCardHeader>
//           <CCardBody>
//             {loading && <p>Loading brands...</p>}
//             {error && <p className="text-danger">{error}</p>}
//             {!loading && !error && (
//               <CTable>
//                 <CTableHead color="light">
//                   <CTableRow>
//                     <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Brand Name</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Symbol</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Description</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {brands.map((brand, index) => (
//                     <CTableRow key={brand.id}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{brand.brand_name}</CTableDataCell>
//                       <CTableDataCell>{brand.symbol}</CTableDataCell>
//                       <CTableDataCell>{brand.description}</CTableDataCell>
//                       <CTableDataCell>{brand.status}</CTableDataCell>
//                     </CTableRow>
//                   ))}
//                 </CTableBody>
//               </CTable>
//             )}
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   );
// };

// export default Brands;

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
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://16.170.232.76/pos/products/add_brand');
      setBrands(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError('Failed to fetch brands.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await axios.delete(`http://16.170.232.76/pos/products/action_brand/${id}/`);
        alert('Brand deleted successfully!');
        fetchBrands(); // Refresh the brands list after deletion
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Failed to delete brand.');
      }
    }
  };

  const handleEdit = (id) => {
    console.log("Editing brand with ID:", id);
    navigate(`/Product/AddBrands/${id}`); 
  };

  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/AddBrands">
          <CButton color="primary" className="me-md-2">Add Brand</CButton>
        </Link>
      </div>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Brands</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <p>Loading brands...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <CTable>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Sr.#</CTableHeaderCell>
                    <CTableHeaderCell>Brand Name</CTableHeaderCell>
                    <CTableHeaderCell>Symbol</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {brands.map((brand, index) => (
                    <CTableRow key={brand.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{brand.brand_name}</CTableDataCell>
                      <CTableDataCell>{brand.symbol}</CTableDataCell>
                      <CTableDataCell>{brand.description}</CTableDataCell>
                      <CTableDataCell>{brand.status}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="warning" size="sm" onClick={() => handleEdit(brand.id)}>Edit</CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(brand.id)} className="ms-2">Delete</CButton>
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

export default Brands;
