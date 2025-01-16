// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import './AddOutlet.css'

// const AddOutlet = () => {
//   const [formData, setFormData] = useState({
//     outlet_code: '',
//     outlet_name: '',
//   })

//   const [outlets, setOutlets] = useState([])
//   const [editingOutletId, setEditingOutlet] = useState(null)

//   useEffect(() => {
//     // Fetch existing outlets when the component mounts
//     fetchOutlets()
//   }, [])

//   const fetchOutlets = async () => {
//     try {
//       const response = await axios.get('http://195.26.253.123/pos/products/add_outlet') // Replace with the actual endpoint for fetching outlets
//       setOutlets(response.data) // Adjust based on the response structure
//     } catch (error) {
//       console.error('Error fetching outlets:', error)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       if (editingOutletId) {
//         // Update existing outlet
//         await axios.put(
//           `http://195.26.253.123/pos/products/action_outlet/${editingOutletId}/`,
//           formData,
//         )
//         setEditingOutlet(null)
//       } else {
//         // Add new outlet
//         await axios.post('http://195.26.253.123/pos/products/add_outlet', formData)
//       }
//       // Fetch updated outlets list from the backend
//       fetchOutlets()
//       setFormData({ outlet_code: '', outlet_name: '' })
//     } catch (error) {
//       console.error('Error adding/updating outlet:', error)
//     }
//   }

//   const handleEdit = (outlet) => {
//     setFormData(outlet)
//     setEditingOutlet(outlet.id)
//   }

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://195.26.253.123/pos/products/action_outlet/${id}/`)
//       // Fetch updated outlets list after deletion
//       fetchOutlets()
//     } catch (error) {
//       console.error('Error deleting outlet:', error)
//     }
//   }

//   return (
//     <div className="outlet-container">
//       <form className="outlet-form" onSubmit={handleSubmit}>
//         <h2>{editingOutletId ? 'Edit Outlet' : 'Add New Outlet'}</h2>
//         <div>
//           <label>Outlet Code:</label>
//           <input
//             className="outlet-form-input"
//             type="text"
//             name="outlet_code"
//             value={formData.outlet_code}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Outlet Name:</label>
//           <input
//             className="outlet-form-input"
//             type="text"
//             name="outlet_name"
//             value={formData.outlet_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button className="outlet-form-button" type="submit">
//           {editingOutletId ? 'Update Outlet' : 'Add Outlet'}
//         </button>
//       </form>

//       {/* Outlet Table */}
//       {outlets.length > 0 && (
//         <table className="outlet-table">
//           <thead className="outlet-table-header">
//             <tr>
//               <th>Outlet Code</th>
//               <th>Outlet Name</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody className="outlet-table-body">
//             {outlets.map((outlet) => (
//               <tr key={outlet.id}>
//                 <td className="outlet-table-cell">{outlet.outlet_code}</td>
//                 <td className="outlet-table-cell">{outlet.outlet_name}</td>
//                 <td className="outlet-table-cell outlet-table-actions">
//                   <button className="E-button" type="button" onClick={() => handleEdit(outlet)}>
//                     Edit
//                   </button>
//                   <button
//                     className="delete-button"
//                     type="button"
//                     onClick={() => handleDelete(outlet.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   )
// }

// export default AddOutlet













import React, { useState, useEffect } from 'react';
import axios from 'axios';
import initSqlJs from 'sql.js';
import './AddOutlet.css';

const AddOutlet = () => {
  const [formData, setFormData] = useState({
    outlet_code: '',
    outlet_name: '',
  });

  const [outlets, setOutlets] = useState([]);
  const [editingOutletId, setEditingOutlet] = useState(null);
  const [db, setDb] = useState(null);

  useEffect(() => {
    // Initialize SQLite database when the component mounts
    initSqlJs().then((SQL) => {
      const db = new SQL.Database();
      setDb(db);
      createTables(db);
      loadDatabaseFromIndexedDB(SQL);  // Pass SQL object here
    });
  }, []);


  // const syncDataWithServer = async (db) => {
  //   const stmt = db.prepare('SELECT * FROM outlets');
  //   const dataToSync = [];
    
  //   while (stmt.step()) {
  //     const outlet = stmt.getAsObject();
  //     dataToSync.push(outlet);
  //   }
  //   stmt.free();
  
  //   if (dataToSync.length > 0) {
  //     try {
  //       const response = await axios.post('http://195.26.253.123/pos/products/sync-outlets/', dataToSync);
  //       if (response.status === 200) {
  //         console.log('Data synced successfully.');
  //       }
  //     } catch (error) {
  //       console.error('Error syncing data with server:', error);
  //     }
  //   }
  // };


  const syncDataWithServer = async (db) => {
    const stmt = db.prepare('SELECT * FROM outlets');
    const dataToSync = [];
  
    while (stmt.step()) {
      const outlet = stmt.getAsObject();
      dataToSync.push(outlet);
    }
    stmt.free();
  
    if (dataToSync.length > 0) {
      try {
        // Step 1: Sync data with the server
        const response = await axios.post(
          'http://195.26.253.123/pos/products/sync-outlets/',
          dataToSync
        );
  
        if (response.status === 200) {
          console.log('Data synced successfully.');
  
          // Step 2: Clear the local SQLite outlets table
          db.run('DELETE FROM outlets');
  
          // Step 3: Fetch all data from the online database
          const onlineDataResponse = await axios.get(
            'http://195.26.253.123/pos/products/add_outlet'
          );
  
          if (onlineDataResponse.status === 200 && Array.isArray(onlineDataResponse.data)) {
            const outlets = onlineDataResponse.data;
  
            // Step 4: Insert fetched data into the local outlets table
            const insertQuery = 'INSERT INTO outlets (outlet_code, outlet_name) VALUES (?, ?)';
            outlets.forEach((outlet) => {
              db.run(insertQuery, [outlet.outlet_code, outlet.outlet_name]);
            });
  
            // Step 5: Save updated database to IndexedDB
            saveDatabaseToIndexedDB(db);
  
            console.log('Local database updated with data from the server.');
          } else {
            console.error('Error fetching data from the server.');
          }
        }
      } catch (error) {
        console.error('Error syncing data with server:', error);
      }
    }
  };
  



  useEffect(() => {
    const handleOnline = () => {
      console.log('Online - syncing data...');
      if (db) {
        syncDataWithServer(db);
      }
    };
  
    window.addEventListener('online', handleOnline);
  
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [db]);
  
  


  const createTables = (db) => {
    // Create tables if they don't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS outlets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        outlet_code TEXT,
        outlet_name TEXT
      );
    `;
    db.run(createTableQuery);
  };

  // const fetchOutletsFromDb = async (db) => {
  //   // Fetch outlets from SQLite database (IndexedDB)
  //   const stmt = db.prepare('SELECT * FROM outlets');
  //   const localData = [];
  //   while (stmt.step()) {
  //     localData.push(stmt.getAsObject());
  //   }
  
  //   // Fetch outlets from the online database
  //   try {
  //     const response = await axios.get('http://195.26.253.123/pos/products/add_outlet');
  //     const onlineData = response.data; // Assume the API returns a JSON array of outlets
  
  //     // Combine local data and online data
  //     const combinedData = [...onlineData, ...localData];
  
  //     // Update state with combined data
  //     setOutlets(combinedData);
  //   } catch (error) {
  //     console.error('Error fetching online data:', error);
  
  //     // If online fetch fails, show only local data
  //     setOutlets(localData);
  //   }
  // };
  

  const fetchOutletsFromDb = (db) => {
    // Fetch outlets from SQLite database
    const stmt = db.prepare('SELECT * FROM outlets');
    const data = [];
    while (stmt.step()) {
      data.push(stmt.getAsObject());
    }
    setOutlets(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (navigator.onLine) {
        // Send data to the online database
        await axios.post('http://195.26.253.123/pos/products/add_outlet', formData);
  
        // Optionally update IndexedDB as a backup
        const insertQuery = `
          INSERT INTO outlets (outlet_code, outlet_name) 
          VALUES (?, ?)
        `;
        db.run(insertQuery, [formData.outlet_code, formData.outlet_name]);
      } else {
        // Save data to IndexedDB only
        const insertQuery = `
          INSERT INTO outlets (outlet_code, outlet_name) 
          VALUES (?, ?)
        `;
        db.run(insertQuery, [formData.outlet_code, formData.outlet_name]);
      }
  
      fetchOutletsFromDb(db);
      setFormData({ outlet_code: '', outlet_name: '' });
      saveDatabaseToIndexedDB(db);
    } catch (error) {
      console.error('Error adding/updating outlet:', error);
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editingOutletId) {
  //       // Update existing outlet in SQLite DB
  //       const updateQuery = `
  //         UPDATE outlets 
  //         SET outlet_code = ?, outlet_name = ? 
  //         WHERE id = ?
  //       `;
  //       db.run(updateQuery, [formData.outlet_code, formData.outlet_name, editingOutletId]);
  //       setEditingOutlet(null);
  //     } else {
  //       // Insert new outlet into SQLite DB
  //       const insertQuery = `
  //         INSERT INTO outlets (outlet_code, outlet_name) 
  //         VALUES (?, ?)
  //       `;
  //       db.run(insertQuery, [formData.outlet_code, formData.outlet_name]);
  //     }
  //     // Fetch updated outlets list from the SQLite database
  //     fetchOutletsFromDb(db);
  //     setFormData({ outlet_code: '', outlet_name: '' });

  //     // Save the updated database to IndexedDB
  //     saveDatabaseToIndexedDB(db);
  //   } catch (error) {
  //     console.error('Error adding/updating outlet:', error);
  //   }
  // };

  // const handleEdit = (outlet) => {
  //   setFormData(outlet);
  //   setEditingOutlet(outlet.id);
  // };


  const handleDelete = async (id) => {
    try {
      // Step 1: Delete from the online database
      if (navigator.onLine) {
        try {
          await axios.delete(`http://195.26.253.123/pos/products/action_outlet/${id}/`);
          console.log('Deleted from online database');
        } catch (error) {
          console.error('Error deleting from online database:', error);
        }
      } else {
        console.warn('Offline: Skipping deletion from online database');
      }
  
      // Step 2: Delete from IndexedDB (local database)
      const deleteQuery = 'DELETE FROM outlets WHERE id = ?';
      db.run(deleteQuery, [id]);
  
      // Save updated database to IndexedDB
      saveDatabaseToIndexedDB(db);
  
      // Step 3: Fetch updated data
      fetchOutletsFromDb(db);
    } catch (error) {
      console.error('Error deleting outlet:', error);
    }
  };
  

  // const handleDelete = async (id) => {
  //   try {
  //     // Delete outlet from SQLite DB
  //     const deleteQuery = 'DELETE FROM outlets WHERE id = ?';
  //     db.run(deleteQuery, [id]);
  //     // Fetch updated outlets list from the SQLite database
  //     fetchOutletsFromDb(db);

  //     // Save the updated database to IndexedDB
  //     saveDatabaseToIndexedDB(db);
  //   } catch (error) {
  //     console.error('Error deleting outlet:', error);
  //   }
  // };

  const saveDatabaseToIndexedDB = (db) => {
    // Export the SQLite database as binary data (ArrayBuffer)
    const binaryData = db.export();

    const request = indexedDB.open('SQLiteDatabase', 1);  // Ensure the version is '1'

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('databases')) {
        // Create object store only if it does not exist
        db.createObjectStore('databases');
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('databases', 'readwrite');
      const store = transaction.objectStore('databases');
      store.put(binaryData, 'outletDatabase');
    };

    request.onerror = (error) => {
      console.error('Error saving database to IndexedDB:', error);
    };
  };

  const loadDatabaseFromIndexedDB = (SQL) => {
    // Load the SQLite database from IndexedDB
    const request = indexedDB.open('SQLiteDatabase', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('databases')) {
        // Create object store only if it does not exist
        db.createObjectStore('databases');
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('databases', 'readonly');
      const store = transaction.objectStore('databases');
      const getRequest = store.get('outletDatabase');

      getRequest.onsuccess = (e) => {
        const binaryData = e.target.result;
        if (binaryData) {
          const newDb = new SQL.Database(binaryData);  // Use SQL from the argument
          setDb(newDb);
          fetchOutletsFromDb(newDb);
        }
      };
    };

    request.onerror = (error) => {
      console.error('Error loading database from IndexedDB:', error);
    };
  };

  return (
    <div className="outlet-container">
      <form className="outlet-form" onSubmit={handleSubmit}>
        <h2>{editingOutletId ? 'Edit Outlet' : 'Add New Outlet'}</h2>
        <div>
          <label>Outlet Code:</label>
          <input
            className="outlet-form-input"
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
            className="outlet-form-input"
            type="text"
            name="outlet_name"
            value={formData.outlet_name}
            onChange={handleChange}
            required
          />
        </div>
        <button className="outlet-form-button" type="submit">
          {editingOutletId ? 'Update Outlet' : 'Add Outlet'}
        </button>
      </form>

      {/* Outlet Table */}
      {outlets.length > 0 && (
        <table className="outlet-table">
          <thead className="outlet-table-header">
            <tr>
              <th>Outlet Code</th>
              <th>Outlet Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="outlet-table-body">
            {outlets.map((outlet) => (
              <tr key={outlet.id}>
                <td className="outlet-table-cell">{outlet.outlet_code}</td>
                <td className="outlet-table-cell">{outlet.outlet_name}</td>
                <td className="outlet-table-cell outlet-table-actions">
                  <button className="E-button" type="button" onClick={() => handleEdit(outlet)}>
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDelete(outlet.id)}
                  >
                    Delete
                  </button>
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
