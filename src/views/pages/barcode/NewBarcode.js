// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Barcode from 'react-barcode'; // Assuming you're using react-barcode package
// import axios from 'axios';

// const NewBarcode = () => {
//   const { sku } = useParams(); // Get the SKU from the URL parameters
//   const [productDetails, setProductDetails] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await axios.get(
//           `http://195.26.253.123/pos/products/barcode_product_data/${sku}/`
//         );
//         if (response.data && Object.keys(response.data).length > 0) {
//           setProductDetails(response.data); // Use the response data directly
//         } else {
//           setError('No product details found.');
//         }
//       } catch (err) {
//         setError('Failed to fetch product details.');
//       }
//     };
  
//     fetchProductDetails();
//   }, [sku]);
  

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       {/* <h1>Barcode for SKU: {sku}</h1> */}
//       <div
//         style={{
//           display: 'inline-block',
//           border: '2px solid #ccc',
//           padding: '20px',
//           borderRadius: '3px',
//           textAlign: 'center',
//           width: 'fit-content',
//           background: '#f9f9f9',
//         }}
//       >
//         <Barcode
//           value={sku}
//           format="CODE128"
//           width={2}
//           height={80}
//           displayValue={false} // Hide default value under barcode
//           margin={10}
//         />
//         <div
//           style={{
//             marginTop: '5px',
//             fontSize: '12px',
//             fontWeight: 'bold', // Bold font
//             color: '#333',
//             display: 'flex',
//             justifyContent: 'space-between',
//             flexWrap: 'wrap',
//             gap: '10px', // Reduced gap further
//           }}
//         >
//           <span>{sku}</span>
//           {productDetails && (
//             <>
//               <span>{productDetails.product_name}</span>
//               <span>{productDetails.description}</span>
//               <span>Rs.{productDetails.selling_price}</span>
//             </>
//           )}
//         </div>
//       </div>

//       {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
//       {!productDetails && !error && <p style={{ marginTop: '20px' }}>Loading product details...</p>}
//     </div>
//   );
// };

// export default NewBarcode;
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Barcode from 'react-barcode';
import axios from 'axios';

const NewBarcode = () => {
  const { sku } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [error, setError] = useState(null);
  const barcodeRef = useRef(); // Create a ref for the barcode

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://195.26.253.123/pos/products/barcode_product_data/${sku}/`
        );
        if (response.data && Object.keys(response.data).length > 0) {
          setProductDetails(response.data);
        } else {
          setError('No product details found.');
        }
      } catch (err) {
        setError('Failed to fetch product details.');
      }
    };

    fetchProductDetails();
  }, [sku]);

  const printBarcode = () => {
    const printWindow = window.open('', '_blank');
    const barcodeSVG = barcodeRef.current.innerHTML; // Get the SVG content

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { text-align: center; }
            .barcode { margin: 20px; }
            .myclass {
              
              width: 100%;
    }
           
          </style>
        </head>
        <body>
        <span>${productDetails ? productDetails.product_name : ''}</span>
          <div class = "myclass" >${barcodeSVG}</div>
            <span>${productDetails ? productDetails.sku : ''}</span>&nbsp;
            <span>${productDetails ? productDetails.description : ''}</span>&nbsp;
            <span>Rs.${productDetails ? productDetails.selling_price : ''}</span>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
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
         <span style={{fontWeight: 'bold', fontSize: '12px'}}>{productDetails ? productDetails.product_name : ''}</span>
        <div ref={barcodeRef}> {/* Use ref to get the barcode SVG */}
          <Barcode
            value={sku}
            format="CODE128"
            width={2}
            height={80}
            displayValue={false}
            margin={10}
          />
        </div>
        <div
          style={{
            marginTop: '5px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333',
            // display: 'flex',
            // justifyContent: 'space-between',
            // flexWrap: 'wrap',
            // gap: '10px',
          }}
        >
          <span>{sku}</span>
          {productDetails && (
            <>
              {/* <span style={{margin:'20px'}}>{productDetails.product_name}</span> */}
              <span style={{margin:'20px'}}>{productDetails.description}</span>
              <span>Rs.{productDetails.selling_price}</span>
            </>
          )}
        </div>
      </div>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      {!productDetails && !error && <p style={{ marginTop: '20px' }}>Loading product details...</p>}
      
      <div>
      <button onClick={printBarcode} style={{ marginTop: '20px' }}>Print Barcode</button>
    </div>
    </div>
  );
};

export default NewBarcode;