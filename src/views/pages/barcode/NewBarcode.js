import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Barcode from 'react-barcode'; // Assuming you're using react-barcode package
import axios from 'axios';

const NewBarcode = () => {
  const { sku } = useParams(); // Get the SKU from the URL parameters
  const [productDetails, setProductDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://195.26.253.123/pos/products/barcode_product_data/${sku}/`
        );
        if (response.data && Object.keys(response.data).length > 0) {
          setProductDetails(response.data); // Use the response data directly
        } else {
          setError('No product details found.');
        }
      } catch (err) {
        setError('Failed to fetch product details.');
      }
    };
  
    fetchProductDetails();
  }, [sku]);
  

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* <h1>Barcode for SKU: {sku}</h1> */}
      <div
        style={{
          display: 'inline-block',
          border: '2px solid #ccc',
          padding: '20px',
          borderRadius: '3px',
          textAlign: 'center',
          width: 'fit-content',
          background: '#f9f9f9',
        }}
      >
        <Barcode
          value={sku}
          format="CODE128"
          width={2}
          height={80}
          displayValue={false} // Hide default value under barcode
          margin={10}
        />
        <div
          style={{
            marginTop: '5px',
            fontSize: '12px',
            fontWeight: 'bold', // Bold font
            color: '#333',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px', // Reduced gap further
          }}
        >
          <span>{sku}</span>
          {productDetails && (
            <>
              <span>{productDetails.product_name}</span>
              <span>{productDetails.description}</span>
              <span>Rs.{productDetails.selling_price}</span>
            </>
          )}
        </div>
      </div>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      {!productDetails && !error && <p style={{ marginTop: '20px' }}>Loading product details...</p>}
    </div>
  );
};

export default NewBarcode;
