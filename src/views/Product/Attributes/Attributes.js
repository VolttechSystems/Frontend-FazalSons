
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
//   CTableHeaderCell,
//   CTableRow,
// } from '@coreui/react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Attributes = () => {
//   const [attributes, setAttributes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchAttributes();
//   }, []);

//   const fetchAttributes = async () => {
//     try {
//       const response = await axios.get('http://16.170.232.76/pos/products/add_attributes');
//       setAttributes(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching attributes:', error);
//       setError('Failed to fetch attributes.');
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this attribute?')) {
//       try {
//         await axios.delete(`http://16.170.232.76/pos/products/action_attributes/${id}/`);
//         alert('Attribute deleted successfully!');
//         fetchAttributes();
//       } catch (error) {
//         console.error('Error deleting attribute:', error);
//         alert('Failed to delete attribute.');
//       }
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/Product/AddAttributes/${id}`);
//   };

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-3">
//           <CCardHeader>
//             <strong>All Attributes</strong>
//           </CCardHeader>
//           <CCardBody>
//             <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//               <Link to="/Product/AddAttributes">
//                 <CButton color="primary" className="me-md-2">Add Attribute</CButton>
//               </Link>
//             </div>
//             {loading && <p>Loading Attributes...</p>}
//             {error && <p className="text-danger">{error}</p>}
//             {!loading && !error && (
//               <CTable striped>
//                 <thead>
//                   <CTableRow>
//                     <CTableHeaderCell>Sr.#</CTableHeaderCell>
//                     <CTableHeaderCell>Attribute Name</CTableHeaderCell>
//                     <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
//                     <CTableHeaderCell>Description</CTableHeaderCell>
//                     <CTableHeaderCell>Status</CTableHeaderCell>
//                     <CTableHeaderCell>Actions</CTableHeaderCell>
//                   </CTableRow>
//                 </thead>
//                 <CTableBody>
//                   {attributes.map((attr, index) => (
//                     <CTableRow key={attr.id}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{attr.attribute_name}</CTableDataCell>
//                       <CTableDataCell>{attr.symbol}</CTableDataCell>
//                       <CTableDataCell>{attr.description}</CTableDataCell>
//                       <CTableDataCell>{attr.status}</CTableDataCell>
//                       <CTableDataCell>
//                         <CButton color="warning" onClick={() => handleEdit(attr.id)}>Edit</CButton>
//                         <CButton color="danger" onClick={() => handleDelete(attr.id)} className="ms-2">Delete</CButton>
//                       </CTableDataCell>
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

// export default Attributes;


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
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Loader = () => {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

const Attributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await axios.get('http://16.170.232.76/pos/products/add_attributes');
      setAttributes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attributes:', error);
      setError('Failed to fetch attributes.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      try {
        await axios.delete(`http://16.170.232.76/pos/products/action_attributes/${id}/`);
        alert('Attribute deleted successfully!');
        fetchAttributes();
      } catch (error) {
        console.error('Error deleting attribute:', error);
        alert('Failed to delete attribute.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/Product/AddAttributes/${id}`);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>All Attributes</strong>
          </CCardHeader>
          <CCardBody>
          {loading && <Loader />}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/Product/AddAttributes">
                <CButton color="primary" className="me-md-2">Add Attribute</CButton>
              </Link>
            </div>
            {loading && <p>Loading Attributes...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <CTable striped>
                <thead>
                  <CTableRow>
                    <CTableHeaderCell>Sr.#</CTableHeaderCell>
                    <CTableHeaderCell>Attribute Name</CTableHeaderCell>
                    <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Attribute Type</CTableHeaderCell> {/* Added this line */}
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </thead>
                <CTableBody>
                  {attributes.map((attr, index) => (
                    <CTableRow key={attr.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{attr.attribute_name}</CTableDataCell>
                      <CTableDataCell>{attr.symbol}</CTableDataCell>
                      <CTableDataCell>{attr.description}</CTableDataCell>
                      <CTableDataCell>{attr.att_type}</CTableDataCell> {/* Added this line */}
                      <CTableDataCell>{attr.status}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="warning" onClick={() => handleEdit(attr.id)}>Edit</CButton>
                        <CButton color="danger" onClick={() => handleDelete(attr.id)} className="ms-2">Delete</CButton>
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

export default Attributes;
