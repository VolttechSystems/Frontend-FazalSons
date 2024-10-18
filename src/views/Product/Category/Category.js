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

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]); // State for parent categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_category'); // Replace with your API endpoint for categories
        setCategories(response.data);
        console.log('Fetched Categories:', response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchParentCategories = async () => {
      try {
        const response = await axios.get('http://16.170.232.76/pos/products/add_parent_category'); // Replace with your API endpoint for parent categories
        setParentCategories(response.data);
        console.log('Fetched Parent Categories:', response.data);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
      }
    };

    fetchCategories();
    fetchParentCategories();
  }, []);

  const getParentCategoryName = (pc_name) => {
    const parentCategory = parentCategories.find(pc => pc.pc_name === pc_name);
    return parentCategory ? parentCategory.pc_name : 'Parent Category not found';
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Category List</strong>
          </CCardHeader>
          <CCardBody>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/Product/AddCategory">
                <CButton href="#" color="primary" className="me-md-2">Add Category</CButton>
              </Link>
            </div>
            <CTable striped>
              <thead>
                <CTableRow>
                  <CTableHeaderCell>Parent Category</CTableHeaderCell>
                  <CTableHeaderCell>Category Name</CTableHeaderCell>
                  <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </thead>
              <CTableBody>
                {categories.map(category => (
                  <CTableRow key={category.id}>
                    <CTableDataCell>{getParentCategoryName(category.pc_name)}</CTableDataCell>
                    <CTableDataCell>{category.category_name}</CTableDataCell>
                    <CTableDataCell>{category.symbol}</CTableDataCell>
                    <CTableDataCell>{category.description}</CTableDataCell>
                    <CTableDataCell>{category.status}</CTableDataCell>
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

export default Category;
