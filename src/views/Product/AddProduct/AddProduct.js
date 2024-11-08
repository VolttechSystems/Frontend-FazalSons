import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from 'axios';
import Select from 'react-select';



const AddProduct = () => {
  const initialFormData = {
    product_name: '',
    outlet_name: 'Fazal Sons',
    sku: '',
    head_category: '',
    parent_category: '',
    sub_category: '',  
    category: '',
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
    brand_name: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState(0);
  const [headCategories, setHeadCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [productList, setProductList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

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
       
        const [headResponse, parentResponse, categoryResponse, brandResponse] = await Promise.all([
          axios.get('http://16.171.145.107/pos/products/add_head_category'),
          axios.get('http://16.171.145.107/pos/products/add_parent_category/'),
          axios.get('http://16.171.145.107/pos/products/add_category'),
          axios.get('http://16.171.145.107/pos/products/add_brand')
        ]);
        
        const brandsData = brandResponse.data.results || [];
        setBrands(Array.isArray(brandsData) ? brandsData : []); // Ensure you are setting the correct data
        setHeadCategories(headResponse.data);
        setParentCategories(parentResponse.data);
        setCategories(categoryResponse.data);
       
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchProductList();
    fetchSubCategories();
  }, []);
  
  const fetchProductList = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/products/add_temp_product');
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/products/add_subcategory');
      setSubCategories(response.data || []);  
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMultiSelectChange = (selectedOptions, name) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prevData => ({
      ...prevData,
      [name]: values,
    }));
  };
  



const handleAdd = () => {
  const newProduct = {
    id: new Date().getTime(), 
    ...formData,
    color: formData.color.join(','), 
    size: formData.size.join(','), 
  };

  setProductList([...productList, newProduct]);
  resetForm(); 
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
      size: productToEdit.size ? productToEdit.size.split(',') : [],
      used_for_inventory: productToEdit.used_for_inventory || false,
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


const handleUpdate = () => {
  if (editProductId) {
    const updatedProductList = productList.map((product) =>
      product.id === editProductId
        ? {
            ...product,
            ...formData,
            color: formData.color.join(','), 
            size: formData.size.join(','), 
          }
        : product
    );

    setProductList(updatedProductList);
    // resetForm(); 
  }
};

 
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://16.171.145.107/pos/products/action_temp_product/${id}/`);
      setProductList(prevList => prevList.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Function to reset the form.
const resetForm = () => {
  setFormData({
    product_name: '',
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
 
  // const formDataToSend = {
  //   ...formData,
  //   product_name:formData.product_name,
  //   season:formData.season,
  //   color: formData.color.join(','), 
  //   size: formData.size.join(','),   
  //   used_for_inventory: formData.used_for_inventory ? 'true' : 'false', 
  // };

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


  return (
    <div className="add-product-form">
      <h2>Product Information</h2>
      <h2>{editMode ? 'Edit Product' : ''}</h2>
    
      <Paper square>
        <Tabs
          value={activeTab}
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="General" />
          <Tab label="Color, Sizes & Pricing" />
        </Tabs>
      </Paper>

      <div className="form-container">
        <form>
          {activeTab === 0 && (
            <div className="form-column">
              <label>
                Product Name:
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Outlet Name:
                <select
                  name="outlet_name"
                  value={formData.outlet_name}
                  onChange={handleChange}
                  required
                >
                  <option value="Fazal Sons">Fazal Sons</option>
                </select>
              </label>
              <label>
                SKU:
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Head Category:
                <select
                  name="head_category"
                  value={formData.head_category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Head Category</option>
                  {headCategories.map((item) => (
                    <option key={item.hc_name} value={item.hc_name}>{item.hc_name}</option>
                  ))}
                </select>
              </label>
              <label>
                Parent Category:
                <select
                  name="parent_category"
                  value={formData.parent_category}
                  onChange={handleChange}
                >
                  <option value="">Select Parent Category</option>
                  {parentCategories.map((item) => (
                    <option key={item.pc_name} value={item.pc_name}>{item.pc_name}</option>
                  ))}
                </select>
            </label>

             {/* Subcategory Dropdown */}
             <label>
                Sub Category:
                <select
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleChange}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((item) => (
                    <option key={item.sub_category_name} value={item.sub_category_name}>
                      {item.sub_category_name}
                    </option>
                  ))}
                </select>
              </label>


              <label>
                Category:
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((item) => (
                    <option key={item.category_name} value={item.category_name}>{item.category_name}</option>
                  ))}
                </select>
              </label>
              <label>
              Brands:
              <select>
    {brands.map(brand => (
        <option key={brand.id} value={brand.id}>
            {brand.brand_name} {/* Adjust according to your data structure */}
        </option>
    ))}
</select>
              </label>
              <label>
                Season:
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
              <label>
                Description:
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
              <label>
  Color:
  <Select
    isMulti
    options={colorOptions}
    value={formData.color.map(c => ({ value: c, label: c }))} // Pre-fill the select with the selected values
    onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'color')}
  />
</label>
<label>
  Size:
  <Select
    isMulti
    options={sizeOptions}
    value={formData.size.map(s => ({ value: s, label: s }))} // Pre-fill the select with the selected values
    onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'size')}
  />
</label>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="used_for_inventory"
                  checked={formData.used_for_inventory}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span>Used for Inventory</span>
              </label>
              <label>
                Cost Price:
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Selling Price:
                <input
                  type="number"
                  name="selling_price"
                  value={formData.selling_price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Discount Price:
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                />
              </label>
              <label>
                Wholesale Price:
                <input
                  type="number"
                  name="wholesale_price"
                  value={formData.wholesale_price}
                  onChange={handleChange}
                />
              </label>
              <label>
                Retail Price:
                <input
                  type="number"
                  name="retail_price"
                  value={formData.retail_price}
                  onChange={handleChange}
                />
              </label>
              <label>
                Token Price:
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
                    <th>Size</th>
                    <th>Color</th>
                    <th>UF Invt.</th>
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
                      <td>{product.size}</td>
                      <td>{product.color}</td>
                      <td>{product.used_for_inventory}</td>
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
