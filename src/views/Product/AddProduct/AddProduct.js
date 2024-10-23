import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    product_name: '',
    outlet_name: 'Fazal Sons', 
    sku: '',
    head_category: '',
    parent_category: '',
    category: '',
    brand_name: '',
    season: '',
    description: '',
    color: '',
    // used_for_inventory: false,
    cost_price: '',
    selling_price: '',
    discount_price: '',
    wholesale_price: '',
    retail_price: '',
    token_price: ''
  });

  const [activeTab, setActiveTab] = useState(0);
  const [headCategories, setHeadCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productList, setProductList] = useState([]);

  // Fetching data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [headResponse, parentResponse, categoryResponse, brandResponse] = await Promise.all([
          axios.get('http://16.170.232.76/pos/products/add_head_category'),
          axios.get('http://16.170.232.76/pos/products/add_parent_category/'),
          axios.get('http://16.170.232.76/pos/products/add_category'),
          axios.get('http://16.170.232.76/pos/products/add_brand')
        ]);
        
        setHeadCategories(headResponse.data);
        setParentCategories(parentResponse.data);
        setCategories(categoryResponse.data);
        setBrands(brandResponse.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post('http://16.170.232.76/pos/products/add_product', formData);
      console.log("Product added successfully:", response.data);

     
      setProductList([...productList, response.data]);

      
      setFormData({
        product_name: '',
        outlet_name: 'Fazal Sons', 
        sku: '',
        head_category: hc_name,
        parent_category: pc_name ,
        category: category_name,
        brand_name: brand_name,
        season: '',
        description: '',
        color: '',
        // used_for_inventory: false,
        cost_price: '',
        selling_price: '',
        discount_price: '',
        wholesale_price: '',
        retail_price: '',
        token_price: ''
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="add-product-form">
      <h2>Product Information</h2>
      
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
                Brand Name:
                <select
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Brand</option>
                  {/* {brands.map((brand) => (
                    <option key={brand.brand_name} value={brand.brand_name}>{brand.brand_name}</option>
                  ))} */}
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
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-column">
              <label>
                Color:
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                />
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
              <button
                type="button"
                className="add-button"
                onClick={handleAdd}
                style={{ marginTop: '20px', alignSelf: 'flex-start' }}
              >
                Add
              </button>
            </div>
          )}
        </form>
      </div>

      {productList.length > 0 && (
        <div className="product-table">
          <h3>Added Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Color</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Discount Price</th>
                <th>Wholesale Price</th>
                <th>Retail Price</th>
                <th>Token Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => (
                <tr key={index}>
                  <td>{product.product_name}</td>
                  <td>{product.sku}</td>
                  <td>{product.color}</td>
                  <td>{product.cost_price}</td>
                  <td>{product.selling_price}</td>
                  <td>{product.discount_price}</td>
                  <td>{product.wholesale_price}</td>
                  <td>{product.retail_price}</td>
                  <td>{product.token_price}</td>
                  <td>
                    {/* edit/delete  */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
