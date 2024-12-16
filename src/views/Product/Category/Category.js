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
import './Loader.css';

const Loader = () => {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
      <div className="loader-overlay">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
    </div>
  );
};


const Category = () => {
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchParentCategories();
  }, []);


  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://195.26.253.123/pos/products/add_category');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories.');
      setLoading(false);
    }
  }

    const fetchParentCategories = async () => {
      try {
        const response = await axios.get('http://195.26.253.123/pos/products/add_parent_category'); // Replace with your API endpoint for parent categories
        setParentCategories(response.data);
        console.log('Fetched Parent Categories:', response.data);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
      }
    };

    // fetchCategories();
    // fetchParentCategories();


    const handleDelete = async (id) => {
      console.log({id})
      if (window.confirm('Are you sure you want to delete this Category?')) {
        try {
          await axios.delete(`http://195.26.253.123/pos/products/action_category/${id}/`);
          alert('Category deleted successfully!');
          fetchCategories(); 
        } catch (error) {
          console.error('Error deleting Category:', error);
          alert('Failed to delete Category.');
        }
      }
    };

    const handleEdit = (id) => {
      console.log("Editing Category with ID:", id);
      navigate(`/Product/AddCategory/${id}`); 
    };

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
            {loading && <Loader/>}
            {loading && <p>Loading variations...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
            <CTable striped>
              <thead>
                <CTableRow>
                <CTableHeaderCell>Sr.#</CTableHeaderCell>
                  <CTableHeaderCell>Parent Category</CTableHeaderCell>
                  <CTableHeaderCell>Category Name</CTableHeaderCell>
                  <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </thead>
              <CTableBody>
                {categories.map((category,index) => (
                  <CTableRow key={category.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{getParentCategoryName(category.pc_name)}</CTableDataCell>
                    <CTableDataCell>{category.category_name}</CTableDataCell>
                    <CTableDataCell>{category.symbol}</CTableDataCell>
                    <CTableDataCell>{category.description}</CTableDataCell>
                    <CTableDataCell>{category.status}</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="warning" size="sm" onClick={() => handleEdit(category.id)}>Edit</CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(category.id)} className="ms-2">Delete</CButton>
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

export default Category;