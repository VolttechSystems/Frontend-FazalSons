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
import { Link,useNavigate } from 'react-router-dom';
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


const Variations = () => {
  const [variations, setVariations] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchVariations();
    fetchAttributes();
  }, []);

  
  const fetchVariations = async () => {
    try {
      const response = await axios.get('http://16.170.232.76/pos/products/add_variations');
      setVariations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching variations:', error);
      setError('Failed to fetch variations.');
      setLoading(false);
    }
  }

    const fetchAttributes = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_attribute');
        setAttributes(response.data);
        console.log('Fetched Attributes:', response.data);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };

    

    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this variation?')) {
        try {
          await axios.delete(`http://16.170.232.76/pos/products/action_variation/${id}/`);
          alert('variation deleted successfully!');
          fetchVariations(); 
        } catch (error) {
          console.error('Error deleting variation:', error);
          alert('Failed to delete variation.');
        }
      }
    };

    const handleEdit = (id) => {
      console.log("Editing variation with ID:", id);
      navigate(`/Product/AddVariations/${id}`); 
    };

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
            {loading && <Loader/>}
            {loading && <p>Loading variations...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
            <CTable striped>
              <thead>
                <CTableRow>
                <CTableHeaderCell>Sr.#</CTableHeaderCell>
                <CTableHeaderCell>Variation Name</CTableHeaderCell>
                  <CTableHeaderCell>Attribute</CTableHeaderCell> 
                  <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </thead>
              <CTableBody>
                {variations.map((variation,index) => (
                  <CTableRow key={variation.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{variation.variation_name}</CTableDataCell>
                    <CTableDataCell>{getAttributeNameById(variation.attribute_name)}</CTableDataCell>
                    <CTableDataCell>{variation.symbol}</CTableDataCell>
                    <CTableDataCell>{variation.description}</CTableDataCell>
                    <CTableDataCell>{variation.status}</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="warning" size="sm" onClick={() => handleEdit(variation.id)}>Edit</CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(variation.id)} className="ms-2">Delete</CButton>
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

export default Variations;
