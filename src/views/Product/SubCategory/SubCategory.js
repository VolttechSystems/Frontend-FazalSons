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
import { Link, useNavigate } from 'react-router-dom';
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

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subCategoriesRes, categoriesRes, parentCategoriesRes] = await Promise.all([
          axios.get('http://16.171.145.107/pos/products/add_subcategory'),
          axios.get('http://16.171.145.107/pos/products/add_category'),
          axios.get('http://16.171.145.107/pos/products/add_parent_category'),
        ]);
        setSubCategories(subCategoriesRes.data);
        setCategories(categoriesRes.data);
        setParentCategories(parentCategoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (categoryName) => {
    const category = categories.find((c) => c.category_name === categoryName);
    return category ? category.category_name : 'Category not found';
  };

  const getParentCategoryName = (parentName) => {
    const parentCategory = parentCategories.find((pc) => pc.pc_name === parentName);
    return parentCategory ? parentCategory.pc_name : 'Parent Category not found';
  };

  // const fetchSubcategoryById = async (id) => {
  //   try {
  //     const response = await axios.get(`http://16.171.145.107/pos/products/action_subcategory/${id}/`); // Corrected API path
  //     const subCategoryData = response.data;
  //     navigate('/Product/AddSubCategory', { state: { subCategoryData } });
  //   } catch (error) {
  //     console.error('Error fetching subcategory data: ', error);
  //     setError('Failed to fetch subcategory data.');
  //   }
  // };
  

  // Delete subcategory
  const handleDeleteSubcategory = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this subcategory?')) {
        await axios.delete(`http://16.171.145.107/pos/products/action_subcategory/${id}/`);
        setSubCategories(subCategories.filter((subCategory) => subCategory.id !== id));
        alert('Subcategory deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      setError('Failed to delete subcategory.');
    }
  };

  // Edit subcategory - Redirect to edit page or handle update
  const handleEdit = (id) => {
    navigate(`/Product/AddSubCategory/${id}`);  // Directly navigate to the edit page
  };

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Sub Category List</strong>
          </CCardHeader>
          <CCardBody>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/Product/AddSubCategory">
                <CButton color="primary" className="me-md-2">Add Sub Category</CButton>
              </Link>
            </div>
            <CTable striped>
              <thead>
                <CTableRow>
                  <CTableHeaderCell>Sr.#</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Sub Category Name</CTableHeaderCell>
                  <CTableHeaderCell>Short Form/Symbol</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </thead>
              <CTableBody>
                {subCategories.map((subCategory, index) => (
                  <CTableRow key={subCategory.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{getCategoryName(subCategory.category_name)}</CTableDataCell>
                    <CTableDataCell>{subCategory.sub_category_name}</CTableDataCell>
                    <CTableDataCell>{subCategory.symbol}</CTableDataCell>
                    <CTableDataCell>{subCategory.description}</CTableDataCell>
                    <CTableDataCell>{subCategory.status}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        onClick={() => handleEdit(subCategory.id)}
                      >
                        Edit
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleDeleteSubcategory(subCategory.id)}
                      >
                        Delete
                      </CButton>
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

export default SubCategory;
