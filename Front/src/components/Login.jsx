import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../styles/Login.css";
import Google from "../images/Google.png";
import Facebook from "../images/Facebook.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/v1/details/login", {
        email,
        password,
      });

      if (response.status === 200 && response.data === "Login successful!") {
        localStorage.setItem("userEmail", email); // Store email
        navigate("/userdetails");
      } else {
        alert(response.data);
      }
    } catch (err) {
      alert("Login failed.");
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In to GK Flora Account</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email Address</label>
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
        </div>

        <button type="submit" className="btn-signin">Sign In</button>

        <button type="button" className="btn-back" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <div className="links">
          <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
          <span>Forgot password? <Link to="/reset">Reset</Link></span>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <img src={Google} alt="Google" />
          <img src={Facebook} alt="Facebook" />
        </div>
      </form>
    </div>
  );
};

export default Login;
