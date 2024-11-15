// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Salesman.css';

// const Salesman = () => {
//   const [formData, setFormData] = useState({
//     salesman_code: '',
//     salesman_name: '',
//     wholesale_commission: '',
//     retail_commission: '',
//     token_commission: ''
//   });

//   const [salesmen, setSalesmen] = useState([]);
//   const [editingSalesmanId, setEditingSalesmanId] = useState(null);

//   useEffect(() => {
//     fetchSalesmen();
//   }, []);

//   const fetchSalesmen = async () => {
//     try {
//       const response = await axios.get('http://16.171.145.107/pos/transaction/add_salesman');
//       setSalesmen(response.data);
//     } catch (error) {
//       console.error('Error fetching salesmen:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

    
//     const generatedId = editingSalesmanId || Date.now();

    
//     const dataToSend = {
//       id: generatedId,  
//       salesman_code: formData.salesman_code,
//       salesman_name: formData.salesman_name,
//       wholesale_commission: String(formData.wholesale_commission),  
//       retail_commission: String(formData.retail_commission),        
//       token_commission: String(formData.token_commission)           
//     };

//     try {
//       if (editingSalesmanId) {
        
//         const response = await axios.put(
//           `http://16.171.145.107/pos/transaction/action_salesman/${editingSalesmanId}/`,
//           dataToSend,
//           { headers: { 'Content-Type': 'application/json' } }
//         );
//         setSalesmen(
//           salesmen.map((salesman) => (salesman.id === editingSalesmanId ? response.data : salesman))
//         );
//         setEditingSalesmanId(null);  
//       } else {
       
//         const response = await axios.post(
//           'http://16.171.145.107/pos/transaction/add_salesman',
//           dataToSend,
//           { headers: { 'Content-Type': 'application/json' } }
//         );
//         setSalesmen([...salesmen, response.data]);  
//       }

//       // Reset the form
//       setFormData({
//         salesman_code: '',
//         salesman_name: '',
//         wholesale_commission: '',
//         retail_commission: '',
//         token_commission: ''
//       });
//     } catch (error) {
//       console.error('Error adding/updating salesman:', error);
//     }
//   };

//   const handleEdit = (salesman) => {
//     setFormData({
//       salesman_code: salesman.salesman_code,
//       salesman_name: salesman.salesman_name,
//       wholesale_commission: salesman.wholesale_commission,
//       retail_commission: salesman.retail_commission,
//       token_commission: salesman.token_commission
//     });
//     setEditingSalesmanId(salesman.id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://16.171.145.107/pos/transaction/action_salesman/${id}/`);
//       setSalesmen(salesmen.filter(salesman => salesman.id !== id));
//     } catch (error) {
//       console.error('Error deleting salesman:', error);
//     }
//   };

//   return (
//     <div className="container">
//       <form onSubmit={handleSubmit}>
//         <h2>{editingSalesmanId ? 'Edit Salesman' : 'Add New Salesman'}</h2>
//         <div>
//           <label>Salesman Code: *</label>
//           <input
//             type="text"
//             name="salesman_code"
//             value={formData.salesman_code}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Salesman Name: *</label>
//           <input
//             type="text"
//             name="salesman_name"
//             value={formData.salesman_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Wholesale Commission:</label>
//           <input
//             type="number"
//             name="wholesale_commission"
//             value={formData.wholesale_commission}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Retail Commission:</label>
//           <input
//             type="number"
//             name="retail_commission"
//             value={formData.retail_commission}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Token Commission:</label>
//           <input
//             type="number"
//             name="token_commission"
//             value={formData.token_commission}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit">{editingSalesmanId ? 'Update Salesman' : 'Add Salesman'}</button>
//       </form>

//       <table>
//         <thead>
//           <tr>
//             <th>Salesman Code</th>
//             <th>Salesman Name</th>
//             <th>Wholesale Commission</th>
//             <th>Retail Commission</th>
//             <th>Token Commission</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {salesmen.map((salesman) => (
//             <tr key={salesman.id}>
//               <td>{salesman.salesman_code}</td>
//               <td>{salesman.salesman_name}</td>
//               <td>{salesman.wholesale_commission}</td>
//               <td>{salesman.retail_commission}</td>
//               <td>{salesman.token_commission}</td>
//               <td>
//                 <button onClick={() => handleEdit(salesman)}>Edit</button>
//                 <button onClick={() => handleDelete(salesman.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Salesman;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Salesman.css';

const Salesman = () => {
  const [formData, setFormData] = useState({
    salesman_name: '',
    wholesale_commission: '',
    retail_commission: '',
    token_commission: '',
    outlet_code: null
  });

  const [salesmen, setSalesmen] = useState([]);
  const [editingSalesmanId, setEditingSalesmanId] = useState(null);
  const [showCommissions, setShowCommissions] = useState(true); // Default to true to hide fields initially

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const fetchSalesmen = async () => {
    try {
      const response = await axios.get('http://16.171.145.107/pos/transaction/add_salesman');
      setSalesmen(response.data);
    } catch (error) {
      console.error('Error fetching salesmen:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setShowCommissions(!showCommissions); // Toggle the checkbox state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the data being sent
    console.log('Data to send:', {
      salesman_code: formData.salesman_code, 
      salesman_name: formData.salesman_name,
      wholesale_commission: !showCommissions ? String(formData.wholesale_commission) : '', 
      retail_commission: !showCommissions ? String(formData.retail_commission) : '',
      token_commission: !showCommissions ? String(formData.token_commission) : '',
      outlet_code: formData.outlet_code,
      CheckBoxValue: showCommissions ? "true" : "false"
    });
  
    const dataToSend = {
      salesman_code: formData.salesman_code,
      salesman_name: formData.salesman_name,
      wholesale_commission: !showCommissions ? String(formData.wholesale_commission) : '',
      retail_commission: !showCommissions ? String(formData.retail_commission) : '',
      token_commission: !showCommissions ? String(formData.token_commission) : '',
      outlet_code: formData.outlet_code,
      CheckBoxValue: showCommissions ? "true" : "false"
    };
  
    try {
      if (editingSalesmanId) {
        const response = await axios.put(
          `http://16.171.145.107/pos/transaction/action_salesman/${editingSalesmanId}/`,
          dataToSend,
          { headers: { 'Content-Type': 'application/json' } }
        );
        setSalesmen(
          salesmen.map((salesman) => (salesman.id === editingSalesmanId ? response.data : salesman))
        );
        setEditingSalesmanId(null);
      } else {
        const response = await axios.post(
          'http://16.171.145.107/pos/transaction/add_salesman',
          dataToSend,
          { headers: { 'Content-Type': 'application/json' } }
        );
        setSalesmen([...salesmen, response.data]);
      }
  
      setFormData({
        salesman_code: '',
        salesman_name: '',
        wholesale_commission: '',
        retail_commission: '',
        token_commission: '',
        outlet_code: null
      });
    } catch (error) {
      console.error('Error adding/updating salesman:', error);
    }
  };
  

  const handleEdit = (salesman) => {
    setFormData({
      salesman_name: salesman.salesman_name,
      wholesale_commission: salesman.wholesale_commission,
      retail_commission: salesman.retail_commission,
      token_commission: salesman.token_commission,
      outlet_code: salesman.outlet_code
    });
    setEditingSalesmanId(salesman.id);
    setShowCommissions(!!salesman.wholesale_commission); // If there are commissions, show them
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://16.171.145.107/pos/transaction/action_salesman/${id}/`);
      setSalesmen(salesmen.filter(salesman => salesman.id !== id));
    } catch (error) {
      console.error('Error deleting salesman:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>{editingSalesmanId ? 'Edit Salesman' : 'Add New Salesman'}</h2>
        
        <div>
          <label>Salesman Name: *</label>
          <input
            type="text"
            name="salesman_name"
            value={formData.salesman_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Show Commission Fields:</label>
          <input
            type="checkbox"
            checked={showCommissions}  // Checked by default, commission fields are hidden
            onChange={handleCheckboxChange}
          />
        </div>

        {!showCommissions && (
          <>
            <div>
              <label>Wholesale Commission:</label>
              <input
                type="number"
                name="wholesale_commission"
                value={formData.wholesale_commission}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Retail Commission:</label>
              <input
                type="number"
                name="retail_commission"
                value={formData.retail_commission}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Token Commission:</label>
              <input
                type="number"
                name="token_commission"
                value={formData.token_commission}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div>
          <label>Outlet Code:</label>
          <input
            type="text"
            name="outlet_code"
            value={formData.outlet_code || ''}
            onChange={handleChange}
          />
        </div>

        <button type="submit">{editingSalesmanId ? 'Update Salesman' : 'Add Salesman'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Salesman Name</th>
            <th>Wholesale Commission</th>
            <th>Retail Commission</th>
            <th>Token Commission</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesmen.map((salesman) => (
            <tr key={salesman.id}>
              <td>{salesman.salesman_name}</td>
              <td>{salesman.wholesale_commission}</td>
              <td>{salesman.retail_commission}</td>
              <td>{salesman.token_commission}</td>
              <td>
                <button onClick={() => handleEdit(salesman)}>Edit</button>
                <button onClick={() => handleDelete(salesman.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Salesman;
