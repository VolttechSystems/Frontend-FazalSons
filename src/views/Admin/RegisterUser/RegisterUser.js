import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import './RegisterUser.css';

function RegisterUser() {
  const [systemRoles, setSystemRoles] = useState([]);
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
      .get("http://195.26.253.123/pos/accounts/register_user/") // Ensure this is correct endpoint
      .then((response) => {
        console.log(response.data); // Log the response to check its structure
        if (Array.isArray(response.data)) {
          setUserList(response.data); // Assuming the data is an array
        } else {
          console.error("Data is not in expected format", response.data);
        }
      })
      .catch((error) => console.log("Error fetching users:", error));
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

  return (
    <div className="container">
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
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit">Add User</button>
      </form>

      {/* User Table */}
      <h3>Registered Users</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>System Roles</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(userList) && userList.length > 0 ? (
            userList.map((user, index) => (
              <tr key={index}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.username}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.phone_number || "N/A"}</td>
                <td>
                  {user.system_roles &&
                    user.system_roles.map((role) => role.sys_role_name).join(", ")}
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
    </div>
  );
}

export default RegisterUser;
