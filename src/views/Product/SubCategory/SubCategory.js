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

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const Loader = () => {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  };
  

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get('http://16.171.145.107/pos/products/add_subcategory'); 
        setSubCategories(response.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setError('Failed to fetch subcategories.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://16.171.145.107/pos/products/add_category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories.');
      }
    };

    const fetchParentCategories = async () => {
      try {
        const response = await axios.get('http://16.171.145.107/pos/products/add_parent_category');
        setParentCategories(response.data);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
        setError('Failed to fetch parent categories.');
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchSubCategories(), fetchCategories(), fetchParentCategories()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getCategoryName = (categoryName) => {
    const category = categories.find(c => c.category_name === categoryName);
    return category ? category.category_name : 'Category not found';
  };

  const getParentCategoryName = (parentName) => {
    const parentCategory = parentCategories.find(pc => pc.pc_name === parentName);
    return parentCategory ? parentCategory.pc_name : 'Parent Category not found';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Sub Category List</strong>
          </CCardHeader>
          {loading && <Loader/>}
          <CCardBody>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/Product/AddSubCategory">
                <CButton href="#" color="primary" className="me-md-2">Add Sub Category</CButton>
              </Link>
            </div>
            <CTable striped>
              <thead>
                <CTableRow>
                  <CTableHeaderCell>Parent Category</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Sub Category Name</CTableHeaderCell>
                  <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </thead>
              <CTableBody>
                {subCategories.map(subCategory => (
                  <CTableRow key={subCategory.id}>
                    <CTableDataCell>{getParentCategoryName(subCategory.parent_name)}</CTableDataCell>
                    <CTableDataCell>{getCategoryName(subCategory.category_name)}</CTableDataCell>
                    <CTableDataCell>{subCategory.sub_category_name}</CTableDataCell>
                    <CTableDataCell>{subCategory.symbol}</CTableDataCell>
                    <CTableDataCell>{subCategory.description}</CTableDataCell>
                    <CTableDataCell>{subCategory.status}</CTableDataCell>
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

export default SubCategory;
