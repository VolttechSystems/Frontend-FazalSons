import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AddOutlet.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Network, Urls } from '../../../api-config'

const AddOutlet = () => {
  const [formData, setFormData] = useState({
    outlet_code: '',
    outlet_name: '',
    address: '',
    outlet_mobile: '',
    manager_name: '',
    contact_number: '',
  })

  const [outlets, setOutlets] = useState([])
  const [editingOutletId, setEditingOutlet] = useState(null)

  // Get shop_id from local storage
  const shopId = localStorage.getItem('shop_id')

  useEffect(() => {
    fetchOutlets()
  }, [])

  const fetchOutlets = async () => {
    try {
      const shopId = localStorage.getItem('shop_id')
      const response = await Network.get(`${Urls.addOutlets}/${shopId}/`)
      if (response.status === 200) {
        setOutlets(response.data)
      } else {
        console.error('Failed to fetch outlets:', response.data.error)
      }
    } catch (error) {
      console.error('Error fetching outlets:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Submitting the form...')

    try {
      const shopId = localStorage.getItem('shop_id')
      console.log('Shop ID:', shopId)

      const payload = {
        ...formData,
        shop: parseInt(shopId), // Add shop_id to the payload
      }

      console.log('Payload:', payload)

      let response

      if (editingOutletId) {
        console.log('Updating an outlet...')
        response = await Network.put(`${Urls.actionOutlet}/${shopId}/${editingOutletId}/`, payload)
        console.log('Update Response:', response)

        if (response.ok && response.status === 200) {
          toast.success('Outlet updated successfully!')
          setEditingOutlet(null)
        } else {
          // Handle error explicitly if the response is not successful
          handleApiError(response)
        }
      } else {
        console.log('Adding a new outlet...')
        response = await Network.post(`${Urls.addOutlets}/${payload.shop}/`, payload)
        console.log('Add Response:', response)

        if (response.ok && response.status === 201) {
          toast.success('Outlet added successfully!')
        } else {
          // Handle error explicitly if the response is not successful
          handleApiError(response)
        }
      }

      fetchOutlets() // Refresh outlet list
      setFormData({
        outlet_code: '',
        outlet_name: '',
        address: '',
        outlet_mobile: '',
        manager_name: '',
        contact_number: '',
      })
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }

    console.log('Form submission completed.')
  }

  // Helper function to handle API errors
  const handleApiError = (response) => {
    console.error('API Error:', response)

    if (response.data?.non_field_errors) {
      // Handle specific backend validation errors
      toast.error(response.data.non_field_errors.join(', '))
    } else if (response.data?.message) {
      // Handle general error message
      toast.error(response.data.message)
    } else {
      // Generic fallback error
      toast.error('An error occurred while saving the outlet.')
    }
  }

  const handleEdit = (outlet) => {
    setFormData(outlet)
    setEditingOutlet(outlet.id)
  }

  const handleDelete = async (id) => {
    try {
      const shopId = localStorage.getItem('shop_id') // Get shop_id from local storage
      await Network.delete(`${Urls.actionOutlet}/${shopId}/${id}/`)
      toast.success('Outlet deleted successfully!')
      fetchOutlets()
    } catch (error) {
      console.error('Error deleting outlet:', error)
      toast.error('Failed to delete outlet.')
    }
  }

  return (
    <div className="outlet-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <form className="outlet-form" onSubmit={handleSubmit}>
        <h2 style={{ fontFamily: 'Times New Roman, serif', textAlign: 'center' }}>
          {editingOutletId ? 'Edit Outlet' : 'Add New Outlet'}
        </h2>
        <div>
          <label>
            Code <span style={{ color: '#0056B3' }}>*</span>
          </label>
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
          <label>
            Name <span style={{ color: '#0056B3' }}>*</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="outlet_name"
            value={formData.outlet_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            Address <span style={{ color: '#0056B3' }}>*</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            Mobile <span style={{ color: '#0056B3', fontSize: '12px' }}>(Optional)</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="outlet_mobile"
            value={formData.outlet_mobile}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Manager Name <span style={{ color: '#0056B3', fontSize: '12px' }}>(Optional)</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="manager_name"
            value={formData.manager_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Phone No. <span style={{ color: '#0056B3', fontSize: '12px' }}>(Optional)</span>
          </label>
          <input
            className="outlet-form-input"
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
          />
        </div>
        <button className="outlet-form-button" type="submit">
          {editingOutletId ? 'Update Outlet' : 'Add Outlet'}
        </button>
      </form>

      {outlets.length > 0 && (
        <table className="outlet-table">
          <thead className="outlet-table-header">
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Address</th>
              <th>Mobile No.</th>
              <th>Manager</th>
              <th>Manager Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="outlet-table-body">
            {outlets.map((outlet) => (
              <tr key={outlet.id}>
                <td className="outlet-table-cell">{outlet.outlet_code}</td>
                <td className="outlet-table-cell">{outlet.outlet_name}</td>
                <td className="outlet-table-cell">{outlet.address}</td>
                <td className="outlet-table-cell">{outlet.outlet_mobile}</td>
                <td className="outlet-table-cell">{outlet.manager_name}</td>
                <td className="outlet-table-cell">{outlet.contact_number}</td>
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
  )
}

export default AddOutlet

// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import initSqlJs from 'sql.js'
// import './AddOutlet.css'

// const AddOutlet = () => {
//   const [formData, setFormData] = useState({
//     outlet_code: '',
//     outlet_name: '',
//   })

//   const [outlets, setOutlets] = useState([])
//   const [editingOutletId, setEditingOutlet] = useState(null)
//   const [db, setDb] = useState(null)

//   useEffect(() => {
//     // Initialize SQLite database when the component mounts
//     initSqlJs().then((SQL) => {
//       const db = new SQL.Database()
//       setDb(db)
//       createTables(db)
//       loadDatabaseFromIndexedDB(SQL) // Pass SQL object here
//     })
//   }, [])

//   const createTables = (db) => {
//     // Create tables if they don't exist
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS outlets (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         outlet_code TEXT,
//         outlet_name TEXT
//       );
//     `
//     db.run(createTableQuery)
//   }

//   const syncDataWithServer = async (db) => {
//     const stmt = db.prepare('SELECT * FROM outlets')
//     const dataToSync = []

//     while (stmt.step()) {
//       const outlet = stmt.getAsObject()
//       dataToSync.push(outlet)
//     }
//     stmt.free()

//     if (dataToSync.length > 0) {
//       try {
//         // Step 1: Sync data with the server
//         const response = await axios.post(
//           'http://195.26.253.123/pos/products/sync-outlets/',
//           dataToSync,
//         )

//         if (response.status === 200) {
//           console.log('Data synced successfully.')

//           // Step 2: Clear the local SQLite outlets table
//           db.run('DELETE FROM outlets')

//           // Step 3: Fetch all data from the online database
//           const onlineDataResponse = await axios.get(
//             'http://195.26.253.123/pos/products/add_outlet',
//           )

//           if (onlineDataResponse.status === 200 && Array.isArray(onlineDataResponse.data)) {
//             const outlets = onlineDataResponse.data

//             // Step 4: Insert fetched data into the local outlets table
//             const insertQuery = 'INSERT INTO outlets (outlet_code, outlet_name) VALUES (?, ?)'
//             outlets.forEach((outlet) => {
//               db.run(insertQuery, [outlet.outlet_code, outlet.outlet_name])
//             })

//             // Step 5: Save updated database to IndexedDB
//             saveDatabaseToIndexedDB(db)

//             console.log('Local database updated with data from the server.')
//           } else {
//             console.error('Error fetching data from the server.')
//           }
//         }
//       } catch (error) {
//         console.error('Error syncing data with server:', error)
//       }
//     }
//   }

//   useEffect(() => {
//     const handleOnline = () => {
//       console.log('Online - syncing data...')
//       if (db) {
//         syncDataWithServer(db)
//       }
//     }

//     window.addEventListener('online', handleOnline)

//     return () => {
//       window.removeEventListener('online', handleOnline)
//     }
//   }, [db])

//   const fetchOutletsFromDb = async (db) => {
//     // Fetch outlets from SQLite database (IndexedDB)
//     const stmt = db.prepare('SELECT * FROM outlets')
//     const localData = []
//     while (stmt.step()) {
//       localData.push(stmt.getAsObject())
//     }
//     stmt.free()

//     try {
//       // Fetch outlets from the online database
//       const response = await axios.get('http://195.26.253.123/pos/products/add_outlet')
//       const onlineData = response.data // Assume the API returns a JSON array of outlets

//       // Combine local data and online data without duplicates
//       const combinedData = [...onlineData]

//       localData.forEach((localOutlet) => {
//         // Check if the outlet exists in the online data
//         const existsInOnlineData = onlineData.some(
//           (onlineOutlet) => onlineOutlet.outlet_code === localOutlet.outlet_code,
//         )

//         if (!existsInOnlineData) {
//           combinedData.push(localOutlet)
//         }
//       })

//       // Update state with the combined data
//       setOutlets(combinedData)
//     } catch (error) {
//       console.error('Error fetching online data:', error)

//       // If online fetch fails, show only local data
//       setOutlets(localData)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       if (navigator.onLine) {
//         // Send data to the online database
//         await axios.post('http://195.26.253.123/pos/products/add_outlet', formData)

//         // Optionally update IndexedDB as a backup
//         const insertQuery = `
//           INSERT INTO outlets (outlet_code, outlet_name)
//           VALUES (?, ?)
//         `
//         db.run(insertQuery, [formData.outlet_code, formData.outlet_name])
//       } else {
//         // Save data to IndexedDB only
//         const insertQuery = `
//           INSERT INTO outlets (outlet_code, outlet_name)
//           VALUES (?, ?)
//         `
//         db.run(insertQuery, [formData.outlet_code, formData.outlet_name])
//       }

//       fetchOutletsFromDb(db)
//       setFormData({ outlet_code: '', outlet_name: '' })
//       saveDatabaseToIndexedDB(db)
//     } catch (error) {
//       console.error('Error adding/updating outlet:', error)
//     }
//   }

//   const handleDelete = async (id) => {
//     try {
//       // Step 1: Delete from the online database
//       if (navigator.onLine) {
//         try {
//           await axios.delete(`http://195.26.253.123/pos/products/action_outlet/${id}/`)
//           console.log('Deleted from online database')
//         } catch (error) {
//           console.error('Error deleting from online database:', error)
//         }
//       } else {
//         console.warn('Offline: Skipping deletion from online database')
//       }

//       // Step 2: Delete from IndexedDB (local database)
//       if (db) {
//         const deleteQuery = 'DELETE FROM outlets WHERE id = ?'
//         db.run(deleteQuery, [id])

//         // Save updated database to IndexedDB
//         saveDatabaseToIndexedDB(db)

//         // Step 3: Fetch updated data
//         fetchOutletsFromDb(db)

//         console.log(`Deleted outlet with id ${id} from local database`)
//       } else {
//         console.error('Database instance is not available')
//       }
//     } catch (error) {
//       console.error('Error deleting outlet:', error)
//     }
//   }

//   const saveDatabaseToIndexedDB = (db) => {
//     // Export the SQLite database as binary data (ArrayBuffer)
//     const binaryData = db.export()

//     const request = indexedDB.open('SQLiteDatabase', 1)

//     request.onupgradeneeded = (event) => {
//       const db = event.target.result
//       if (!db.objectStoreNames.contains('databases')) {
//         // Create object store only if it does not exist
//         db.createObjectStore('databases')
//       }
//     }

//     request.onsuccess = (event) => {
//       const db = event.target.result
//       const transaction = db.transaction('databases', 'readwrite')
//       const store = transaction.objectStore('databases')
//       store.put(binaryData, 'outletDatabase')
//     }

//     request.onerror = (error) => {
//       console.error('Error saving database to IndexedDB:', error)
//     }
//   }

//   const loadDatabaseFromIndexedDB = (SQL) => {
//     // Load the SQLite database from IndexedDB
//     const request = indexedDB.open('SQLiteDatabase', 1)

//     request.onupgradeneeded = (event) => {
//       const db = event.target.result
//       if (!db.objectStoreNames.contains('databases')) {
//         // Create object store only if it does not exist
//         db.createObjectStore('databases')
//       }
//     }

//     request.onsuccess = (event) => {
//       const db = event.target.result
//       const transaction = db.transaction('databases', 'readonly')
//       const store = transaction.objectStore('databases')
//       const getRequest = store.get('outletDatabase')

//       getRequest.onsuccess = (e) => {
//         const binaryData = e.target.result
//         if (binaryData) {
//           const newDb = new SQL.Database(binaryData)
//           setDb(newDb)
//           fetchOutletsFromDb(newDb)
//         }
//       }
//     }

//     request.onerror = (error) => {
//       console.error('Error loading database from IndexedDB:', error)
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
