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
  CFormSelect,
} from '@coreui/react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddParentCategory = () => {
  // State for form inputs
  const navigate = useNavigate(); 
  const [category_head, setCategoryHead] = useState(''); // Default to empty
  const [pc_name, setPCname] = useState('');
  const [symbol, setShortForm] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active'); // Default status
  const [errorMessage, setErrorMessage] = useState(''); // To handle error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an attribute object to send in the request
    const ParentCategoryData = {
      category_head: category_head,
      pc_name: pc_name,
      symbol: symbol,
      description: description,
      status: status,
    };

    try {
      // Send POST request to add attribute
      const response = await axios.post('http://16.170.232.76/pos/products/add_parent_category', ParentCategoryData);
      console.log('Parent Category added:', response.data);
      
      // Clear form fields after successful submission
      setCategoryHead('');
      setPCname('');
      setShortForm('');
      setDescription('');
      setStatus('active'); 

      alert('Parent Category added successfully!');
    } catch (error) {
      console.error('There was an error adding the Parent Category!', error);
      setErrorMessage('Error adding Parent Category. Please try again.'); // Set error message
    }
  };

  
  const handleAddCategoryHead = () => {
    navigate('/Product/AddHeadCategory'); 
  };

  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/ParentCategory">
          <CButton href="#" color="primary" className="me-md-2">Parent Category</CButton>
        </Link>
      </div>

      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Parent Category Information</strong>
          </CCardHeader>
          <CCardBody>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message if exists */}
            <CForm onSubmit={handleSubmit}>
              <fieldset className="row mb-3">
                <legend className="col-form-label col-sm-2 pt-0">Category Head</legend>
                <CCol sm={8}>
                  <CFormSelect
                    id="category_head"
                    value={category_head}
                    onChange={(e) => setCategoryHead(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Category Head</option>
                    <option value="clothing">Clothing & Accessories</option>
                  </CFormSelect> <CButton color="primary" onClick={handleAddCategoryHead} className="ms-2"> + </CButton>

                </CCol>
              </fieldset>
              <CRow className="mb-3">
                <CFormLabel htmlFor="pc_name" className="col-sm-2 col-form-label">Parent Category *</CFormLabel>
                <CCol sm={8}>
                  <CFormInput 
                    type="text" 
                    id="pc_name" 
                    value={pc_name} 
                    onChange={(e) => setPCname(e.target.value)} 
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

export default AddParentCategory;
