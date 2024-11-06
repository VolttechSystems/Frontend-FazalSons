

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
  CFormSelect,
  CTable,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTableHead,
} from '@coreui/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AddCategory = () => {
  const [category_name, setCategoryName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [subcategory_option, setSubcategoryOption] = useState("Yes");
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [variations, setVariations] = useState([]); // Variations for displaying in the table
  const [selectedAttributeType, setSelectedAttributeType] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [addedAttributes, setAddedAttributes] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await axios.get('http://16.171.145.107/pos/products/add_parent_category');
        setParentCategories(response.data);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
        setErrorMessage('Failed to fetch parent categories.');
      }
    };
    const fetchAttributeTypes = async () => {
      try {
        const response = await axios.get('http://16.171.145.107/pos/products/fetch_all_attribute_type/');
        setAttributeTypes(response.data);
      } catch (error) {
        console.error('Error fetching attribute types:', error);
      }
    };

    fetchParentCategories();
    fetchAttributeTypes();
    if (id) {
      fetchCategoryDetails(id);
    }
  }, [id]);

  const handleAttributeTypeChange = async (e) => {
    const attributeTypeName = e.target.value;
    setSelectedAttributeType(attributeTypeName);
    setAttributes([]); // Reset attributes when attribute type changes
    setSelectedAttribute(''); // Reset selected attribute

    if (attributeTypeName) {
      try {
        const response = await axios.get(`http://16.171.145.107/pos/products/fetch_attribute/${attributeTypeName}/`);
        setAttributes(response.data);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    }
  };

  const handleAttributeChange = async (e) => {
    const attributeName = e.target.value;
    setSelectedAttribute(attributeName);
    setVariations([]); // Reset variations when a new attribute is selected

    if (attributeName) {
      try {
        const response = await axios.get(`http://16.171.145.107/pos/products/fetch_variation/${encodeURIComponent(attributeName)}/`);
        setVariations(response.data);  // Update variations with the response
      } catch (error) {
        console.error('Error fetching variations:', error);
      }
    }
  };

  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`http://16.171.145.107/pos/products/action_category/${id}/`);
      const category = response.data;
      setCategoryName(category.category_name);
      setSymbol(category.symbol);
      setSubcategoryOption(category.subcategory_option);
      setDescription(category.description);
      setStatus(category.status);
      setSelectedParentCategory(category.pc_name);
      setSelectedAttribute(category.attribute_name || ''); // Set the attribute if available
    } catch (error) {
      console.error('Failed to fetch category for editing:', error);
      setErrorMessage('Failed to load category details.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const categoryData = {
      category_name: category_name,
      symbol: symbol,
      subcategory_option: subcategory_option,
      description: description,
      status: status,
      pc_name: selectedParentCategory,
      attribute_name: selectedAttribute, // Added attribute field
    };

    try {
      if (id) {
        await axios.put(`http://16.171.145.107/pos/products/action_category/${id}/`, categoryData);
        alert('Category updated successfully!');
      } else {
        await axios.post('http://16.171.145.107/pos/products/add_category', categoryData);
        alert('Category added successfully!');
      }
      navigate('/Product/Category');
    } catch (error) {
      console.error('Error saving the category:', error);
      setErrorMessage('Error saving the category. Please try again.');
    }
  };

  const handleAddAttribute = () => {
        if (selectedAttribute) {
          setAddedAttributes((prev) => [
            ...prev,
            { type: selectedAttributeType, name: selectedAttribute },
          ]);
          setSelectedAttribute(''); // Reset the selected attribute after adding
        }
      };

  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to="/Product/Category">
          <CButton href="#" color="primary" className="me-md-2">Category List</CButton>
        </Link>
      </div>

      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>{id ? 'Edit Category' : 'Add Category'}</strong>
          </CCardHeader>
          <CCardBody>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <CForm onSubmit={handleSubmit}>
              {/* Main Form Fields */}
              <CRow className="mb-3">
                <CFormLabel htmlFor="parentCategory" className="col-sm-2 col-form-label">Select Parent Category</CFormLabel>
                <CCol sm={8}>
                  <CFormSelect
                    id="parentCategory"
                    value={selectedParentCategory}
                    onChange={(e) => setSelectedParentCategory(e.target.value)}
                    required
                  >
                    <option value="">Choose a parent category</option>
                    {parentCategories.map((pc) => (
                      <option key={pc.pc_name} value={pc.pc_name}>{pc.pc_name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="categoryName" className="col-sm-2 col-form-label">Category Name *</CFormLabel>
                <CCol sm={8}>
                  <CFormInput 
                    type="text" 
                    id="category_name" 
                    value={category_name} 
                    onChange={(e) => setCategoryName(e.target.value)} 
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
              <CRow className="mb-3 align-items-center">
  <CFormLabel htmlFor="subcategory_option" className="col-sm-2 col-form-label">
   
  </CFormLabel>
  <CCol sm={8} className="d-flex align-items-center">
    <CFormCheck 
      type="checkbox" 
      id="subcategory_option" 
      checked={subcategory_option === "Yes"} 
      onChange={(e) => setSubcategoryOption(e.target.checked ? "Yes" : "No")} 
      className="me-2"
    />
    <span className="ms-2">  If you want to add Sub Categories</span> 
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
                    label="Active" 
                    value="active" 
                    checked={status === 'active'} 
                    onChange={(e) => setStatus(e.target.value)} 
                  />
                  <CFormCheck 
                    type="radio" 
                    name="status" 
                    id="inactive" 
                    label="Inactive" 
                    value="inactive" 
                    checked={status === 'inactive'} 
                    onChange={(e) => setStatus(e.target.value)} 
                  />
                </CCol>
              </fieldset>
             {/* Conditionally render based on the checkbox */}
{subcategory_option === "No" && (
  <>
    <CRow className="mb-3">
      <CFormLabel htmlFor="attributeType" className="col-sm-2 col-form-label">Attribute Type</CFormLabel>
      <CCol sm={8}>
        <CFormSelect
          id="attributeType"
          value={selectedAttributeType}
          onChange={handleAttributeTypeChange}
        >
          <option value="">Choose an attribute type</option>
          {attributeTypes.map((type) => (
            <option key={type.att_type} value={type.att_type}>{type.att_type}</option>
          ))}
        </CFormSelect>
      </CCol>
    </CRow>
    
    <CRow className="mb-3">
      <CFormLabel htmlFor="attribute" className="col-sm-2 col-form-label">Attribute</CFormLabel>
      <CCol sm={8}>
        <CFormSelect 
          id="attribute" 
          value={selectedAttribute} 
          onChange={handleAttributeChange}
        >
          <option value="">Choose an attribute</option>
          {attributes.map((attr) => (
            <option key={attr.attribute_name} value={attr.attribute_name}>{attr.attribute_name}</option>
          ))}
        </CFormSelect>
      </CCol>
    </CRow>

    {/* Display "No record found" if selectedAttributeType is set and no variations are found */}
    {selectedAttributeType && selectedAttribute && variations.length === 0 && (
      <div className="text-center text-muted mt-3">No record found</div>
    )}

    {/* Render Table if there are variations */}
    {variations.length > 0 && (
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Sr#.</CTableHeaderCell>
            <CTableHeaderCell>Size</CTableHeaderCell>
            <CTableHeaderCell>Symbol</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {variations.map((variation, index) => (
            <CTableRow key={variation.id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{variation.variation_name}</CTableDataCell>
              <CTableDataCell>{variation.symbol}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    )}
  </>
)}

<CButton type="submit" color="primary">{id ? 'Update Category' : 'Add Category'}</CButton>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddCategory;