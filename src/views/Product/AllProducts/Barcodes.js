import React from 'react';
import { useParams } from 'react-router-dom';
import Barcode from 'react-barcode'; // Assuming you're using react-barcode package

const Barcodes = () => {
  const { sku} = useParams(); // Get the SKU from the URL parameters
 


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Barcode for SKU: {sku}</h1>
      <Barcode
        value={sku}
        format="CODE128"
        width={2}
        height={80}
        displayValue={true}
        fontSize={14}
        margin={10}
      />
       
    </div>
  );
};

export default Barcodes;
