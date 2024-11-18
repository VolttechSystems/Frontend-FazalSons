// import React, { useEffect, useState } from 'react';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CForm,
//   CFormSelect,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableHeaderCell,
//   CTableRow,
//   CTableHead,
// } from '@coreui/react';
// import axios from 'axios';
// import './FetchAttributes.css';

// const FetchAttributes = () => {
//   const [attributeTypes, setAttributeTypes] = useState([]);
//   const [selectedAttributeType, setSelectedAttributeType] = useState('');
//   const [attributes, setAttributes] = useState([]);
//   const [selectedAttribute, setSelectedAttribute] = useState('');
//   const [addedAttributes, setAddedAttributes] = useState([]);

//   useEffect(() => {
//     const fetchAttributeTypes = async () => {
//       try {
//         const response = await axios.get('http://16.171.145.107/pos/products/fetch_all_attribute_type/');
//         setAttributeTypes(response.data);
//       } catch (error) {
//         console.error('Error fetching attribute types:', error);
//       }
//     };

//     fetchAttributeTypes();
//   }, []);

//   const handleAttributeTypeChange = async (e) => {
//     const attributeTypeName = e.target.value;
//     setSelectedAttributeType(attributeTypeName);
//     if (attributeTypeName) {
//       try {
//         const response = await axios.get(`http://16.171.145.107/pos/products/fetch_attribute/${attributeTypeName}/`);
//         setAttributes(response.data);
//       } catch (error) {
//         console.error('Error fetching attributes:', error);
//       }
//     }
//   };

//   const handleAddAttribute = () => {
//     if (selectedAttribute) {
//       setAddedAttributes((prev) => [
//         ...prev,
//         { type: selectedAttributeType, name: selectedAttribute },
//       ]);
//       setSelectedAttribute(''); // Reset the selected attribute after adding
//     }
//   };

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-3">
//           <CCardHeader>
//             <strong>Attribute Selection</strong>
//           </CCardHeader>
//           <CCardBody>
//             <CForm>
//               <CRow className="mb-3">
//                 <CCol sm={6}>
//                   <CFormSelect
//                     value={selectedAttributeType}
//                     onChange={handleAttributeTypeChange}
//                     required
//                   >
//                     <option value="">Select Attribute Type</option>
//                     {attributeTypes.map((type) => (
//                       <option key={type.att_type} value={type.att_type}>{type.att_type}</option>
//                     ))}
//                   </CFormSelect>
//                 </CCol>
//                 <CCol sm={6}>
//                   <CFormSelect
//                     value={selectedAttribute}
//                     onChange={(e) => setSelectedAttribute(e.target.value)}
//                     required
//                   >
//                     <option value="">Select Attribute</option>
//                     {attributes.map((attr) => (
//                       <option key={attr.attribute_name} value={attr.attribute_name}>{attr.attribute_name}</option>
//                     ))}
//                   </CFormSelect>
//                 </CCol>
//               </CRow>
//               <CButton color="success" onClick={handleAddAttribute}>Add Attribute</CButton>
//             </CForm>

//             {/* Table to display added attributes */}
//             <CTable striped className="mt-3">
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Attribute Type</CTableHeaderCell>
//                   <CTableHeaderCell>Attribute Name</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {addedAttributes.map((attr, index) => (
//                   <CTableRow key={index}>
//                     <CTableHeaderCell>{attr.att_type}</CTableHeaderCell>
//                     <CTableHeaderCell>{attr.attribute_name}</CTableHeaderCell>
//                   </CTableRow>
//                 ))}
//               </CTableBody>
//             </CTable>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   );
// };

// export default FetchAttributes;

import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableHead,
} from '@coreui/react';
import axios from 'axios';
import './FetchAttributes.css';

const FetchAttributes = () => {
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [selectedAttributeType, setSelectedAttributeType] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [addedAttributes, setAddedAttributes] = useState([]);

  useEffect(() => {
    const fetchAttributeTypes = async () => {
      try {
        const response = await axios.get('http://16.171.145.107/pos/products/fetch_all_attribute_type/');
        setAttributeTypes(response.data);
      } catch (error) {
        console.error('Error fetching attribute types:', error);
      }
    };

    fetchAttributeTypes();
  }, []);

  const handleAttributeTypeChange = async (e) => {
    const attributeTypeName = e.target.value;
    setSelectedAttributeType(attributeTypeName);
    setAttributes([]); // Reset attributes when attribute type changes
    setSelectedAttribute(''); // Reset selected attribute

    if (attributeTypeName) {
      try {
        const response = await axios.get(`http://16.171.145.107/pos/products/fetch_attribute/${attributeTypeName}/`);
        console.log('Attributes response:', response.data); // Log the response
        // Setting attributes based on the response
        setAttributes(response.data);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    }
  };

  const handleAddAttribute = () => {
    if (selectedAttribute) {
      setAddedAttributes((prev) => [
        ...prev,
        { type: selectedAttributeType, name: selectedAttribute },
      ]);
      setSelectedAttribute(''); // Reset the selected attribute after adding
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Attribute Selection</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={6}>
                  <CFormSelect
                    value={selectedAttributeType}
                    onChange={handleAttributeTypeChange}
                    required
                  >
                    <option value="">Select Attribute Type</option>
                    {attributeTypes.map((type) => (
                      <option key={type.att_type} value={type.att_type}>{type.att_type}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol sm={6}>
                  <CFormSelect
                    value={selectedAttribute}
                    onChange={(e) => setSelectedAttribute(e.target.value)}
                    required
                  >
                    <option value="">Select Attribute</option>
                    {attributes.length > 0 ? (
                      attributes.map((attr) => (
                        <option key={attr.attribute_name} value={attr.attribute_name}>
                          {attr.attribute_name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No attributes available</option>
                    )}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CButton color="success" onClick={handleAddAttribute}>Add Attribute</CButton>
            </CForm>

            {/* Table to display added attributes */}
            <CTable striped className="mt-3">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Attribute Type</CTableHeaderCell>
                  <CTableHeaderCell>Attribute Name</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {addedAttributes.map((attr, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell>{attr.type}</CTableHeaderCell>
                    <CTableHeaderCell>{attr.name}</CTableHeaderCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FetchAttributes;
