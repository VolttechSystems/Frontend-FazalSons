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
  const [attributes, setAttributes] = useState([]); // State for attributes

  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_variation'); // Replace with your API endpoint for variations
        setVariations(response.data);
        console.log('Fetched Variations:', response.data); // Log the variations
      } catch (error) {
        console.error('Error fetching variations:', error);
      }
    };

    const fetchAttributes = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_attribute'); // Replace with your API endpoint for attributes
        setAttributes(response.data);
        console.log('Fetched Attributes:', response.data); // Log the attributes
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };

    fetchVariations();
    fetchAttributes();
  }, []);

  const getAttributeNameById = (id) => {
    console.log('Looking for attribute with ID:', id); // Log the ID being searched
    const attribute = attributes.find(attr => attr.id === id);
    console.log('Found attribute:', attribute); // Log the found attribute
    return attribute ? attribute.attribute_name : 'N/A'; // Return 'N/A' if not found
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
                <CButton href="#" color="primary" className="me-md-2">Add Variations</CButton>
              </Link>
            </div>
            <CTable striped>
              <thead>
                <CTableRow>
                  <CTableHeaderCell>Variation Name</CTableHeaderCell>
                  <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Attribute</CTableHeaderCell> {/* New column for attributes */}
                </CTableRow>
              </thead>
              <CTableBody>
                {variations.map(variation => (
                  <CTableRow key={variation.id}>
                    <CTableDataCell>{variation.variation_name}</CTableDataCell>
                    <CTableDataCell>{variation.symbol}</CTableDataCell>
                    <CTableDataCell>{variation.description}</CTableDataCell>
                    <CTableDataCell>{variation.status}</CTableDataCell>
                    <CTableDataCell>
                      {getAttributeNameById(variation.id)}
                    </CTableDataCell> {/* Display attribute name */}
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
