import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const SysRoles = () => {
  const [permissions, setPermissions] = useState([]); // Dropdown options
  const [selectedPermissions, setSelectedPermissions] = useState([]); // Selected IDs
  const [roleName, setRoleName] = useState(""); // Role Name input
  const [status, setStatus] = useState("Active"); // Status radio selection
  const [roles, setRoles] = useState([]); // Store roles to display in the table
  const [errorMessage, setErrorMessage] = useState(""); // Store error message

  // Fetch permissions and roles from the API
  useEffect(() => {
    // Fetch permissions from the API
    axios
      .get("http://195.26.253.123/pos/accounts/get-all-permissions/")
      .then((response) => {
        const permissionOptions = response.data.map((permission) => ({
          value: permission.id,
          label: permission.permission_name, // Display name in the dropdown
        }));
        setPermissions(permissionOptions);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
      });

 

// Re-fetch roles from the backend
axios
  .get("http://195.26.253.123/pos/accounts/add-system-role/")
  .then((response) => {
    setRoles(response.data); // Update roles
  })
  .catch((error) => {
    console.error("Error fetching roles:", error);
  });
  }, []);


  const handleAddRole = async () => {
    try {
      // Check if the role name already exists
      const existingRole = roles.some(
        (role) => role.sys_role_name === roleName
      );
  
      if (existingRole) {
        setErrorMessage("A system role with this name already exists.");
        return;
      }
  
      // Prepare the data for the new role
      const selectedPermissionIDs = selectedPermissions.map(
        (permission) => permission.value
      );
  
      const requestData = {
        sys_role_name: roleName,
        status: status.toLowerCase(),
        permissions: selectedPermissionIDs,
      };
  
      // Send the new role to the backend (API call)
      const response = await axios.post(
        "http://195.26.253.123/pos/accounts/add-system-role/",
        requestData
      );
  
      // Map permission IDs to their corresponding names (if needed)
      const newPermissions = selectedPermissions.map(
        (permission) => permission.label
      );
  
      // Construct the new role object with permission names
      const newRole = {
        sys_role_name: roleName,
        status: status,
        permissions: newPermissions.join(", "), // Join permission names as a string
      };
  
      // Optimistically update the roles state
      setRoles((prevRoles) => [...prevRoles, newRole]);
  
      // Re-fetch the roles from the backend to ensure the latest data
      const rolesResponse = await axios.get("http://195.26.253.123/pos/accounts/add-system-role/");
      setRoles(rolesResponse.data); // Update roles state with the fresh data
  
      // Clear input fields and error message
      setRoleName("");
      setSelectedPermissions([]);
      setErrorMessage("");
  
      alert("Role added successfully!");
    } catch (error) {
      console.error("Error adding role", error);
      setErrorMessage("Failed to add role.");
    }
  };
  

  const fetchRoles = () => {
    axios
      .get("http://195.26.253.123/pos/accounts/add-system-role/") // Replace with correct endpoint
      .then((response) => {
        setRoles(response.data); // Update roles with the latest data
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>System Roles</h2>

      {/* Role Name Input */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="roleName" style={{ display: "block", marginBottom: "5px" }}>
          Name:
        </label>
        <input
          type="text"
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Enter role name"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && <p style={{ color: "red", marginBottom: "20px" }}>{errorMessage}</p>}

      {/* Status Radio Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <label>Status:</label>
        <div>
          <label>
            <input
              type="radio"
              value="Active"
              checked={status === "Active"}
              onChange={(e) => setStatus(e.target.value)}
              style={{ marginRight: "5px" }}
            />
            Active
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              value="Inactive"
              checked={status === "Inactive"}
              onChange={(e) => setStatus(e.target.value)}
              style={{ marginRight: "5px" }}
            />
            Inactive
          </label>
        </div>
      </div>

      {/* Permissions Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="permissions" style={{ display: "block", marginBottom: "5px" }}>
          Permissions:
        </label>
        <Select
          id="permissions"
          options={permissions} // Dropdown options
          isMulti // Multi-select dropdown
          onChange={(selected) => setSelectedPermissions(selected)} // Update selected state
          value={selectedPermissions} // Bind selected options
          placeholder="Select permissions"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleAddRole}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add
      </button>

      {/* Roles Table */}
      <div style={{ marginTop: "40px" }}>
        <h3>Existing Roles</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Role Name</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Permissions</th>
            </tr>
          </thead>
          <tbody>
  {roles.length > 0 ? (
    roles.map((role, index) => (
      <tr key={index}>
        <td style={{ padding: "8px" }}>{role.sys_role_name}</td>
        <td style={{ padding: "8px" }}>{role.status}</td>
        <td style={{ padding: "8px" }}>
          {Array.isArray(role.permissions) && role.permissions.length > 0
            ? role.permissions.map((permission, i) => permission.permission_name).join(", ")
            : "No permissions assigned"}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" style={{ padding: "8px", textAlign: "center" }}>
        No roles added yet
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default SysRoles;
