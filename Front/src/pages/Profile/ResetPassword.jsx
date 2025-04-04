import React, { useContext, useState, useRef } from 'react';
import { assets } from "../../assets/Profile/assets";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/Profile/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/Profile/ResetPassword.css';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef([]);

  const handleOtpInput = (e, index) => {
    const value = e.target.value;
    // Only allow numeric input
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/\D/g, '');
      return;
    }
    
    if (value.length > 0 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        navigate('/login');
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
        <form onSubmit={onSubmitNewPassword} className="reset-password-form password-form">
          <h1 className="reset-password-title">Reset Password</h1>
          <p className="reset-password-subtitle">Enter the OTP and new password</p>
          
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