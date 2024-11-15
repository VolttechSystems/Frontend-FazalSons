import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Loader = () => {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Define fetchProducts outside of useEffect so it can be reused
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/products/add_product');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    console.log({ id });
    if (window.confirm('Are you sure you want to delete this Product?')) {
      try {
        await axios.delete(`http://16.171.145.107/pos/products/action_product/${id}/`);
        alert('Product deleted successfully!');
        fetchProducts(); 
      } catch (error) {
        console.error('Error deleting Product:', error);
        alert('Failed to delete Product.');
      }
    }
  };

  const handleEdit = (id) => {
    console.log("Editing Product with ID:", id);
    navigate(`/Product/AddProduct/${id}`); // Navigates to the AddProduct page with product ID
  };
  

 


  return (
    <div>
      {loading && <Loader />}
      {loading && <p>Loading products...</p>}
      {error && <p className="text-danger">{error}</p>}
      <h2>All Products</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Season</th>
            <th>Color</th>
            <th>Size</th>
            <th>Selling Price</th>
            <th>Cost Price</th>
            <th>Discount Price</th>
            <th>Wholesale Price</th>
            <th>Retail Price</th>
            <th>Token Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.product_name}</td>
              <td>{product.sku}</td>
              <td>{product.season}</td>
              <td>{product.color}</td>
              <td>{product.size}</td>
              <td>{product.selling_price}</td>
              <td>{product.cost_price}</td>
              <td>{product.discount_price}</td>
              <td>{product.wholesale_price}</td>
              <td>{product.retail_price}</td>
              <td>{product.token_price}</td>
              <td>
                <button onClick={() => handleEdit(product.id)} style={{ marginRight: '8px' }}>Edit</button>
                <button onClick={() => handleDelete(product.id)} style={{ marginLeft: '8px' }}>Delete</button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllProducts;
