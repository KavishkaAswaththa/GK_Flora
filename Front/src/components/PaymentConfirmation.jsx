import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentConfirmation.css';

const PaymentConfirmation = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(120); // 120 seconds = 2 minutes
    const [paymentStatus, setPaymentStatus] = useState('processing'); // 'processing' or 'completed'
    
    useEffect(() => {
        // Start the countdown timer
        if (timeLeft > 0 && paymentStatus === 'processing') {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && paymentStatus === 'processing') {
            // When timer reaches zero, change payment status to completed
            setPaymentStatus('completed');
        }
    }, [timeLeft, paymentStatus]);
    
    return (
        <div className="payment-confirmation">
            <div className="confirmation-container">
                <div className="header">
                    <div className="logo-container">
                        <img src="src/images/logo.png" alt="GE FLORA" className="logo" />
                    </div>
                </div>
                
                <div className="confirmation-content">
                    {paymentStatus === 'processing' ? (
                        <>
                            <h2>Payment Processing</h2>
                            <div className="countdown-timer">
                                <p>Estimated time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                            </div>
                            <div className="confirmation-message">
                                <p>Please wait a moment until your payment is completed.</p>
                                <p>Once your payment is successful, your order will be confirmed.</p>
                            </div>
                            
                            <div className="loading-indicator">
                                <div className="spinner"></div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>Payment Successful!</h2>
                            <div className="success-icon">
                                <div className="checkmark">✓</div>
                            </div>
                            <div className="confirmation-message">
                                <p>Your payment has been processed successfully.</p>
                                <p>A confirmation email has been sent to your registered email address.</p>
                                <p>Your order number is: <strong>#{Math.floor(100000 + Math.random() * 900000)}</strong></p>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="action-buttons">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    <button className="home-button" onClick={() => navigate('/to-be-delivery')}>Order Status</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmation;
