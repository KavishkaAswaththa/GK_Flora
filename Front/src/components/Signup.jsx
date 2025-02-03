import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // Import icons
import "../styles/Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/api/v1/details/signup", {
        username,
        email,
        password,
      });

      if (response.data === "Signup successful!") {
        alert("Signup successful!");
        navigate("/login"); // Redirect to login page
      } else {
        alert(response.data);
      }
    } catch (err) {
      alert("Signup failed.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <p>Create your account</p>
      <form onSubmit={handleSignup}>
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className="icon" />
          </div>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
        </div>

        <button type="submit" className="btn-signup">Sign Up</button>

        <div className="divider">
          <span>Or</span>
        </div>

        <button type="button" className="btn-google">
          Sign in with Google
        </button>

        <p className="signin-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
