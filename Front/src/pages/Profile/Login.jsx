import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/Profile/assets';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/Profile/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/Profile/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useAppContext();

  // Toggle between 'login' and 'register' mode
  const [authState, setAuthState] = useState('login');

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Submission and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect to account page if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/account-details', { replace: true });
    }
  }, [navigate]);

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authState === 'register' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for the specific field when changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission for login or register
  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    // Stop if form is invalid
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const endpoint = authState === 'register' ? 'register' : 'login';
      const payload = authState === 'register'
        ? formData
        : { email: formData.email, password: formData.password };

      const response = await axios.post(
        `${backendUrl}/api/auth/${endpoint}`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (response.data?.token) {
        // Save token to localStorage and set default header
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // Fetch user data and update login state
        await getUserData();
        setIsLoggedIn(true);

        // Success message and redirect
        toast.success(authState === 'register' ? 'Registration successful!' : 'Login successful!');
        navigate('/account-details', { replace: true });
      } else {
        // Show error if no token
        toast.error(response.data?.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);

      // Handle validation or network errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle between login and register mode
  const toggleAuthState = () => {
    setAuthState(prev => (prev === 'login' ? 'register' : 'login'));
    setErrors({});
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left image for register view */}
        {authState === 'register' && (
          <div className="login-image-container">
            <img src={assets.background} alt="Visual" />
          </div>
        )}

        <div className="login-box">
          <h2 className="login-title">
            {authState === 'register' ? 'Create Account' : 'Welcome GK Flora'}
          </h2>

          <p className="login-subtitle">
            {authState === 'register'
              ? 'Join our community today'
              : 'Sign in to continue your journey'}
          </p>

          {/* Login/Register form */}
          <form onSubmit={handleAuthSubmit} noValidate>
            {/* Name field for register only */}
            {authState === 'register' && (
              <div className="input-container">
                <img src={assets.person_icon} alt="Name" />
                <input
                  name="name"
                  onChange={handleInputChange}
                  value={formData.name}
                  type="text"
                  placeholder="Full Name"
                  className={errors.name ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
            )}

            {/* Email input */}
            <div className="input-container">
              <img src={assets.mail_icon} alt="Email" />
              <input
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                type="email"
                placeholder="Email Address"
                className={errors.email ? 'input-error' : ''}
                disabled={isSubmitting}
                autoComplete="username"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Password input */}
            <div className="input-container">
              <img src={assets.lock_icon} alt="Password" />
              <input
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                type="password"
                placeholder="Password"
                className={errors.password ? 'input-error' : ''}
                disabled={isSubmitting}
                autoComplete={authState === 'register' ? 'new-password' : 'current-password'}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Forgot password link (only for login) */}
            {authState === 'login' && (
              <p
                onClick={() => navigate('/reset-password')}
                className="forgot-password"
              >
                Forgot password?
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner">Processing...</span>
              ) : (
                authState === 'register' ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>

          {/* Switch between login/register */}
          <p className="switch-text">
            {authState === 'register'
              ? 'Already have an account? '
              : "Don't have an account? "}
            <span
              onClick={toggleAuthState}
              className="switch-link"
              style={{ cursor: 'pointer' }}
            >
              {authState === 'register' ? 'Sign in' : 'Sign up'}
            </span>
          </p>
        </div>

        {/* Right image for login view */}
        {authState === 'login' && (
          <div className="login-image-container">
            <img src={assets.background} alt="Visual" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
