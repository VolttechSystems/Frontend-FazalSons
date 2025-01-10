import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import './RegisterUser.css';

function RegisterUser() {
  const [systemRoles, setSystemRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false); 
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    email: "",
    phone_number: "",
    is_staff: false,
    is_active: true,
    system_roles: []
  });
  const [userList, setUserList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ username: "", user_id: null });
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordErrors, setNewPasswordErrors] = useState([]); // Declare the state for errors
  const [passwordChangeMessage, setPasswordChangeMessage] = useState(null);




  // Fetch system roles from API
  useEffect(() => {
    axios
      .get("http://195.26.253.123/pos/accounts/fetch-system-role/")
      .then((response) => {
        const roles = response.data.map((role) => ({
          value: role.id,
          label: role.sys_role_name
        }));
        setSystemRoles(roles);
      })
      .catch((error) => console.log("Error fetching system roles:", error));

    // Fetch existing users from backend
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://195.26.253.123/pos/accounts/register_user/")
      .then((response) => {
        console.log("Fetched Users Data:", response.data); // Debug log
        if (Array.isArray(response.data.results)) {
          setUserList(response.data.results); // Use the "results" array
        } else {
          console.error("Unexpected data format:", response.data);
        }
      })
      .catch((error) => console.log("Error fetching users:", error));
  };

  const handleEditClick = (user) => {
    console.log("Edit user clicked:", user); // Debugging
    setSelectedUser({ username: user.username, user_id: user.id });
    setShowEditModal(true);
  };
  
  const handlePasswordChange = () => {
    const payload = {
      user_id: selectedUser.user_id,
      new_password: newPassword,
    };
  
    axios
      .post("http://195.26.253.123/pos/accounts/admin-change-password/", payload)
      .then((response) => {
        // Log the entire response to make sure the message is in the response
        console.log("Response from backend:", response);
  
        // Check if message exists in response.data
        if (response.data && response.data.message) {
          setPasswordChangeMessage(response.data.message);
        } else {
          console.log("No message found in response data");
        }
  
        // Reset the modal and password fields after success
        setShowEditModal(false);
        setNewPassword("");
        setNewPasswordErrors([]); // Reset errors on success
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        if (error.response && error.response.data) {
          setNewPasswordErrors(error.response.data.new_password || []); // Set errors if available
        }
      });
  };
  

  

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };



  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle multi-select change
  const handleMultiSelectChange = (selectedOptions) => {
    const selectedRoles = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData({
      ...formData,
      system_roles: selectedRoles,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://195.26.253.123/pos/accounts/register_user", formData)
      .then((response) => {
        console.log("User registered successfully:", response);
        fetchUsers(); // Refresh user list after successful submission
        setFormData({
          first_name: "",
          last_name: "",
          username: "",
          password: "",
          email: "",
          phone_number: "",
          is_staff: false,
          is_active: true,
          system_roles: []
        });
      })
      .catch((error) => console.log("Error registering user:", error));
  };

    // Handle user delete
    const handleDelete = (userId) => {
      if (window.confirm("Are you sure you want to delete this user?")) {
        axios
          .delete(`http://195.26.253.123/pos/accounts/delete_user/${userId}`)
          .then((response) => {
            console.log("User deleted successfully:", response);
            fetchUsers(); // Refresh the user list
          })
          .catch((error) => console.error("Error deleting user:", error));
      }
    };

  return (
    <div className="container">
        {passwordChangeMessage && (
      <div className="alert alert-success" role="alert">
        {passwordChangeMessage}
      </div>
    )}
      <h2>Register User</h2>
      <form className="form" onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="input-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
  <label>Password</label>
  <div className="password-wrapper">
    <input
      type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      required
      placeholder="Enter your password"
    />
    <span
      className="toggle-password"
      onClick={togglePasswordVisibility}
      style={{ cursor: "pointer" }}
    >
      <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i> {/* Professional Eye Icon */}
    </span>
  </div>
</div>

 {/* Show password validation errors */}
 {newPasswordErrors.length > 0 && (
          <div className="password-errors">
            {newPasswordErrors.map((error, index) => (
              <p key={index} className="error-message">{error}</p>
            ))}
          </div>
        )}
        
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>
            Is Staff
            <input
              type="checkbox"
              name="is_staff"
              checked={formData.is_staff}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="input-group">
          <label>
            Is Active
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="input-group">
          <label>System Roles</label>
          <Select
            isMulti
            name="system_roles"
            options={systemRoles}
            onChange={handleMultiSelectChange}
            value={systemRoles.filter(role =>
              formData.system_roles.includes(role.value))}
            placeholder="Select roles"
          />
        </div>
        <button className="addUser-button1" type="submit">Add User</button>
      </form>
    


      {/* User Table */}
     
<h3 className="user-table-title">Registered Users</h3>
<table className="user-table">
  <thead className="user-table-header">
    <tr>
      <th className="user-table-header-item">First Name</th>
      <th className="user-table-header-item">Last Name</th>
      <th className="user-table-header-item">Username</th>
      <th className="user-table-header-item">Email</th>
      <th className="user-table-header-item">Actions</th>
    </tr>
  </thead>

        <tbody>
        {userList.length > 0 ? (
    userList.map((user, index) => (
      <tr key={index}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.username}</td>
                <td>{user.email || "N/A"}</td>
                <td>
                <button
                    onClick={() => handleEditClick(user)}
                    className="edit-button1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)} // Pass user ID dynamically
                    className="del-button1"
                  >
                    Delete
                  </button>
                 
                </td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showEditModal && selectedUser && (
  <div className="modal show">
    <div className="modal-content">
      <h3 className="modal-title">Change Password</h3>
      <p className="modal-username">
        Username: <strong>{selectedUser.username}</strong>
      </p>
      <input
        type="password"
        className="modal-input"
        id="new-password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
       
        />
        
        {/* Display password validation errors */}
        {newPasswordErrors.length > 0 && (
          <div className="password-errors">
            {newPasswordErrors.map((error, index) => (
              <p key={index} className="error-message">{error}</p>
            ))}
          </div>
        )}


     <div className="modal-buttons">
  <button className="modal-btn modal-update-btn" onClick={handlePasswordChange}>
    Update Password
  </button>
  <button className="modal-btn modal-cancel-btn" onClick={() => setShowEditModal(false)}>
    Cancel
  </button>
</div>

    </div>
  </div>
)}


    </div>
  );
}

export default RegisterUser;
