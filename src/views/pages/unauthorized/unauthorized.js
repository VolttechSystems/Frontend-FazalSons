import React from 'react';

const unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};

export default unauthorized;
