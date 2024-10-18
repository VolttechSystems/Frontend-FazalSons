

// import React, { useState } from 'react';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CForm,
//   CFormCheck,
//   CFormInput,
//   CFormLabel,
//   CRow,
// } from '@coreui/react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const AddAttributes = () => {
//   // State for form inputs
//   const [type, setAttributeType] = useState('color'); // Default to 'color'
//   const [attribute_name, setAttributeName] = useState('');
//   const [symbol, setShortForm] = useState('');
//   const [description, setDescription] = useState('');
//   const [status, setStatus] = useState('active'); // Default status
//   const [errorMessage, setErrorMessage] = useState(''); // To handle error messages

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create an attribute object to send in the request
//     const attributeData = {
//         type: type,
//         attribute_name: attribute_name,
//         symbol: symbol,
//       description: description,
//       status: status,
//     };

//     try {
//       // Send POST request to add attribute
//       const response = await axios.post('http://16.170.232.76/pos/products/add_attribute', attributeData);
//       console.log('Attribute added:', response.data);
      
//       // Clear form fields after successful submission
//       setAttributeType('color');
//       setAttributeName('');
//       setShortForm('');
//       setDescription('');
//       setStatus('active'); 

//       alert('Attribute added successfully!');
//     } catch (error) {
//       console.error('There was an error adding the attribute!', error);
//       setErrorMessage('Error adding attribute. Please try again.'); // Set error message
//     }
//   };

//   return (
//     <CRow>
//       <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//         <Link to="/Product/Attributes">
//           <CButton href="#" color="primary" className="me-md-2">Attributes</CButton>
//         </Link>
//       </div>

//       <CCol xs={12}>
//         <CCard className="mb-3">
//           <CCardHeader>
//             <strong>Attribute Information</strong>
//           </CCardHeader>
//           <CCardBody>
//             {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message if exists */}
//             <CForm onSubmit={handleSubmit}>
//               <fieldset className="row mb-3">
//                 <legend className="col-form-label col-sm-2 pt-0">Attribute Type</legend>
//                 <CCol sm={8}>
//                   <CFormCheck 
//                     type="radio" 
//                     name="type" 
//                     id="color" 
//                     value="color" 
//                     label="Color" 
//                     checked={type === 'color'} 
//                     onChange={(e) => setAttributeType(e.target.value)} 
//                   />
//                   <CFormCheck 
//                     type="radio" 
//                     name="type" 
//                     id="size" 
//                     value="size" 
//                     label="Size" 
//                     checked={type === 'size'} 
//                     onChange={(e) => setAttributeType(e.target.value)} 
//                   />
//                 </CCol>
//               </fieldset>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="attributeName" className="col-sm-2 col-form-label">Attribute *</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormInput 
//                     type="text" 
//                     id="attribute_name" 
//                     value={attribute_name} 
//                     onChange={(e) => setAttributeName(e.target.value)} 
//                     required 
//                   />
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="symbol" className="col-sm-2 col-form-label">Short Form/Symbol</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormInput 
//                     type="text" 
//                     id="symbol" 
//                     value={symbol} 
//                     onChange={(e) => setShortForm(e.target.value)} 
//                   />
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="description" className="col-sm-2 col-form-label">Description</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormInput 
//                     type="text" 
//                     id="description" 
//                     value={description} 
//                     onChange={(e) => setDescription(e.target.value)} 
//                   />
//                 </CCol>
//               </CRow>
//               <fieldset className="row mb-3">
//                 <legend className="col-form-label col-sm-2 pt-0">Status</legend>
//                 <CCol sm={8}>
//                   <CFormCheck 
//                     type="radio" 
//                     name="status" 
//                     id="active" 
//                     value="active" 
//                     label="Active" 
//                     checked={status === 'active'} 
//                     onChange={(e) => setStatus(e.target.value)} 
//                   />
//                   <CFormCheck 
//                     type="radio" 
//                     name="status" 
//                     id="pending" 
//                     value="pending" 
//                     label="Pending" 
//                     checked={status === 'pending'} 
//                     onChange={(e) => setStatus(e.target.value)} 
//                   />
//                   <CFormCheck 
//                     type="radio" 
//                     name="status" 
//                     id="inactive" 
//                     value="inactive" 
//                     label="Inactive" 
//                     checked={status === 'inactive'} 
//                     onChange={(e) => setStatus(e.target.value)} 
//                   />
//                 </CCol>
//               </fieldset>
//               <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                 <CButton color="primary" type="submit">Save</CButton>
//               </div>
//             </CForm>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   );
// };

// export default AddAttributes;


import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const AddAttributes = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [type, setAttributeType] = useState('color');
  const [attribute_name, setAttributeName] = useState('');
  const [symbol, setShortForm] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const attributeData = {
      type: type,
      attribute_name: attribute_name,
      symbol: symbol,
      description: description,
      status: status,
    };

    try {
      const response = await axios.post('http://16.170.232.76/pos/products/add_attribute', attributeData);
      console.log('Attribute added:', response.data);
      setAttributeType('color');
      setAttributeName('');
      setShortForm('');
      setDescription('');
      setStatus('active');
      alert('Attribute added successfully!');
    } catch (error) {
      console.error('There was an error adding the attribute!', error);
      setErrorMessage('Error adding attribute. Please try again.');
    }
  };

  const handleAddAttributeType = () => {
    navigate('/Product/AddAttributeType'); 
  };

  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/Attributes">
          <CButton color="primary" className="me-md-2">Attributes</CButton>
        </Link>
      </div>

      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Attribute Information</strong>
          </CCardHeader>
          <CCardBody>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <CForm onSubmit={handleSubmit}>
              <fieldset className="row mb-3">
                <legend className="col-form-label col-sm-2 pt-0">Attribute Type</legend>
                <CCol sm={8}>
                  <CFormCheck 
                    type="radio" 
                    name="type" 
                    id="color" 
                    value="color" 
                    label="Color" 
                    checked={type === 'color'} 
                    onChange={(e) => setAttributeType(e.target.value)} 
                  />
                  <CFormCheck 
                    type="radio" 
                    name="type" 
                    id="size" 
                    value="size" 
                    label="Size" 
                    checked={type === 'size'} 
                    onChange={(e) => setAttributeType(e.target.value)}  
                  />
                  <CButton color="primary" onClick={handleAddAttributeType} className="ms-2">+</CButton>
                  
                </CCol>
              </fieldset>
              <CRow className="mb-3">
                <CFormLabel htmlFor="attributeName" className="col-sm-2 col-form-label">Attribute *</CFormLabel>
                <CCol sm={8}>
                  <CFormInput 
                    type="text" 
                    id="attribute_name" 
                    value={attribute_name} 
                    onChange={(e) => setAttributeName(e.target.value)} 
                    required 
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="symbol" className="col-sm-2 col-form-label">Short Form/Symbol</CFormLabel>
                <CCol sm={8}>
                  <CFormInput 
                    type="text" 
                    id="symbol" 
                    value={symbol} 
                    onChange={(e) => setShortForm(e.target.value)} 
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="description" className="col-sm-2 col-form-label">Description</CFormLabel>
                <CCol sm={8}>
                  <CFormInput 
                    type="text" 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                  />
                </CCol>
              </CRow>
              <fieldset className="row mb-3">
                <legend className="col-form-label col-sm-2 pt-0">Status</legend>
                <CCol sm={8}>
                  <CFormCheck 
                    type="radio" 
                    name="status" 
                    id="active" 
                    value="active" 
                    label="Active" 
                    checked={status === 'active'} 
                    onChange={(e) => setStatus(e.target.value)} 
                  />
                  <CFormCheck 
                    type="radio" 
                    name="status" 
                    id="pending" 
                    value="pending" 
                    label="Pending" 
                    checked={status === 'pending'} 
                    onChange={(e) => setStatus(e.target.value)} 
                  />
                  <CFormCheck 
                    type="radio" 
                    name="status" 
                    id="inactive" 
                    value="inactive" 
                    label="Inactive" 
                    checked={status === 'inactive'} 
                    onChange={(e) => setStatus(e.target.value)} 
                  />
                </CCol>
              </fieldset>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">Save</CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddAttributes;
