// import React, { useState } from 'react';
// import './AddOutlet.css';

// const AddOutlet = () => {
//   const [formData, setFormData] = useState({
//     outletCode: '',
//     outletName: ''
//   });

//   const [outlets, setOutlets] = useState([]);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add new outlet to the outlets array
//     if (formData.outletCode && formData.outletName) {
//       setOutlets([...outlets, formData]);
//       setFormData({ outletCode: '', outletName: '' });
//     }
//   };

//   return (
//     <div className="container">
//       <form onSubmit={handleSubmit}>
//         <h2>Add New Outlet</h2>
//         <div>
//           <label>Outlet Code:</label>
//           <input
//             type="text"
//             name="outletCode"
//             value={formData.outletCode}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Outlet Name:</label>
//           <input
//             type="text"
//             name="outletName"
//             value={formData.outletName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit">Add Outlet</button>
//       </form>

//       {/* Outlet Table */}
//       {outlets.length > 0 && (
//         <table>
//           <thead>
//             <tr>
//               <th>Outlet Code</th>
//               <th>Outlet Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             {outlets.map((outlet, index) => (
//               <tr key={index}>
//                 <td>{outlet.outletCode}</td>
//                 <td>{outlet.outletName}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AddOutlet;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddOutlet.css';

const AddOutlet = () => {
  const [formData, setFormData] = useState({
    outlet_code: '',
    outlet_name: ''
  });

  const [outlets, setOutlets] = useState([]);
  const [editingOutlet, setEditingOutlet] = useState(null);

  useEffect(() => {
    // Fetch existing outlets when the component mounts
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/products/add_outlet'); // Replace with the actual endpoint for fetching outlets
      setOutlets(response.data); // Adjust based on the response structure
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOutlet) {
        // Update existing outlet
        await axios.put(`http://16.171.145.107/pos/products/action_outlet/${editingOutlet.id}/`, formData);
        setOutlets(outlets.map(outlet => (outlet.id === editingOutlet.id ? formData : outlet)));
        setEditingOutlet(null);
      } else {
        // Add new outlet
        await axios.post('http://16.171.145.107/pos/products/add_outlet', formData);
        setOutlets([...outlets, formData]);
      }
      setFormData({ outlet_code: '', outlet_name: '' });
    } catch (error) {
      console.error('Error adding/updating outlet:', error);
    }
  };

  const handleEdit = (outlet) => {
    setFormData(outlet);
    setEditingOutlet(outlet.id); 
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://16.171.145.107/pos/Outlet/action_outlet/${id}/`);
      setOutlets(outlets.filter(outlet => outlet.id !== id)); // Remove deleted outlet from the state
    } catch (error) {
      console.error('Error deleting outlet:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>{editingOutlet ? 'Edit Outlet' : 'Add New Outlet'}</h2>
        <div>
          <label>Outlet Code:</label>
          <input
            type="text"
            name="outlet_code"
            value={formData.outlet_code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Outlet Name:</label>
          <input
            type="text"
            name="outlet_name"
            value={formData.outlet_name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editingOutlet ? 'Update Outlet' : 'Add Outlet'}</button>
      </form>

      {/* Outlet Table */}
      {outlets.length > 0 && (
        <table>
          <thead>
            <tr>
              
              <th>Outlet Code</th>
              <th>Outlet Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {outlets.map((outlet) => (
              <tr key={outlet.id}>
                <td>{outlet.outlet_code}</td>
                <td>{outlet.outlet_name}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(outlet)}>Edit</button>
                  <button type="button" onClick={() => handleDelete(outlet.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AddOutlet;
