

import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AddParentCategory = () => {
  const [categoryHeads, setCategoryHeads] = useState([]);
  const [hc_name, setCategoryHead] = useState('');
  const [pc_name, setPCname] = useState('');
  const [symbol, setShortForm] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategoryHeads = async () => {
      try {
        const response = await axios.get('http://16.171.145.107/pos/products/add_head_category');
        setCategoryHeads(response.data);
      } catch (error) {
        console.error('Error fetching category heads:', error);
        setErrorMessage('Failed to fetch category heads.');
      }
    };

    const fetchParentCategoryDetails = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://16.171.145.107/pos/products/action_parent_category/${id}/`);
          const data = response.data;
          setCategoryHead(data.hc_name);
          setPCname(data.pc_name);
          setShortForm(data.symbol);
          setDescription(data.description);
          setStatus(data.status);
        } catch (error) {
          console.error('Error fetching parent category details:', error);
          setErrorMessage('Failed to fetch category details.');
        }
      }
    };

    fetchCategoryHeads();
    fetchParentCategoryDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ParentCategoryData = {
      hc_name: hc_name,
      pc_name: pc_name,
      symbol: symbol,
      description: description,
      status: status,
    };

    try {
      if (id) {
        await axios.put(`http://16.171.145.107/pos/products/action_parent_category/${id}/`, ParentCategoryData);
        alert('Parent Category updated successfully!');
      } else {
        await axios.post('http://16.171.145.107/pos/products/add_parent_category', ParentCategoryData);
        alert('Parent Category added successfully!');
      }

      navigate('/Product/ParentCategory');
    } catch (error) {
      console.error('There was an error saving the Parent Category!', error);
      setErrorMessage('Error saving Parent Category. Please try again.');
    }
  };

  const handleAddCategoryHead = () => {
       navigate('/Product/AddHeadCategory');
     };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
        
          <CCardHeader>
            <strong>{id ? 'Edit Parent Category' : 'Add Parent Category'}</strong>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <Link to="/Product/ParentCategory">
            <CButton color="primary">Parent Category</CButton>
          </Link>
        </div>
          </CCardHeader>
          <CCardBody>
         
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="categoryHead">Category Head *</CFormLabel>
                <CFormSelect
                  id="categoryHead"
                  value={hc_name}
                  onChange={(e) => setCategoryHead(e.target.value)}
                  required
                >
                  <option value="">Select Category Head</option>
                  {categoryHeads.map((head) => (
                    <option key={head.id} value={head.id}>
                      {head.hc_name}
                    </option>
                  ))}
                </CFormSelect>
                <CButton color="primary" onClick={handleAddCategoryHead} className="ms-2"> + </CButton>
               
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="pc_name">Parent Category *</CFormLabel>
                <CFormInput
                  type="text"
                  id="pc_name"
                  value={pc_name}
                  onChange={(e) => setPCname(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="symbol">Short Form/Symbol</CFormLabel>
                <CFormInput
                  type="text"
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setShortForm(e.target.value)}
                  
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormInput
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Status</CFormLabel>
                <div>
                  <CFormCheck
                    type="radio"
                    name="status"
                    id="status-active"
                    label="Active"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                  />
                  <CFormCheck
                    type="radio"
                    name="status"
                    id="status-inactive"
                    label="Inactive"
                    value="inactive"
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                  />
                  <CFormCheck
                    type="radio"
                    name="status"
                    id="status-pending"
                    label="Pending"
                    value="pending"
                    checked={status === 'pending'}
                    onChange={() => setStatus('pending')}
                  />
                </div>
              </div>
              <CButton type="submit" color="primary">
                {id ? 'Update Parent Category' : 'Add Parent Category'}
              </CButton>
              <Link to="/Product/ParentCategory" className="btn btn-secondary ms-2">
                Cancel
              </Link>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddParentCategory;
