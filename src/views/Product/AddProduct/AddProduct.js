import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from 'axios';
import Select from 'react-select';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';




const AddProduct = () => {
  const initialFormData = {
    product_name: '',
    sku: '',
    season: '',
    description: '',
    color: [],
    size: [],
    attribute: [],
    variations: [],
    cost_price: '',
    selling_price: '',
    discount_price: '',
    wholesale_price: '',
    retail_price: '',
    token_price: '',
    outlet: 1,
    category: '',
    sub_category : '',
    brand: '', 
  };
  

  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();
  const [headCategories, setHeadCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [productList, setProductList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [selectedHeadCategory, setSelectedHeadCategory] = useState('');
const [selectedParentCategory, setSelectedParentCategory] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [selectedsubCategory, setSelectedsubCategory] = useState('');
const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({})
  //const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedBrand, setSelectedBrand] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const [isCategoryDialogOpen, setCategoryDialogOpen] = React.useState(false);
  
  

useEffect(() => {
  if (selectedCategory) {
    fetchAttributes(selectedCategory, selectedsubCategory); // Fetch attributes when category or subcategory is selected
  }
}, [selectedCategory, selectedsubCategory]); // Re-fetch when either category or subcategory changes

const fetchAttributes = async (categoryId, subCategoryId) => {
  if (!categoryId) {
    console.error('Category ID is undefined or null');
    return; // Prevent making the request if categoryId is invalid
  }

  // Use the appropriate URL based on whether subCategoryId is provided
  const url = subCategoryId
    ? `http://16.171.145.107/pos/products/fetch_subcategories/${encodeURIComponent(subCategoryId)}`
    : `http://16.171.145.107/pos/products/fetch_categories/${encodeURIComponent(categoryId)}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // Transform data for multi-select dropdown
    const options = data.map((item) => ({
      value: item.attribute,
      label: item.attribute,
      variations: item.variation, // Optional: Handle variations if needed
    }));

    setAttributes(options); // Populate attributes dropdown
  } catch (error) {
    console.error('Error fetching attributes:', error);
  }
};
const handleTabChange = (tabIndex) => {
  if (tabIndex === 1 && !selectedCategory) {
    openCategoryDialog();
    return;
  }

  if (tabIndex === 0 && activeTab === 1) {
    // Open confirmation dialog when going back from "Color" tab to "General"
    setNextTab(tabIndex);
    setIsDialogOpen(true);
  } else {
    // Directly change the tab if no confirmation is needed
    setActiveTab(tabIndex);
  }
};

const handleDialogClose = (confirm) => {
  setIsDialogOpen(false);
  if (confirm) {
    setActiveTab(nextTab); // Switch to the previously saved tab index
  }
};
  

// Handle attribute selection
const handleAttributeChange = (selectedOptions) => {
  // Set selected attributes (multi-select options)
  setSelectedAttributes(selectedOptions || []);

  // Extract variations for the selected attributes (assumes `variations` is an array in each option)
  const selectedVariations = selectedOptions
    ? selectedOptions.map((option) => ({
        attribute: option.label,  // Store the attribute name
        variations: option.variations,  // Store the variations for this attribute
      }))
    : [];

  // Update variations state based on the selected attributes
  setVariations(selectedVariations);
  console.log("selectedVariations", selectedVariations);
  console.log("selectedOptions", selectedOptions);
};

// Handle variation selection for each attribute
const handleVariationChange = (e, attribute) => {
  const { value, checked } = e.target;  // Extract variation and checked state

  // Update selected variations for the corresponding attribute
  setSelectedVariations((prevState) => {
    // Initialize variations for this attribute if not already present
    const updatedVariations = prevState[attribute] || [];

    if (checked) {
      // Add variation if it's checked
      updatedVariations.push(value);
    } else {
      // Remove variation if it's unchecked
      const index = updatedVariations.indexOf(value);
      if (index > -1) updatedVariations.splice(index, 1); // Remove from array
    }

    // Return the updated state with variations for this attribute
    return { ...prevState, [attribute]: updatedVariations };
  });
};


useEffect(() => {
  fetchHeadCategories();
}, []);

// Fetch Head Categories
const fetchHeadCategories = async () => {
  try {
    const response = await axios.get('http://16.171.145.107/pos/products/add_head_category');
    setHeadCategories(response.data);
  } catch (error) {
    console.error('Error fetching head categories:', error);
    //setError('Failed to load head categories. Please try again later.');
  }
  
}; 

const handleHeadCategoryChange = async (e) => {
  const headCategoryId = e.target.value; // This will now hold the numeric ID
  console.log('Selected Head Category ID:', headCategoryId); // Logs the correct ID

  setSelectedHeadCategory(headCategoryId); // Save selected head category

  // Reset dependent dropdowns
  setParentCategories([]);
  setCategories([]);
  setSubCategories([]);
  setSelectedCategory('');
  setSelectedParentCategory('');
  setSelectedsubCategory('');

  if (headCategoryId) {
    try {
      const response = await axios.get(
        `http://16.171.145.107/pos/products/fetch_head_to_parent_category/${headCategoryId}/`
      );
      console.log('Parent Categories:', response.data);
      setParentCategories(response.data); // Populate parent categories
    } catch (error) {
      console.error(
        `Error fetching parent categories for Head Category ID: ${headCategoryId}`,
        error
      );
      // Optional: Display error message to user
    }
  }
};


useEffect(() => {
  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/products/add_brand');
      const brandsData = response.data.results || [];
      setBrands(Array.isArray(brandsData) ? brandsData : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  fetchBrands();
}, []);


// Fetch Categories based on selected Parent Category
const handleParentCategoryChange = async (e) => {
  const parentCategoryId = e.target.value;

  if (!parentCategoryId) {
    console.error('Parent Category ID is missing!');
    return; // Prevent making the request if parentCategoryId is invalid
  }

  setSelectedParentCategory(parentCategoryId); // Save selected parent category
  setCategories([]); // Reset categories and subcategories
  setSubCategories([]); 
  setSelectedCategory('');
  setSelectedsubCategory('');
  setAttributes([]); // Reset attributes

  try {
    const response = await axios.get(
      `http://16.171.145.107/pos/products/fetch_parent_to_category/${encodeURIComponent(parentCategoryId)}/`
    );
    setCategories(response.data); // Populate categories
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// Fetch Subcategories based on selected Category
const handleCategoryChange = async (e) => {
  const categoryId = e.target.value;
  console.log({categoryId})
  setFormData((prev) => ({
    ...prev,
    category: categoryId, // Update category in formData
  }));
  // console.log("W",formData )
  // console.log("W")
  
  if (!categoryId) {
    console.error('Category ID is missing!');
    return;
  }

  setSelectedCategory(categoryId); // Save selected category
  setSubCategories([]); // Reset subcategories
  setSelectedsubCategory('');
  setAttributes([]); // Reset attributes

  try {
    const response = await axios.get(
      `http://16.171.145.107/pos/products/fetch_category_to_sub_category/${encodeURIComponent(categoryId)}/`
    );
    setSubCategories(response.data); // Populate subcategories

    // Fetch related attributes dynamically for the selected category
    fetchAttributes(categoryId, ''); // Pass categoryId and empty subcategoryId to fetch category-specific attributes
  } catch (error) {
    console.error('Error fetching subcategories or attributes:', error);
  }
};

const handleSubCategoryChange = async (e) => {
  const subCategoryId = e.target.value;
  
  if (!subCategoryId) {
    console.error('Subcategory ID is missing!');
    return;
  }

  setSelectedsubCategory(subCategoryId); // Save selected subcategory
  console.log()
  setFormData(prevData => ({
    ...prevData,
    sub_category : subCategoryId

  }));
  setAttributes([]); // Reset attributes

  // Fetch attributes related to the selected subcategory
  console.log(formData)
  fetchAttributes('', subCategoryId); // Pass empty categoryId and selected subcategoryId to fetch subcategory-specific attributes
};


// Helper Function to Reset Dependent Dropdowns
const resetDependentDropdowns = () => {
  setParentCategories([]);
  setCategories([]);
  setSubCategories([]);
  setSelectedCategory('');
  setSelectedParentCategory('');
  setSelectedsubCategory('');
};



  const colorOptions = [
    { value: 'Almond', label: 'Almond' },
    { value: 'Angoori', label: 'Angoori' },
    { value: 'Baby blue', label: 'Baby blue' },
    { value: 'Baby pink', label: 'Baby pink' },
    { value: 'Beige', label: 'Beige' },
    { value: 'Biscuit', label: 'Biscuit' },
    { value: 'Black', label: 'Black' },
    { value: 'Bottle green', label: 'Bottle green' },
    { value: 'Bronze brown', label: 'Bronze brown' },
    { value: 'Burgundy', label: 'Burgundy' },
    { value: 'Camel', label: 'Camel' },
    { value: 'Caramel', label: 'Caramel' },
    { value: 'Champagne', label: 'Champagne' },
    { value: 'Violet', label: 'Violet' },
    { value: 'White', label: 'White' },
  ];

  const sizeOptions = [
    { value: 'S', label: 'S' },
    { value: 'XS', label: 'XS' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
  ];

  // const BASE_URL = 'http://16.171.145.107/pos';

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const [headResponse, parentResponse, brandResponse] = await Promise.all([
          axios.get('http://16.171.145.107/pos/products/add_head_category'),
          axios.get('http://16.171.145.107/pos/products/add_parent_category/'),
          
          axios.get('http://16.171.145.107/pos/products/add_brand')
        ]);
        
        //const brandsData = brandResponse.data.results || [];
        // Set states with fetched data
        setBrands(
          Array.isArray(brandResponse.data.results)
            ? brandResponse.data.results
            : []
        );
        setHeadCategories(headResponse.data);
        setParentCategories(parentResponse.data);
        
       
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchProductList();
    // fetchSubCategories();
    // fetchParentCategories();
    // fetchCategories();
    
  }, []);
  
  const fetchProductList = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/products/add_temp_product');
      setProductList(response.data);  
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Function to fetch outlets from API
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await axios.get("http://16.171.145.107/pos/products/fetch_all_outlet/");
        setOutlets(response.data); // Assuming the response data is an array
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };

    fetchOutlets();
  }, []);
  
  


  const handleMultiSelectChange = (selectedOptions, name) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prevData => ({
      ...prevData,
      [name]: values,
    }));
  };
  
  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  
  
   
  };

  const handleBrandChange = (e) => {
    const selectedBrandId = e.target.value; // Get selected brand ID
    setSelectedBrand(selectedBrandId); // Update selectedBrand state
    setFormData((prevData) => ({
      ...prevData,
      brand: selectedBrandId, // Store brand ID in formData
    }));
    console.log(selectedBrandId)
  };


  const handleAdd = async (e) => {
  e.preventDefault();

  // Manually format color as a string (e.g., "[ 'Baby pink' ]")
  const colorString = `[ '${formData.color.join("', '")}' ]`;

  const variationsFormatted = Object.keys(selectedVariations).map((attribute) => {
    return selectedVariations[attribute]; // Wrap each selection in an array
  });


  const newProduct = {
    product_name: formData.product_name,
    sku: formData.sku,
    season: formData.season,
    description: formData.description,
    color: colorString,  // color as a string (e.g., "[ 'Baby blue', 'Baby pink' ]")
    attribute: formData.attribute,  // Selected attributes
    variations: JSON.stringify(variationsFormatted), // Variations formatted as array of arrays
    cost_price: formData.cost_price,
    selling_price: formData.selling_price,
    discount_price: formData.discount_price,
    wholesale_price: formData.wholesale_price,
    retail_price: formData.retail_price,
    token_price: formData.token_price,
    outlet: formData.outlet,
    category: selectedCategory,
    sub_category: selectedsubCategory,
    brand: selectedBrand, // This will send the brand id as "3", "4", etc.
  };
    try {
      const response = await axios.post('http://16.171.145.107/pos/products/add_temp_product', newProduct);
      if (response.status === 200 || response.status === 201) {
        alert('Product added successfully!');
        fetchProductList();
        resetForm();
      } else {
        alert('Failed to add the product. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product.');
    }
  };
  
  
  

  
const handleEdit = async (id,e) => {
 
  const productToEdit = productList.find(product => product.id === id);
  if (productToEdit) {
    setFormData({
      product_name: productToEdit.product_name || '',
      outlet_name: productToEdit.outlet_name || 'Fazal Sons',
      sku: productToEdit.sku || '',
      head_category: productToEdit.head_category || '',
      parent_category: productToEdit.parent_category || '',
      category: productToEdit.category || '',
      season: productToEdit.season || '',
      description: productToEdit.description || '',
      color: productToEdit.color ? productToEdit.color.split(',') : [],
      cost_price: productToEdit.cost_price || '',
      selling_price: productToEdit.selling_price || '',
      discount_price: productToEdit.discount_price || '',
      wholesale_price: productToEdit.wholesale_price || '',
      retail_price: productToEdit.retail_price || '',
      token_price: productToEdit.token_price || '',
      brand_name: productToEdit.brand_name || '',
    });
    
    setEditMode(true);
    
    setEditProductId(id); 
    e.preventDefault();
    
  } else {
    console.error("Product not found:", id);
  }
};


const handleUpdate = async () => {
  if (editProductId) {
    const updatedProductData = {
      ...formData,
      color: formData.color.join(','), 
      size: formData.size.join(','),   
      used_for_inventory: formData.used_for_inventory ? "Yes" : "No",  
    };

    try {
      const response = await axios.put(`http://16.171.145.107/pos/products/action_temp_product/${editProductId}/`, updatedProductData); 
      if (response.status === 200 || response.status === 201) {
        const updatedProductList = productList.map((product) =>
          product.id === editProductId
            ? { ...product, ...updatedProductData }
            : product
        );
        setProductList(updatedProductList);
        
        // Success Toast
        toast.success('Product updated successfully!');
      } else {
        // Failure Toast
        toast.error('Failed to update the product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Error Toast
      toast.error('An error occurred while updating the product.');
    }
  }
  resetForm(); 
};

  
const handleDelete = async (id) => {
  try {
    const response = await axios.delete(`http://16.171.145.107/pos/products/action_temp_product/${id}/`);
    if (response.status === 200 || response.status === 204) {
      setProductList(prevList => prevList.filter((product) => product.id !== id));
      alert('Product deleted successfully!');
    } else {
      console.error('Failed to delete the product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting the product. Please try again.');
  }
};


const resetForm = () => {
  setFormData({
    
    outlet_name: 'Fazal Sons',
    sku: '',
    head_category: '',
    parent_category: '',
    category: '',
    sub_category: '',
    season: '',
    description: '',
    color: [],
    size: [],
    used_for_inventory: false,
    cost_price: '',
    selling_price: '',
    discount_price: '',
    wholesale_price: '',
    retail_price: '',
    token_price: '',
    brand_name: '',
  });
  setEditMode(false);
  setEditProductId(null);
};

const handlePublish = async () => {
  console.log('Publishing with data:', formData);
 
 

  try {
    const response = await axios.post('http://16.171.145.107/pos/products/add_product');
    if (response.status === 201 || response.status === 200) {
      alert('Product published successfully!');
      history.push('/Product/AllProducts'); 
    } else {
      alert('Failed to publish the product. Please try again.');
    }
  } catch (error) {
    console.error('Error publishing product:', error);
    alert('An error occurred while publishing the product.');
  }
};


const openCategoryDialog = () => setCategoryDialogOpen(true);
const closeCategoryDialog = () => setCategoryDialogOpen(false);




  return (
    <div className="add-product-form">
    <h2>Product Information</h2>

    <div style={{ marginBottom: "16px" }}> {/* Add space below the label and input */}
  <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
    Product Name *
  </label>
  <input
    type="text"
    name="product_name"
    value={formData.product_name}
    onChange={handleChange}
    required
    style={{
      width: "100%",       // Make input full width (optional)
      padding: "8px",      // Add padding for better UX
      fontSize: "16px",    // Adjust font size
      border: "1px solid #ccc", // Add a border
      borderRadius: "4px", // Add slight rounding to corners
    }}
  />
</div>


    {/* Tabs */}
    <Paper square>
        <Tabs
          value={activeTab}
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, newValue) => handleTabChange(newValue)}
          centered
        >
          <Tab label="General" />
          <Tab label="Color, Sizes & Pricing" />
        </Tabs>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to go back to the "General" tab? Unsaved changes might be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>


      {/* Category Dialog */}
{isCategoryDialogOpen && (
  <Dialog open={isCategoryDialogOpen} onClose={closeCategoryDialog}>
    <DialogTitle>Category Required</DialogTitle>
    <DialogContent>      <DialogContentText>Please select a category or subcategory before proceeding.</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={closeCategoryDialog} color="primary">OK</Button>
    </DialogActions>
  </Dialog>
)}


      <div className="form-container">
        <form>
          {activeTab === 0 && (
            <div className="form-column">
               {/* <label style={{ fontWeight: "bold" }}>
                Product Name *
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                />
              </label> */}
              <label style={{ fontWeight: "bold" }}>
      Outlet Name:
      <select
        name="outlet_name"
        value={formData.outlet_name}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Select Outlet
        </option>
        {outlets.map((outlet, index) => (
          <option key={index} value={outlet.outlet_name}>
            {outlet.outlet_name}
          </option>
        ))}
      </select>
    </label>
              <label>
  {/* SKU: */}
  <input
    type="text"
    name="sku"
    value={formData.sku}
    onChange={handleChange}
    required
    style={{ display: 'none' }} // Corrected style syntax
  />
</label>

             {/* Head Category Dropdown */}
      
        {/* Head Category Dropdown */}
        <label style={{ fontWeight: "bold" }}> Head Category *</label>
<select onChange={handleHeadCategoryChange}>
  <option value="">Select Head Category</option>
  {headCategories.map((headCategory) => (
    <option key={headCategory.id} value={headCategory.id}>
      {headCategory.hc_name} {/* Display the name but pass the ID */}
    </option>
  ))}
</select>
      
{/* Parent Category Dropdown */}
<label style={{ fontWeight: "bold" }}> Parent Category *</label>
<select value={selectedParentCategory}
  onChange={handleParentCategoryChange}
  disabled={!selectedHeadCategory}>
  <option value="">Select Parent Category</option>
  {Array.isArray(parentCategories) && parentCategories.map(parentCategory => (
    <option key={parentCategory.id} value={parentCategory.id}>
      {parentCategory.pc_name}
    </option>
  ))}
</select>

{/* Category Dropdown */}
<label style={{ fontWeight: "bold" }}> Category *</label>
<select value={selectedCategory}
  onChange={handleCategoryChange}
  disabled={!selectedParentCategory}>
  <option value="">Select Category</option>
  {Array.isArray(categories) && categories.map(category => (
    <option key={category.id} value={category.id}>
      {category.category_name}
    </option>
  ))}
</select>

{/* Subcategory Dropdown */}

<label style={{ fontWeight: "bold" }}> Subcategory *</label>
<select value={selectedsubCategory}
  onChange={handleSubCategoryChange}
  disabled={!selectedCategory}>
  <option value="">Select Subcategory</option>
  {Array.isArray(subcategories) && subcategories.map(subCategory => (
    <option key={subCategory.id} value={subCategory.id}>
      {subCategory.sub_category_name}
    </option>
  ))}
</select>

      

<label style={{ fontWeight: "bold" }}> Brands (optional)</label>
    <select value={selectedBrand} 
    onChange={handleBrandChange}>
      <option value="">Select a Brand</option>
      {/* {brands.map((branddata) => ( */}
        {Array.isArray(brands) && brands.map(branddata => (
        <option key={branddata.id} value={branddata.id}>
          {branddata.brand_name}
          
        </option>
      ))}
    </select>

    <label style={{ fontWeight: "bold" }}>
                Season (optional)
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                >
                  <option value="">Select Season</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                  <option value="Spring">Spring</option>
                  <option value="Autumn">Autumn</option>
                </select>
              </label>
              <label style={{ fontWeight: "bold" }}>
                Description (optional)
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-column">
              {/* Color and Size Inputs */}
              <label style={{ fontWeight: "bold" }}>
  Color (optional)
  <Select
    isMulti
    options={colorOptions}
    value={formData.color.map(c => ({ value: c, label: c }))} // Pre-fill the select with the selected values
    onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'color')}
  />


</label>

<label style={{ fontWeight: "bold" }}>Select Attributes * </label>
<Select
  isMulti
  options={attributes}
  onChange={handleAttributeChange}
  placeholder="Select attributes..."
/>

{/* Display Variations */}
{variations.length > 0 && (
  <div>
    <h3>Variations</h3>
    {variations?.map(({ attribute, variations }) => (
  <div key={attribute} style={{ marginTop: '20px' }}>
    <h5>{attribute}</h5>
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {variations?.map((variations) => (
        <label key={variations} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name={attribute}
            value={variations}
            onChange={(e) => handleVariationChange(e, attribute)} 
          />
          {variations}
        </label>
      ))}
    </div>
  </div>
))}


  </div>
)}


    
<label style={{ fontWeight: "bold" }}>
                Cost Price * 
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label style={{ fontWeight: "bold" }}>
                Selling Price * 
                <input
                  type="number"
                  name="selling_price"
                  value={formData.selling_price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label style={{ fontWeight: "bold" }}>
                Discount Price (Optional)
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                />
              </label>
              <label style={{ fontWeight: "bold" }}>
                Wholesale Price (Optional)
                <input
                  type="number"
                  name="wholesale_price"
                  value={formData.wholesale_price}
                  onChange={handleChange}
                />
              </label>
              <label style={{ fontWeight: "bold" }}>
                Retail Price (Optional)
                <input
                  type="number"
                  name="retail_price"
                  value={formData.retail_price}
                  onChange={handleChange}
                />
              </label>
              <label style={{ fontWeight: "bold" }}>
                Token Price (Optional)
                <input
                  type="number"
                  name="token_price"
                  value={formData.token_price}
                  onChange={handleChange}
                />
              </label>
              {/* <button type="button" onClick={handleAdd}>Add Product</button> */}
              <button type="button" onClick={editMode ? handleUpdate : handleAdd}> 
    {editMode ? 'Update Product' : 'Add Product'}
  </button>

              {/* Product List Table */}
              <table className="product-list-table">
                <thead>
                  <tr>
                    <th>Sr.#</th>
                    <th>Color</th>
                    <th>Cost</th>
                    <th>Selling</th>
                    <th>Discount</th>
                    <th>Wholesale</th>
                    <th>Retail</th>
                    <th>Token</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product,index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      
                      <td>{product.color}</td>
                      
                      <td>{product.cost_price}</td>
                      <td>{product.selling_price}</td>
                      <td>{product.discount_price}</td>
                      <td>{product.wholesale_price}</td>
                      <td>{product.retail_price}</td>
                      <td>{product.token_price}</td>
                      <td>
                        <button onClick={() => handleEdit(product.id)}>Edit</button>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
  <button type="button" onClick={handlePublish}>Publish</button>
</div>
            </div>
          )}
        </form>
      </div>
    

    </div>
    
  );
  

};

export default AddProduct;
