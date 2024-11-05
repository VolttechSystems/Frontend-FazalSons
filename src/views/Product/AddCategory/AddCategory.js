

// import React, { useEffect, useState } from 'react';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CForm,
//   CFormCheck,
//   CFormInput,
//   CFormLabel,
//   CRow,
//   CFormSelect,
// } from '@coreui/react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import axios from 'axios';

// const AddCategory = () => {
//   const [category_name, setCategoryName] = useState('');
//   const [symbol, setSymbol] = useState('');
//   const [subcategory_option, setSubcategoryOption] = useState("No");
//   const [description, setDescription] = useState('');
//   const [status, setStatus] = useState('active');
//   const [parentCategories, setParentCategories] = useState([]);
//   const [selectedParentCategory, setSelectedParentCategory] = useState('');
//   const [selectedAttribute, setSelectedAttribute] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Fixed list of attributes for the dropdown
//   const fixedAttributes = [
//     { value: 'Size', label: 'Size' },
//     { value: 'Color', label: 'Color' },
//     { value: 'Material', label: 'Material' },
//     { value: 'Brand', label: 'Brand' },
//   ];

//   useEffect(() => {
//     const fetchParentCategories = async () => {
//       try {
//         const response = await axios.get('http://16.171.145.107/pos/products/add_parent_category');
//         setParentCategories(response.data);
//       } catch (error) {
//         console.error('Error fetching parent categories:', error);
//         setErrorMessage('Failed to fetch parent categories.');
//       }
//     };

//     if (id) {
//       fetchCategoryDetails(id);
//     }

//     fetchParentCategories();
//   }, [id]);

//   const fetchCategoryDetails = async () => {
//     try {
//       const response = await axios.get(`http://16.171.145.107/pos/products/action_category/${id}/`);
//       const category = response.data;
//       setCategoryName(category.category_name);
//       setSymbol(category.symbol);
//       setSubcategoryOption(category.subcategory_option);
//       setDescription(category.description);
//       setStatus(category.status);
//       setSelectedParentCategory(category.pc_name);
//       setSelectedAttribute(category.attribute_name || ''); // Set the attribute if available
//     } catch (error) {
//       console.error('Failed to fetch category for editing:', error);
//       setErrorMessage('Failed to load category details.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const categoryData = {
//       category_name: category_name,
//       symbol: symbol,
//       subcategory_option: subcategory_option,
//       description: description,
//       status: status,
//       pc_name: selectedParentCategory,
//       attribute_name: selectedAttribute, // Added attribute field
//     };

//     try {
//       if (id) {
//         await axios.put(`http://16.171.145.107/pos/products/action_category/${id}/`, categoryData);
//         alert('Category updated successfully!');
//       } else {
//         await axios.post('http://16.171.145.107/pos/products/add_category', categoryData);
//         alert('Category added successfully!');
//       }
//       navigate('/Product/Category');
//     } catch (error) {
//       console.error('Error saving the category:', error);
//       setErrorMessage('Error saving the category. Please try again.');
//     }
//   };

//   return (
//     <CRow>
//       <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//         <Link to="/Product/Category">
//           <CButton href="#" color="primary" className="me-md-2">Category List</CButton>
//         </Link>
//       </div>

//       <CCol xs={12}>
//         <CCard className="mb-3">
//           <CCardHeader>
//             <strong>{id ? 'Edit Category' : 'Add Category'}</strong>
//           </CCardHeader>
//           <CCardBody>
//             {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//             <CForm onSubmit={handleSubmit}>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="categoryName" className="col-sm-2 col-form-label">Category Name *</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormInput 
//                     type="text" 
//                     id="category_name" 
//                     value={category_name} 
//                     onChange={(e) => setCategoryName(e.target.value)} 
//                     required 
//                   />
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="symbol" className="col-sm-2 col-form-label">Short Form/Symbol</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormInput 
//                     type="text" 
//                     id="symbol" 
//                     value={symbol} 
//                     onChange={(e) => setSymbol(e.target.value)} 
//                   />
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="subcategoryOption" className="col-sm-2 col-form-label">Subcategory Option</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormCheck 
//                     type="checkbox" 
//                     id="subcategory_option" 
//                     checked={subcategory_option === "Yes"} 
//                     onChange={(e) => setSubcategoryOption(e.target.checked ? "Yes" : "No")} 
//                   />
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="description" className="col-sm-2 col-form-label">Description</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormInput 
//                     type="text" 
//                     id="description" 
//                     value={description} 
//                     onChange={(e) => setDescription(e.target.value)} 
//                   />
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="attribute" className="col-sm-2 col-form-label">Select Attribute</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormSelect
//                     id="attribute"
//                     value={selectedAttribute}
//                     onChange={(e) => setSelectedAttribute(e.target.value)}
//                     required
//                   >
//                     <option value="">Choose an attribute</option>
//                     {fixedAttributes.map((attr) => (
//                       <option key={attr.value} value={attr.value}>{attr.label}</option>
//                     ))}
//                   </CFormSelect>
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="parentCategory" className="col-sm-2 col-form-label">Select Parent Category</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormSelect
//                     id="parentCategory"
//                     value={selectedParentCategory}
//                     onChange={(e) => setSelectedParentCategory(e.target.value)}
//                     required
//                   >
//                     <option value="">Choose a parent category</option>
//                     {parentCategories.map((pc) => (
//                       <option key={pc.pc_name} value={pc.pc_name}>{pc.pc_name}</option>
//                     ))}
//                   </CFormSelect>
//                 </CCol>
//               </CRow>
//               <fieldset className="row mb-3">
//                 <legend className="col-form-label col-sm-2 pt-0">Status</legend>
//                 <CCol sm={8}>
//                   <CFormCheck 
//                     type="radio" 
//                     name="status" 
//                     id="active" 
//                     label="Active" 
//                     value="active" 
//                     checked={status === 'active'} 
//                     onChange={(e) => setStatus(e.target.value)} 
//                   />
//                   <CFormCheck 
//                     type="radio" 
//                     name="status" 
//                     id="inactive" 
//                     label="Inactive" 
//                     value="inactive" 
//                     checked={status === 'inactive'} 
//                     onChange={(e) => setStatus(e.target.value)} 
//                   />
//                   <CFormCheck 
//                     type="radio" 
//                     name="status" 
//                     id="pending" 
//                     label="Pending" 
//                     value="pending" 
//                     checked={status === 'pending'} 
//                     onChange={(e) => setStatus(e.target.value)} 
//                   />
//                 </CCol>
//               </fieldset>
//               <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                 <CButton type="submit" color="primary">{id ? 'Update Category' : 'Add Category'}</CButton>
//               </div>
//             </CForm>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   );
// };

// export default AddCategory;


// import React, { useEffect, useState } from 'react';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CForm,
//   CFormCheck,
//   CFormInput,
//   CFormLabel,
//   CRow,
//   CFormSelect,
// } from '@coreui/react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import axios from 'axios';

// const AddCategory = () => {
//   const [category_name, setCategoryName] = useState('');
//   const [symbol, setSymbol] = useState('');
//   const [subcategory_option, setSubcategoryOption] = useState("No");
//   const [description, setDescription] = useState('');
//   const [status, setStatus] = useState('active');
//   const [parentCategories, setParentCategories] = useState([]);
//   const [selectedParentCategory, setSelectedParentCategory] = useState('');
//   const [selectedAttribute, setSelectedAttribute] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Fixed list of attributes for the dropdown
//   const fixedAttributes = [
//     { value: 'Size', label: 'Size' },
//     { value: 'Color', label: 'Color' },
//     { value: 'Material', label: 'Material' },
//     { value: 'Brand', label: 'Brand' },
//   ];

//   useEffect(() => {
//     const fetchParentCategories = async () => {
//       try {
//         const response = await axios.get('http://16.171.145.107/pos/products/add_parent_category');
//         setParentCategories(response.data);
//       } catch (error) {
//         console.error('Error fetching parent categories:', error);
//         setErrorMessage('Failed to fetch parent categories.');
//       }
//     };

//     if (id) {
//       fetchCategoryDetails(id);
//     }

//     fetchParentCategories();
//   }, [id]);

//   const fetchCategoryDetails = async () => {
//     try {
//       const response = await axios.get(`http://16.171.145.107/pos/products/action_category/${id}/`);
//       const category = response.data;
//       setCategoryName(category.category_name);
//       setSymbol(category.symbol);
//       setSubcategoryOption(category.subcategory_option);
//       setDescription(category.description);
//       setStatus(category.status);
//       setSelectedParentCategory(category.pc_name);
//       setSelectedAttribute(category.attribute_name || ''); // Set the attribute if available
//     } catch (error) {
//       console.error('Failed to fetch category for editing:', error);
//       setErrorMessage('Failed to load category details.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const categoryData = {
//       category_name: category_name,
//       symbol: symbol,
//       subcategory_option: subcategory_option,
//       description: description,
//       status: status,
//       pc_name: selectedParentCategory,
//       attribute_name: selectedAttribute, // Added attribute field
//     };

//     try {
//       if (id) {
//         await axios.put(`http://16.171.145.107/pos/products/action_category/${id}/`, categoryData);
//         alert('Category updated successfully!');
//       } else {
//         await axios.post('http://16.171.145.107/pos/products/add_category', categoryData);
//         alert('Category added successfully!');
//       }
//       navigate('/Product/Category');
//     } catch (error) {
//       console.error('Error saving the category:', error);
//       setErrorMessage('Error saving the category. Please try again.');
//     }
//   };

//   return (
//     <CRow>
//       <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//         <Link to="/Product/Category">
//           <CButton href="#" color="primary" className="me-md-2">Category List</CButton>
//         </Link>
//       </div>

//       <CCol xs={12}>
//         <CCard className="mb-3">
//           <CCardHeader>
//             <strong>{id ? 'Edit Category' : 'Add Category'}</strong>
//           </CCardHeader>
//           <CCardBody>
//             {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//             <CForm onSubmit={handleSubmit}>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="categoryName" className="col-sm-2 col-form-label">Category Name *</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormInput 
//                     type="text" 
//                     id="category_name" 
//                     value={category_name} 
//                     onChange={(e) => setCategoryName(e.target.value)} 
//                     required 
//                   />
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="symbol" className="col-sm-2 col-form-label">Short Form/Symbol</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormInput 
//                     type="text" 
//                     id="symbol" 
//                     value={symbol} 
//                     onChange={(e) => setSymbol(e.target.value)} 
//                   />
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="subcategoryOption" className="col-sm-2 col-form-label">Subcategory Option</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormCheck 
//                     type="checkbox" 
//                     id="subcategory_option" 
//                     checked={subcategory_option === "Yes"} 
//                     onChange={(e) => setSubcategoryOption(e.target.checked ? "Yes" : "No")} 
//                   />
//                 </CCol>
//               </CRow>
//               <CRow className="mb-3">
//                 <CCol sm={{ span: 8, offset: 2 }}>
//                   <CButton color="primary">+</CButton>
//                 </CCol>
//               </CRow>

//               {/* Conditional rendering of attributes dropdown */}
//               {!subcategory_option.includes("Yes") && (
//                 <CRow className="mb-3">
//                   <CFormLabel htmlFor="attribute" className="col-sm-2 col-form-label">Select Attribute</CFormLabel>
//                   <CCol sm={8}>
//                     <CFormSelect
//                       id="attribute"
//                       value={selectedAttribute}
//                       onChange={(e) => setSelectedAttribute(e.target.value)}
//                       required
//                     >
//                       <option value="">Choose an attribute</option>
//                       {fixedAttributes.map((attr) => (
//                         <option key={attr.value} value={attr.value}>{attr.label}</option>
//                       ))}
//                     </CFormSelect>
//                   </CCol>
//                 </CRow>
//               )}
//               <CRow className="mb-3">
//                 <CFormLabel htmlFor="parentCategory" className="col-sm-2 col-form-label">Select Parent Category</CFormLabel>
//                 <CCol sm={8}>
//                   <CFormSelect
//                     id="parentCategory"
//                     value={selectedParentCategory}
//                     onChange={(e) => setSelectedParentCategory(e.target.value)}
//                     required
//                   >
//                     <option value="">Choose a parent category</option>
//                     {parentCategories.map((pc) => (
//                       <option key={pc.pc_name} value={pc.pc_name}>{pc.pc_name}</option>
//                     ))}
//                   </CFormSelect>
//                 </CCol>
//               </CRow>
//               <fieldset className="row mb-3">
//                 <legend className="col-form-label col-sm-2 pt-0">Status</legend>
//                 <CCol sm={8}>
//                   <CFormCheck 
//                     type="radio" 
//                     name="status" 
//                     id="active" 
//                     label="Active" 
//                     value="active" 
//                     checked={status === 'active'} 
//                     onChange={(e) => setStatus(e.target.value)} 
//                   />
//                   <CFormCheck 
//                     type="radio" 
//                     name="status" 
//                     id="inactive" 
//                     label="Inactive" 
//                     value="inactive" 
//                     checked={status === 'inactive'} 
//                     onChange={(e) => setStatus(e.target.value)} 
//                   />
//                   <CFormCheck 
//                     type="radio" 
//                     name="status" 
//                     id="pending" 
//                     label="Pending" 
//                     value="pending" 
//                     checked={status === 'pending'} 
//                     onChange={(e) => setStatus(e.target.value)} 
//                   />
//                 </CCol>
//               </fieldset>
//               <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                 <CButton type="submit" color="primary">{id ? 'Update Category' : 'Add Category'}</CButton>
//               </div>
//             </CForm>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   );
// };

// export default AddCategory;


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
  CTableRow,
  CTableHead,
} from '@coreui/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AddCategory = () => {
  const [category_name, setCategoryName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [subcategory_option, setSubcategoryOption] = useState("No");
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Fixed list of attributes for the dropdown
  const fixedAttributes = [
    { value: 'Size', label: 'Size' },
    { value: 'Color', label: 'Color' },
    { value: 'Material', label: 'Material' },
    { value: 'Brand', label: 'Brand' },
  ];

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

    if (id) {
      fetchCategoryDetails(id);
    }

    fetchParentCategories();
  }, [id]);

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
              <CRow className="mb-3">
                <CFormLabel htmlFor="subcategoryOption" className="col-sm-2 col-form-label">Subcategory Option</CFormLabel>
                <CCol sm={8}>
                  <CFormCheck 
                    type="checkbox" 
                    id="subcategory_option" 
                    checked={subcategory_option === "Yes"} 
                    onChange={(e) => setSubcategoryOption(e.target.checked ? "Yes" : "No")} 
                  />
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
              

              {/* Fixed Attributes Section */}
              {subcategory_option === "No" && (
                <>
                  <hr />
                  <h5><i className="cil-settings"></i> Fixed Attributes</h5>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="attribute" className="col-sm-2 col-form-label">Sizes</CFormLabel>
                    <CCol sm={8}>
                      <CFormSelect
                        id="attribute"
                        value={selectedAttribute}
                        onChange={(e) => setSelectedAttribute(e.target.value)}
                        required
                      >
                        <option value="">Select Size Group</option>
                        {fixedAttributes.map((attr) => (
                          <option key={attr.value} value={attr.value}>{attr.label}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>

                  {/* Table for Fixed Attributes */}
                  <CTable striped>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Sr. #</CTableHeaderCell>
                        <CTableHeaderCell>Size</CTableHeaderCell>
                        <CTableHeaderCell>Short Form / Symbol</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {/* Placeholder rows - populate with dynamic data if available */}
                      <CTableRow>
                        <CTableHeaderCell>1</CTableHeaderCell>
                        <CTableHeaderCell>{selectedAttribute}</CTableHeaderCell>
                        <CTableHeaderCell>{symbol}</CTableHeaderCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </>
              )}

              

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton type="submit" color="primary">{id ? 'Update Category' : 'Add Category'}</CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddCategory;
