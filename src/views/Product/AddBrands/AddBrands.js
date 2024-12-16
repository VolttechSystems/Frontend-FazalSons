

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

// const AddBrands = () => {
//   // State for form inputs
//   const [brandName, setBrandName] = useState('');
//   const [symbol, setSymbol] = useState('');
//   const [description, setDescription] = useState('');
//   const [status, setStatus] = useState('active'); // Default status
//   const [errorMessage, setErrorMessage] = useState(''); // To handle error messages

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create a brand object to send in the request
//     const brandData = {
//       brand_name: brandName,
//       symbol: symbol,
//       description: description,
//       status: status,
//     };

//     try {
//       // Send POST request to add brand
//       const response = await axios.post('http://16.170.232.76/pos/products/add_brand', brandData);
//       console.log('Brand added:', response.data);
      
//       // Clear form fields after successful submission
//       setBrandName('');
//       setSymbol('');
//       setDescription('');
//       setStatus('active'); 

//       alert('Brand added successfully!');
//     } catch (error) {
//       console.error('There was an error adding the brand!', error);
//       setErrorMessage('Error adding brand. Please try again.'); // Set error message
//     }
//   };
// // ye code ko run kro okay
//   return (
//     <CRow>
//       <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//         <Link to="/Product/Brands">
//           <CButton href="#" color="primary" className="me-md-2">Brands</CButton>
//         </Link>
//       </div>

//       <CCol xs={12}>
//         <CCard className="mb-3">
//           <CCardHeader>
//             <strong>Brand Information</strong>
//           </CCardHeader>
//           <CCardBody>
//             {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message if exists */}
//             <CForm onSubmit={handleSubmit}>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="brandName" className="col-sm-2 col-form-label">Brand *</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormInput 
//                     type="text" 
//                     id="brandName" 
//                     value={brandName} 
//                     onChange={(e) => setBrandName(e.target.value)} 
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
//                     onChange={(e) => setSymbol(e.target.value)} 
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

// export default AddBrands;



import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AddBrands = () => {
  const [brandName, setBrandName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active'); // Default status
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Get the brand ID from the URL

  useEffect(() => {
    // Fetch brand details for editing
    if (id) {
      const fetchBrandDetails = async () => {
        try {
          const response = await axios.get(`http://195.26.253.123/pos/products/action_brand/${id}/`);
          const brand = response.data;
          setBrandName(brand.brand_name);
          setSymbol(brand.symbol);
          setDescription(brand.description);
          setStatus(brand.status);
        } catch (error) {
          console.error('Failed to fetch brand for editing:', error);
          setErrorMessage('Failed to load brand details.');
        }
      };
      fetchBrandDetails();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const brandData = {
      brand_name: brandName,
      symbol: symbol,
      description: description,
      status: status,
    };

    try {
      if (id) {
        
        await axios.put(`http://195.26.253.123/pos/products/action_brand/${id}/`, brandData);
        alert('Brand updated successfully!');
      } else {
        
        await axios.post('http://195.26.253.123/pos/products/add_brand', brandData);
        alert('Brand added successfully!');
      }
      navigate('/Product/Brands'); 
    } catch (error) {
      console.error('Error saving the brand:', error);
      setErrorMessage('Error saving the brand. Please try again.');
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <strong>{id ? 'Edit Brand' : 'Add Brand'}</strong>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <Link to="/Product/Brands">
            <CButton color="primary">Brands</CButton>
          </Link>
        </div>
      </CCardHeader>
      <CCardBody>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CFormLabel htmlFor="brandName" className="col-sm-2 col-form-label">Brand *</CFormLabel>
            <CCol sm={8}>
              <CFormInput 
                type="text" 
                id="brandName" 
                value={brandName} 
                onChange={(e) => setBrandName(e.target.value)} 
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
                onChange={(e) => setSymbol(e.target.value)} 
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
                id="inactive" 
                value="inactive" 
                label="Inactive" 
                checked={status === 'inactive'} 
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
            </CCol>
          </fieldset>
          <CButton type="submit" color="primary">{id ? 'Update Brand' : 'Add Brand'}</CButton>
        </form>
      </CCardBody>
    </CCard>
  );
};

export default AddBrands;
