import React, { useEffect, useState } from 'react';
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
  CFormSelect, // Import CFormSelect for the dropdown
} from '@coreui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AddVariations = () => {
  const [variation_name, setVariationName] = useState('');
  const [symbol, setShortForm] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [attributes, setAttributes] = useState([]); // State to store attributes
  const [selectedAttribute, setSelectedAttribute] = useState(''); // State for selected attribute
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch attributes for the dropdown
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_attribute'); // Replace with your API endpoint
        setAttributes(response.data); // Assuming response.data contains an array of attributes
      } catch (error) {
        console.error('Error fetching attributes:', error);
        setErrorMessage('Failed to fetch attributes.');
      }
    };

    fetchAttributes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const variationData = {
      variation_name: variation_name,
      symbol: symbol,
      description: description,
      status: status,
      attribute_name: selectedAttribute, // Add the selected attribute to the request
    };

    try {
      const response = await axios.post('http://16.170.232.76/pos/products/add_variation', variationData);
      console.log('Variation added:', response.data);
      setVariationName('');
      setShortForm('');
      setDescription('');
      setStatus('active');
      setSelectedAttribute(''); // Reset selected attribute
      alert('Variation added successfully!');
    } catch (error) {
      console.error('There was an error adding the variation!', error);
      setErrorMessage('Error adding variation. Please try again.');
    }
  };

  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/Variations">
          <CButton href="#" color="primary" className="me-md-2">Variations</CButton>
        </Link>
      </div>

      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Variations Information</strong>
          </CCardHeader>
          <CCardBody>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CFormLabel htmlFor="variationName" className="col-sm-2 col-form-label">Variation *</CFormLabel>
                <CCol sm={8}>
                  <CFormInput 
                    type="text" 
                    id="variation_name" 
                    value={variation_name} 
                    onChange={(e) => setVariationName(e.target.value)} 
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
              <CRow className="mb-3">
                <CFormLabel htmlFor="attribute" className="col-sm-2 col-form-label">Select Attribute</CFormLabel>
                <CCol sm={8}>
                  <CFormSelect
                    id="aa"
                    value={selectedAttribute}
                    onChange={(e) => setSelectedAttribute(e.target.value)} // Update selected attribute
                    required
                  >
                    <option value="">Choose an attribute</option>
                    {attributes.map((attribute) => (
                      <option key={attribute.attribute_name} value={attribute.attribute_name}>{attribute.attribute_name}</option> // Use attribute.id for the value
                    ))}
                  </CFormSelect>
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

export default AddVariations;
