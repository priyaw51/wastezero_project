import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import MapPicker from "../components/MapPicker";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    skills: "",
    bio: "",
    latitude: "",
    longitude: "",
    address: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showOtpInput) {
      // Verify OTP logic
      try {
        const response = await axios.post("http://localhost:3000/api/auth/verify-otp", {
          email: formData.email,
          otp: otp
        });
        alert("Verification Successful! You are now logged in.");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } catch (error) {
        console.error("Verification Error:", error);
        alert("Verification Failed: " + (error.response?.data?.message || "Invalid OTP"));
      }
    } else {
      // Register and Send OTP logic
      const submissionData = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        location: {
          type: "Point",
          coordinates: [
            parseFloat(formData.longitude) || 0,
            parseFloat(formData.latitude) || 0,
          ],
        },
      };
      delete submissionData.latitude;
      delete submissionData.longitude;

      try {
        // Temporarily use register endpoint which now sends OTP
        const response = await axios.post("http://localhost:3000/api/auth/register", submissionData);
        alert(response.data.message);
        setShowOtpInput(true);
      } catch (error) {
        console.error("Registration Error:", error);
        alert("Registration Failed: " + (error.response?.data?.message || "An error occurred during registration."));
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box register-box">
        <h2>WasteZero Registration</h2>

        <form onSubmit={handleSubmit} className="register-form">
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

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
          />

          <textarea
            name="bio"
            placeholder="Short Bio"
            value={formData.bio}
            onChange={handleChange}
            rows="2"
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          ></textarea>

          <div className="full-width">
            <label style={{ display: "block", marginBottom: "5px" }}>
              Select Location on Map:
            </label>
            <MapPicker
              onLocationSelect={handleLocationSelect}
              initialLat={formData.latitude}
              initialLng={formData.longitude}
            />
          </div>

          <div className="full-width">
            <input
              type="text"
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div
            className="full-width"
            style={{ display: "flex", gap: "10px" }}
          >
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="any"
              style={{ flex: 1 }}
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="any"
              style={{ flex: 1 }}
            />
          </div>

          {showOtpInput && (
            <div className="full-width">
              <label style={{ display: "block", marginBottom: "5px", color: "green", fontWeight: "bold" }}>
                OTP Sent to email! Enter code below:
              </label>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="full-width">
            {showOtpInput ? "Verify & Register" : "Register"}
          </button>
        </form>

        <p className="toggle">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register