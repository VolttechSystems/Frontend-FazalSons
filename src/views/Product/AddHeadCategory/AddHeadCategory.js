import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
  CTableDataCell,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddHeadCategory = () => {
  const [hc_name, setHCname] = useState('');
  const [status, setStatus] = useState('active'); 
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [types, setTypes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  
  const fetchHeadCategory = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/products/add_head_category');
      setTypes(response.data); 
    } catch (error) {
      console.error('Error fetching category head:', error);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = { hc_name:hc_name,symbol,description,status};

    try {
      if (editingIndex !== null) {
        
        await axios.put(`http://16.171.145.107/pos/products/action_head_category/${types[editingIndex].id}/`, requestData);
        setEditingIndex(null); 
      } else {
       
        await axios.post('http://16.171.145.107/pos/products/add_head_category', requestData);
      }
      // Reset the form
      setHCname('');
      setStatus('active');
      setSymbol('') ;
      setDescription('');
      fetchHeadCategory(); 
    } catch (error) {
      console.error('Error adding/editing Head Category :', error);
    }
  };

  // Function to handle edit button click
  const handleEdit = (index) => {
    const selectedType = types[index];
    
      setHCname(selectedType.hc_name);
      setStatus(selectedType.status);
      setSymbol(selectedType.symbol) ;
      setDescription(selectedType.description);
      setEditingIndex(index);
  };

  // Function to handle delete button click
  const handleDelete = async (index) => {
    const id = types[index].id; // Assuming each type has a unique `id`
    try {
      await axios.delete(`http://16.171.145.107/pos/products/action_head_category/${id}/`);
      fetchHeadCategory(); 
    } catch (error) {
      console.error('Error deleting category head:', error);
    }
  };

  useEffect(() => {
    fetchHeadCategory();
  }, []);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>{editingIndex !== null ? 'Edit category head' : 'Add category head'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CFormLabel htmlFor="hc_name" className="col-sm-2 col-form-label">Head Category Name</CFormLabel>
                <CCol sm={8}>
                  <CFormInput 
                    type="text" 
                    id="hc_name" 
                    value={hc_name || ''}  
                    onChange={(e) => setHCname(e.target.value)} 
                    required 
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
              <CRow className="mb-3">
                <CFormLabel htmlFor="symbol" className="col-sm-2 col-form-label">Symbol</CFormLabel>
                <CCol sm={8}>
                  <CFormInput 
                    type="text" 
                    id="symbol" 
                    value={symbol || ''} 
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
                    value={description || ''} 
                    onChange={(e) => setDescription(e.target.value)} 
                  />
                </CCol>
              </CRow>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" type="submit">
                  {editingIndex !== null ? 'Update' : 'Add'}
                </CButton>
                <CButton color="secondary" onClick={() => navigate('/Product/AddParentCategory')}>Go to Add Parent Category</CButton>
              </div>
            </CForm>

            <CTable className="mt-3">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Head Category Name</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {types.map((item, index) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.hc_name}</CTableDataCell>
                    <CTableDataCell>{item.status}</CTableDataCell>
                    <CTableDataCell>{item.symbol}</CTableDataCell>
                    <CTableDataCell>{item.description}</CTableDataCell>
                   
                    <CTableDataCell>
                      <CButton color="warning" onClick={() => handleEdit(index)}>Edit</CButton>
                      <CButton color="danger" onClick={() => handleDelete(index)}>Delete</CButton>
                    </CTableDataCell>
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

export default AddHeadCategory;