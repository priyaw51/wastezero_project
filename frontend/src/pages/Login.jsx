import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
 
function Login() {
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login Successful\n" + JSON.stringify(formData, null, 2));
    navigate("/");
  };
 
  return (
    <div className="container">
      <div className="form-box">
        <h2>WasteZero Login</h2>
 
        <form onSubmit={handleSubmit}>
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
 
          <button type="submit">Login</button>
        </form>
 
        <p className="toggle">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
 
export default Login;