import React from 'react';
import '../../styles/Delivery/PaymentConfirmation.css';

const PaymentConfirmation = () => {
    // Function to handle home button click without using useNavigate
    const goToHome = () => {
        window.location.href = '/';  // Basic navigation to home page
    };

    return (
        <div className="confirmation-container">
            <div className="header">
                <div className="logo-container"></div>
                <div className="user-icon"></div>
            </div>
            
            <div className="confirmation-content">
                <h2 className="processing-title">Payment Verification</h2>
                
                <div className="confirmation-message">
                    <p>Your payment is being processed and verified.</p>
                    <p>A confirmation email will be sent to your registered email address within 2 minutes.</p>
                    <p>Please check your inbox for the confirmation details.</p>
                </div>
                
                <div className="loading-indicator">
                    <div className="spinner"></div>
                </div>
            </div>
            
            <div className="action-buttons">
                <button className="home-button" onClick={goToHome}>Go to Home</button>
            </div>
        </div>
    );
};

export default PaymentConfirmation;