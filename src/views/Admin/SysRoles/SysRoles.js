// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import axios from "axios";
// import './SysRole.css';

// const SysRoles = () => {
//   const [permissions, setPermissions] = useState([]);
//   const [selectedPermissions, setSelectedPermissions] = useState([]);
//   const [roleName, setRoleName] = useState("");
//   const [status, setStatus] = useState("Active");
//   const [roles, setRoles] = useState([]);
//   const [editingRoleId, setEditingRoleId] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://195.26.253.123/pos/accounts/get-all-permissions/")
//       .then((response) => {
//         const permissionOptions = response.data.map((permission) => ({
//           value: permission.id,
//           label: permission.permission_name,
//         }));
//         setPermissions(permissionOptions);
//       })
//       .catch((error) => console.error("Error fetching permissions:", error));

//     fetchRoles();
//   }, []);

//   const fetchRoles = () => {
//     axios
//       .get("http://195.26.253.123/pos/accounts/add-system-role/")
//       .then((response) => {
//         setRoles(response.data);
//       })
//       .catch((error) => console.error("Error fetching roles:", error));
//   };

//   const handleAddOrEditRole = async () => {
//     try {
//       // Map permission IDs, handle null values
//       const selectedPermissionIDs = selectedPermissions.map(
//         (permission) => permission.value
//       );

//       const requestData = {
//         sys_role_name: roleName,
//         status: status.toLowerCase(),
//         permissions: selectedPermissionIDs.filter((id) => id !== null), // Exclude nulls
//       };

//       if (editingRoleId) {
//         await axios.put(
//           `http://195.26.253.123/pos/accounts/action-system-role/${editingRoleId}/`,
//           requestData
//         );
//         alert("Role updated successfully!");
//       } else {
//         await axios.post(
//           "http://195.26.253.123/pos/accounts/add-system-role/",
//           requestData
//         );
//         alert("Role added successfully!");
//       }

//       fetchRoles();
//       clearForm();
//     } catch (error) {
//       console.error("Error adding/updating role:", error);
//       setErrorMessage("Failed to add/update role.");
//     }
//   };

//   const handleEdit = (role) => {
//     setEditingRoleId(role.id);
//     setRoleName(role.sys_role_name);
//     setStatus(role.status === "active" ? "Active" : "Inactive");

//     const preselectedPermissions = role.permissions
//       .filter((perm) => perm) // Remove null permissions
//       .map((perm) => ({
//         value: perm.id,
//         label: perm.permission_name,
//       }));
//     setSelectedPermissions(preselectedPermissions); // Set pre-filled values in state
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this role?")) {
//       try {
//         await axios.delete(
//           `http://195.26.253.123/pos/accounts/action-system-role/${id}/`
//         );
//         alert("Role deleted successfully!");
//         fetchRoles();
//       } catch (error) {
//         console.error("Error deleting role:", error);
//         setErrorMessage("Failed to delete role.");
//       }
//     }
//   };

//   const clearForm = () => {
//     setEditingRoleId(null);
//     setRoleName("");
//     setSelectedPermissions([]);
//     setStatus("Active");
//     setErrorMessage("");
//   };

//   return (
//     <div className="container">
//       <h2>System Roles</h2>

//       {errorMessage && <p className="error">{errorMessage}</p>}

//       <div>
//         <label htmlFor="roleName">Name:</label>
//         <input
//           type="text"
//           id="roleName"
//           value={roleName}
//           onChange={(e) => setRoleName(e.target.value)}
//           placeholder="Enter role name"
//         />
//       </div>

//       <div>
//         <label>Status:</label>
//         <label>
//           <input
//             type="radio"
//             value="Active"
//             checked={status === "Active"}
//             onChange={(e) => setStatus(e.target.value)}
//           />
//           Active
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="Inactive"
//             checked={status === "Inactive"}
//             onChange={(e) => setStatus(e.target.value)}
//           />
//           Inactive
//         </label>
//       </div>

//       <div>
//         <label>Permissions:</label>
//         <Select
//   options={permissions}
//   isMulti
//   value={selectedPermissions}
//   onChange={(selected) => setSelectedPermissions(selected || [])} // Set empty array if no selection
// />

//       </div>

//       <button className="add-edit-role-btn" onClick={handleAddOrEditRole}>
//   {editingRoleId ? "Update Role" : "Add Role"}
// </button>
// <button className="clear-role-btn" onClick={clearForm}>
//   Clear
// </button>

//       <table>
//         <thead>
//           <tr>
//             <th>Role Name</th>
//             <th>Status</th>
//             <th>Permissions</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {roles.map((role) => (
//             <tr key={role.id}>
//               <td>{role.sys_role_name}</td>
//               <td>{role.status}</td>
//               <td>
//                 {role.permissions
//                   .map((permission) => permission.permission_name)
//                   .join(", ")}
//               </td>
//               <td>
//                 <button onClick={() => handleEdit(role)}>Edit</button>
//                 <button onClick={() => handleDelete(role.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SysRoles;

import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './SysRole.css'

const SysRoles = () => {
  const [permissions, setPermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [roleName, setRoleName] = useState('')
  const [status, setStatus] = useState('Active')
  const [roles, setRoles] = useState([])
  const [editingRoleId, setEditingRoleId] = useState(null)

  useEffect(() => {
    axios
      .get('http://195.26.253.123/pos/accounts/get-all-permissions/')
      .then((response) => {
        const permissionOptions = response.data.map((permission) => ({
          value: permission.id,
          label: permission.permission_name,
        }))
        setPermissions(permissionOptions)
      })
      .catch((error) => {
        console.error('Error fetching permissions:', error)
        toast.error('Failed to fetch permissions.')
      })

    fetchRoles()
  }, [])

  const fetchRoles = () => {
    axios
      .get('http://195.26.253.123/pos/accounts/add-system-role/')
      .then((response) => {
        setRoles(response.data)
      })
      .catch((error) => {
        console.error('Error fetching roles:', error)
        toast.error('Failed to fetch roles.')
      })
  }

  const handleAddOrEditRole = async () => {
    try {
      const selectedPermissionIDs = selectedPermissions.map((permission) => permission.value)

      const requestData = {
        sys_role_name: roleName,
        status: status.toLowerCase(),
        permissions: selectedPermissionIDs,
      }

      if (editingRoleId) {
        await axios.put(
          `http://195.26.253.123/pos/accounts/action-system-role/${editingRoleId}/`,
          requestData,
        )
        toast.success('Role updated successfully!')
      } else {
        await axios.post('http://195.26.253.123/pos/accounts/add-system-role/', requestData)
        toast.success('Role added successfully!')
      }

      fetchRoles()
      clearForm()
    } catch (error) {
      console.error('Error adding/updating role:', error)
      if (error.response && error.response.data) {
        Object.keys(error.response.data).forEach((key) => {
          toast.error(`${key}: ${error.response.data[key][0]}`)
        })
      } else {
        toast.error('Failed to add/update role.')
      }
    }
  }

  const handleEdit = (role) => {
    setEditingRoleId(role.id)
    setRoleName(role.sys_role_name)
    setStatus(role.status === 'active' ? 'Active' : 'Inactive')

    const preselectedPermissions = role.permissions.map((perm) => ({
      value: perm.id,
      label: perm.permission_name,
    }))
    setSelectedPermissions(preselectedPermissions)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await axios.delete(`http://195.26.253.123/pos/accounts/action-system-role/${id}/`)
        toast.success('Role deleted successfully!')
        fetchRoles()
      } catch (error) {
        console.error('Error deleting role:', error)
        toast.error('Failed to delete role.')
      }
    }
  }

  const clearForm = () => {
    setEditingRoleId(null)
    setRoleName('')
    setSelectedPermissions([])
    setStatus('Active')
  }

  return (
    <div className="container">
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
      <h2>System Roles</h2>

      <div>
        <label htmlFor="roleName">Name:</label>
        <input
          type="text"
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Enter role name"
        />
      </div>

      <div>
        <label>Status:</label>
        <label>
          <input
            type="radio"
            value="Active"
            checked={status === 'Active'}
            onChange={(e) => setStatus(e.target.value)}
          />
          Active
        </label>
        <label>
          <input
            type="radio"
            value="Inactive"
            checked={status === 'Inactive'}
            onChange={(e) => setStatus(e.target.value)}
          />
          Inactive
        </label>
      </div>

      <div>
        <label>Permissions:</label>
        <Select
          options={permissions}
          isMulti
          value={selectedPermissions}
          onChange={(selected) => setSelectedPermissions(selected || [])}
        />
      </div>

      <button className="add-edit-role-btn" onClick={handleAddOrEditRole}>
        {editingRoleId ? 'Update Role' : 'Add Role'}
      </button>
      <button className="clear-role-btn" onClick={clearForm}>
        Clear
      </button>

      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Status</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.sys_role_name}</td>
              <td>{role.status}</td>
              <td>{role.permissions.map((permission) => permission.permission_name).join(', ')}</td>
              <td>
                <button onClick={() => handleEdit(role)}>Edit</button>
                <button onClick={() => handleDelete(role.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SysRoles
