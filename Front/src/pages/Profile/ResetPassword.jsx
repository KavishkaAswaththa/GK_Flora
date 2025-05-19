import React, { useContext, useState, useRef } from 'react';
import { assets } from "../../assets/Profile/assets"; // Importing assets like icons
import { useNavigate } from 'react-router-dom'; // For navigation after password reset
import { AppContext } from '../../context/Profile/AppContext'; // Context to access backend URL
import axios from 'axios'; // For making HTTP requests
import { toast } from 'react-toastify'; // For showing success/error messages
import '../../styles/Profile/ResetPassword.css'; // CSS for styling

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext); // Get backend URL from context
  const navigate = useNavigate(); // Hook for navigation
  
  // States
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false); // Controls form steps
  const [isLoading, setIsLoading] = useState(false); // Loading spinner
  const otpRefs = useRef([]); // For accessing OTP input fields

  // Handle input in OTP boxes
  const handleOtpInput = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) { // Allow only digits
      e.target.value = value.replace(/\D/g, '');
      return;
    }

    // Move to next input automatically
    if (value.length > 0 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Navigate back to previous input on backspace
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Handle OTP paste (fills multiple fields)
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.replace(/\D/g, '').split('').slice(0, 6);
    
    pasteArray.forEach((char, index) => {
      if (otpRefs.current[index]) {
        otpRefs.current[index].value = char;
      }
    });
  };

  // Handle email submission (step 1)
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true); // Move to OTP/password form
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new password submission (step 2)
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const otp = otpRefs.current.map(input => input.value).join('');
      
      if (otp.length !== 6) {
        toast.error('Please enter the 6-digit OTP');
        return;
      }

      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword
      });
      
      if (data.success) {
        toast.success('Password reset successfully!');
        navigate('/login'); // Redirect to login page
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-page">

      {/* Form for email input */}
      {!isEmailSent ? (
        <form onSubmit={onSubmitEmail} className="reset-password-form email-form">
          <h1 className="reset-password-title">Reset Password</h1>
          <p className="reset-password-subtitle">Enter your registered email address</p>
          
          <div className="input-container">
            <img src={assets.mail_icon} alt="Email" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      ) : (
        // Form for OTP and new password
        <form onSubmit={onSubmitNewPassword} className="reset-password-form password-form">
          <h1 className="reset-password-title">Reset Password</h1>
          <p className="reset-password-subtitle">Enter the OTP and new password</p>
          
          {/* OTP Input */}
          <div className="otp-container" onPaste={handleOtpPaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={el => otpRefs.current[index] = el}
                onInput={(e) => handleOtpInput(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                required
                disabled={isLoading}
                pattern="\d*"
                inputMode="numeric"
              />
            ))}
          </div>

          {/* New Password Input */}
          <div className="input-container">
            <img src={assets.lock_icon} alt="Password" />
            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
