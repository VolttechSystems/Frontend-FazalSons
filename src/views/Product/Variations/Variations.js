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
import { Link } from 'react-router-dom';
import axios from 'axios';

const Variations = () => {
  const [variations, setVariations] = useState([]);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_variation');
        setVariations(response.data);
        console.log('Fetched Variations:', response.data);
      } catch (error) {
        console.error('Error fetching variations:', error);
      }
    };

    const fetchAttributes = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_attribute');
        setAttributes(response.data);
        console.log('Fetched Attributes:', response.data);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };

    fetchVariations();
    fetchAttributes();
  }, []);

  const getAttributeNameById = (attributeName) => {
    
    const attribute = attributes.find(attr => attr.attribute_name === attributeName);
    
    return attribute ? attribute.attribute_name : 'Attribute not found';
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Variations List</strong>
          </CCardHeader>
          <CCardBody>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/Product/AddVariations">
                <CButton color="primary" className="me-md-2">Add Variations</CButton>
              </Link>
            </div>
            <CTable striped>
              <thead>
                <CTableRow>
                <CTableHeaderCell>Variation Name</CTableHeaderCell>
                  <CTableHeaderCell>Attribute</CTableHeaderCell> 
                  <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </thead>
              <CTableBody>
                {variations.map(variation => (
                  <CTableRow key={variation.id}>
                    <CTableDataCell>{variation.variation_name}</CTableDataCell>
                    <CTableDataCell>
                      {getAttributeNameById(variation.attribute_name)}
                    </CTableDataCell>
                    <CTableDataCell>{variation.symbol}</CTableDataCell>
                    <CTableDataCell>{variation.description}</CTableDataCell>
                    <CTableDataCell>{variation.status}</CTableDataCell>
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

export default Variations;
