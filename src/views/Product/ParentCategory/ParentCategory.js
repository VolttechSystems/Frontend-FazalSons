

// // import React, { useEffect, useState } from 'react';
// // import {
// //   CButton,
// //   CCard,
// //   CCardBody,
// //   CCardHeader,
// //   CCol,
// //   CRow,
// //   CTable,
// //   CTableBody,
// //   CTableDataCell,
// //   CTableHead,
// //   CTableHeaderCell,
// //   CTableRow,
// // } from '@coreui/react';
// // import { Link } from 'react-router-dom';
// // import axios from 'axios';

// // const ParentCategory = () => {
// //   const [pc, setParentcategory] = useState([]);
// //   const [hc, setHeadcatgory] = useState([]);
// //   const [loading, setLoading] = useState(true); 
// //   const [error, setError] = useState(''); 

// //   useEffect(() => {
// //     const fetchParentcategory = async () => {
// //       try {
// //         const response = await axios.get('http://16.170.232.76/pos/products/add_parent_category'); // Replace with your API endpoint
// //         setParentcategory(response.data); 
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching attributes:', error);
// //         setError('Failed to fetch attributes.');
// //         setLoading(false);
// //       }
// //     };

// //     fetchParentcategory();
// //   }, []);


// //   const getCategoryHead = (categoryhead) => {
    
// //     const headcat = hc.find(attr => attr.attribute_name === categoryhead);
    
// //     return headcat ? headcat.attribute_name : 'Attribute not found';
// //   };

// //   return (
// //     <CRow>
// //       <div className="d-grid gap-2 d-md-flex justify-content-md-end">
// //         <Link to="/Product/AddParentCategory">
// //           <CButton color="primary" className="me-md-2">Add Parent Category</CButton>
// //         </Link>
// //       </div>
// //       <CCol>
// //         <CCard className="mb-4">
// //           <CCardHeader>
// //             <strong>All Parent Categories</strong>
// //           </CCardHeader>
// //           <CCardBody>
// //             {loading && <p>Loading parent category...</p>}
// //             {error && <p className="text-danger">{error}</p>}
// //             {!loading && !error && (
// //               <CTable>
// //                 <CTableHead color="light">
// //                   <CTableRow>
// //                     <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
// //                     <CTableHeaderCell scope="col">Category Head</CTableHeaderCell>
// //                     <CTableHeaderCell scope="col">Parent Category</CTableHeaderCell>
// //                     <CTableHeaderCell scope="col">Short Form/Symbol</CTableHeaderCell>
// //                     <CTableHeaderCell scope="col">Description</CTableHeaderCell>
// //                     <CTableHeaderCell scope="col">Status</CTableHeaderCell>
// //                   </CTableRow>
// //                 </CTableHead>
// //                 <CTableBody>
// //                   {pc.map((pc, index) => (
// //                     <CTableRow key={pc.id}>
// //                       <CTableDataCell>{index + 1}</CTableDataCell>
// //                       <CTableDataCell>{pc.hc_name}</CTableDataCell> 
// //                       <CTableDataCell>{getCategoryHead(pc.hc_name)}</CTableDataCell>
// //                       <CTableDataCell>{pc.pc_name}</CTableDataCell> 
// //                       <CTableDataCell>{pc.symbol}</CTableDataCell> 
// //                       <CTableDataCell>{pc.description}</CTableDataCell> 
// //                       <CTableDataCell>{pc.status}</CTableDataCell> 
// //                     </CTableRow>
// //                   ))}
// //                 </CTableBody>
// //               </CTable>
// //             )}
// //           </CCardBody>
// //         </CCard>
// //       </CCol>
// //     </CRow>
// //   );
// // };

// // export default ParentCategory;


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

// const ParentCategory = () => {
//   const [pc, setParentcategory] = useState([]);
//   const [hc, setHeadcategory] = useState([]); // Renamed to 'setHeadcategory' for clarity
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchParentcategory = async () => {
//       try {
//         const response = await axios.get('http://16.170.232.76/pos/products/add_parent_category');
//         setParentcategory(response.data);
//       } catch (error) {
//         console.error('Error fetching parent categories:', error);
//         setError('Failed to fetch parent categories.');
//       }
//     };

//     const fetchHeadcategory = async () => {
//       try {
//         const response = await axios.get('http://16.170.232.76/pos/products/add_head_category'); // Adjust to your actual API endpoint
//         setHeadcategory(response.data);
//       } catch (error) {
//         console.error('Error fetching head categories:', error);
//         setError('Failed to fetch head categories.');
//       }
//     };

//     const fetchData = async () => {
//       await Promise.all([fetchParentcategory(), fetchHeadcategory()]);
//       setLoading(false); // Set loading to false after both fetches
//     };

//     fetchData();
//   }, []);

  
//   const getCategoryHead = (categoryHeadName) => {
//     const headcat = hc.find(attr => attr.hc_name_id === categoryHeadName); 
//     return headcat ? headcat.hc_name: 'Category Head not found'; 
//   };

//   return (
//     <CRow>
//       <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//         <Link to="/Product/AddParentCategory">
//           <CButton color="primary" className="me-md-2">Add Parent Category</CButton>
//         </Link>
//       </div>
//       <CCol>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>All Parent Categories</strong>
//           </CCardHeader>
//           <CCardBody>
//             {loading && <p>Loading parent category...</p>}
//             {error && <p className="text-danger">{error}</p>}
//             {!loading && !error && (
//               <CTable>
//                 <CTableHead color="light">
//                   <CTableRow>
//                     <CTableHeaderCell scope="col">Sr.#</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Category Head</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Parent Category</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Short Form/Symbol</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Description</CTableHeaderCell>
//                     <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {pc.map((parent, index) => (
//                     <CTableRow key={parent.id}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{getCategoryHead(parent.hc_name_id)}</CTableDataCell> {/* Use the category head */}
//                       <CTableDataCell>{parent.pc_name}</CTableDataCell>
//                       <CTableDataCell>{parent.symbol}</CTableDataCell>
//                       <CTableDataCell>{parent.description}</CTableDataCell>
//                       <CTableDataCell>{parent.status}</CTableDataCell>
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

// export default ParentCategory;


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


const Loader = () => {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

const ParentCategory = () => {
  const [pc, setParentcategory] = useState([]);
  const [hc, setHeadcategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParentcategory = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_parent_category');
        setParentcategory(response.data);
        console.log('Parent Categories:', response.data);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
        setError('Failed to fetch parent categories.');
      }
    };

    const fetchHeadcategory = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_head_category');
        setHeadcategory(response.data);
        console.log('Head Categories:', response.data);
      } catch (error) {
        console.error('Error fetching head categories:', error);
        setError('Failed to fetch head categories.');
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchParentcategory(), fetchHeadcategory()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getCategoryHead = (categoryHeadId) => {
    const headcat = hc.find(attr => attr.hc_name_id === categoryHeadId);
    console.log('Looking for:', categoryHeadId, 'Found:', headcat);
    return headcat ? headcat.hc_name : 'Category Head not found';
  };

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
            {loading && <Loader />}
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
                  {pc.map((parent, index) => (
                    <CTableRow key={parent.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{getCategoryHead(parent.hc_name_id)}</CTableDataCell>
                      <CTableDataCell>{parent.pc_name}</CTableDataCell>
                      <CTableDataCell>{parent.symbol}</CTableDataCell>
                      <CTableDataCell>{parent.description}</CTableDataCell>
                      <CTableDataCell>{parent.status}</CTableDataCell>
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
