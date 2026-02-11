import React, { useState } from "react";
import { Link } from "react-router-dom";
 
function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registration Successful\n" + JSON.stringify(formData, null, 2));
  };
 
  return (
    <div className="container">
      <div className="form-box">
        <h2>WasteZero Registration</h2>
 
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
 
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
 
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
 
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="agent">Pickup Agent</option>
            <option value="admin">Admin</option>
          </select>
 
          <button type="submit">Register</button>
        </form>
 
        <p className="toggle">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
 
export default Register