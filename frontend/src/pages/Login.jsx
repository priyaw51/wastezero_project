import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, verifyOtp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showOtpInput) {
      // Verify OTP logic
      try {
        await verifyOtp({
          email: formData.email,
          otp: otp
        });
        alert("Login Successful!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Verification Error:", error);
        alert("Verification Failed: " + (error.response?.data?.message || "Invalid OTP"));
      }
    } else {
      // Login and Send OTP
      try {
        const response = await login(formData); // This now calls AuthService.login which returns data but doesn't set context user yet
        alert(response.message);
        setShowOtpInput(true);
      } catch (error) {
        console.error("Error:", error);
        alert("Login Failed: " + (error.response?.data?.message || "Invalid credentials"));
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>WasteZero Login</h2>

        <form onSubmit={handleSubmit}>
          {!showOtpInput ? (
            <>
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
            </>
          ) : (
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

          <button type="submit">{showOtpInput ? "Verify OTP" : "Login"}</button>
        </form>

        <p className="toggle">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;