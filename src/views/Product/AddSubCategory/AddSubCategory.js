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
  CFormSelect,
  CRow,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AddSubCategory = () => {
  const [parentCategories, setParentCategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] = useState('');

  // Fetch parent categories from API
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_parent_category');
        // Assuming the response structure has an array of categories
        setParentCategories(response.data); 
      } catch (error) {
        console.error('Error fetching parent categories:', error);
      }
    };
    fetchParentCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSubcategory = {
      subcategoryName,
      symbol,
      description,
      status,
      isSubcategory,
      parentCategory: pc_name,
    };

    try {
      const response = await axios.post('http://16.170.232.76/pos/products/add_subcategory', newSubcategory);
      console.log('Subcategory added successfully:', response.data);
      // Reset form after successful submission
      setSubcategoryName('');
      setSymbol('');
      setDescription('');
      setStatus('active');
      setIsSubcategory(false);
      setSelectedParentCategory('');
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <h5>Add Subcategory</h5>
      </CCardHeader>
      <CCardBody>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <Link to="/Product/SubCategory">
            <CButton href="#" color="primary" className="me-md-2">
              Category List
            </CButton>
          </Link>
        </div>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CFormLabel htmlFor="parentCategory" className="col-sm-2 col-form-label">
              Parent Category
            </CFormLabel>
            <CCol sm={10}>
              <CFormSelect
                id="parentCategory"
                value={selectedParentCategory}
                onChange={(e) => setSelectedParentCategory(e.target.value)}
              >
                <option value="">Select Parent Category</option>
                {parentCategories.map((category) => (
                  <option key={category.pc_name} value={category.pc_name}>
                    {category.pc_name} 
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="subcategoryName" className="col-sm-2 col-form-label">
              Subcategory Name
            </CFormLabel>
            <CCol sm={10}>
              <CFormInput
                id="subcategoryName"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="Enter Subcategory Name"
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="symbol" className="col-sm-2 col-form-label">
              Short Form/Symbol
            </CFormLabel>
            <CCol sm={10}>
              <CFormInput
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Enter Symbol"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="description" className="col-sm-2 col-form-label">
              Description
            </CFormLabel>
            <CCol sm={10}>
              <CFormInput
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel className="col-sm-2 col-form-label">Status</CFormLabel>
            <CCol sm={10}>
              <CFormCheck
                type="radio"
                id="active"
                label="Active"
                value="active"
                checked={status === 'active'}
                onChange={() => setStatus('active')}
              />
              <CFormCheck
                type="radio"
                id="inactive"
                label="Inactive"
                value="inactive"
                checked={status === 'inactive'}
                onChange={() => setStatus('inactive')}
              />
              <CFormCheck
                type="radio"
                id="pending"
                label="Pending"
                value="pending"
                checked={status === 'pending'}
                onChange={() => setStatus('pending')}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol sm={10} className="offset-sm-2">
              <CFormCheck
                type="checkbox"
                id="isSubcategory"
                label="Is this a Subcategory?"
                checked={isSubcategory}
                onChange={() => setIsSubcategory(!isSubcategory)}
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol className="text-end">
              <Link to="/Product/Category">
                <CButton color="secondary" className="me-2">
                  Cancel
                </CButton>
              </Link>
              <CButton type="submit" color="primary">
                Add Subcategory
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddSubCategory;
