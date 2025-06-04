import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../../styles/Delivery/PaymentPage.css';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [bankSlip, setBankSlip] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        // Generate a random order ID when component mounts
        const generateOrderId = () => {

            const randomNum = Math.floor(100000 + Math.random() * 900000);
            const timestamp = Date.now().toString().slice(-6);

            return `ORD-${randomNum}-${timestamp}`;
        };
        
        setOrderId(generateOrderId());

        // Get user email from token
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.sub) {
                    setUserEmail(decoded.sub);
                }
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setUploadStatus('File size too large (max 2MB)');
                return;
            }
            setBankSlip(file);
            setUploadStatus('File selected: ' + file.name);
        }
    };

    const sendNotification = async (message) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token available');
            return;
        }

        try {
            await fetch('http://localhost:8080/api/notifications/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: message
                })
            });
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    };

    const handleSubmit = async () => {
        if (!bankSlip) {
            setUploadStatus('Please upload a bank slip');
            return;
        }

        if (!userEmail) {
            setUploadStatus('Email not found. Please login again.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userEmail)) {
            setUploadStatus('Invalid email address');
            return;
        }

        if (userEmail.toLowerCase() === 'dinithi0425@gmail.com') {
            setUploadStatus('Invalid email address');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('slip', bankSlip);
            formData.append('userEmail', userEmail);
            formData.append('orderId', orderId);

            setUploadStatus('Uploading...');

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/email/upload-slip', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('Upload successful!');
                await sendNotification('Bank slip uploaded. Payment pending review.');
                navigate('/payment-confirmation', { state: { orderId } });
            } else {
                const errorText = await response.text();
                setUploadStatus(`Upload failed: ${errorText}`);
            }
        } catch (error) {
            setUploadStatus(`Network error: ${error.message}`);
        }
    };

    return (
        <div className="payment-container">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <div className="logo-section">
                        <div className="logo-icon"></div>
                        <h1 className="header-title">Payment Portal</h1>
                    </div>
                    <div className="user-icon"></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-grid">
                    {/* Payment Details Section */}
                    <div className="payment-details-section">
                        <div className="section-header">
                            <div className="section-icon payment-icon"></div>
                            <h2>Payment Details</h2>
                        </div>

                        <div className="bank-details-card">
                            <h3>Bank of Ceylon</h3>
                            <div className="bank-info">
                                <div className="info-row">
                                    <span className="info-label">Account Number</span>
                                    <span className="info-value">1002547896531</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Beneficiary Name</span>
                                    <span className="info-value">Gamindu Pasan</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Branch</span>
                                    <span className="info-value">Baththaramulla</span>
                                </div>
                            </div>
                        </div>


                        <div className="payment-illustration">
                            <div className="illustration-circle">
                                <div className="credit-card-icon"></div>
                            </div>
                            <p>Secure Bank Transfer</p>
                        </div>

                    </div>

                    {/* Upload Section */}
                    <div className="upload-section">
                        <div className="section-header">
                            <div className="section-icon upload-icon"></div>
                            <h2>Upload Bank Slip</h2>
                        </div>

                        <p className="upload-description">Please upload a bank slip or screenshot in case of online payment.</p>

                        {/* Email Input */}
                        <div className="input-group">
                            <label htmlFor="email">Your Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={userEmail}
                                readOnly
                                className="readonly-input"
                            />
                        </div>

                        {/* Order ID Input */}
                        <div className="input-group">
                            <label htmlFor="orderId">Order ID</label>
                            <input
                                type="text"
                                id="orderId"
                                value={orderId}
                                readOnly
                                className="readonly-input order-id"
                            />
                        </div>

                        {/* Terms Section */}
                        <div className="terms-section">
                            <h4>Terms of Use</h4>
                            <ol>
                                <li>The bank slip must clearly show the payment amount and bank stamp.</li>
                                <li>Uploading the wrong, unclear, or fake bank slip may result in payment failure.</li>
                                <li>You can upload bank slips in PNG, JPEG, or PDF format.</li>
                            </ol>
                        </div>

                        {/* File Upload */}
                        <div className="file-upload-section">
                            <input
                                type="file"
                                id="bank-slip"
                                accept=".png,.jpeg,.jpg,.pdf"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <label htmlFor="bank-slip" className="file-upload-label">
                                <div className="upload-icon-small"></div>
                                <span>{bankSlip ? bankSlip.name : 'Choose File'}</span>
                            </label>
                        </div>

                        {/* Upload Status */}
                        {uploadStatus && (
                            <div className={`upload-status ${uploadStatus.includes('successful') ? 'success' : 'error'}`}>
                                {uploadStatus.includes('successful') && <div className="success-icon"></div>}
                                <span>{uploadStatus}</span>
                            </div>
                        )}
                    </div>
                </div>

            </main>

            {/* Action Buttons */}
            <footer className="action-footer">
                <div className="footer-content">
                    <button onClick={() => navigate('/deliveryform')} className="back-button">
                        <span className="back-arrow">←</span>
                        <span>Back</span>
                    </button>
                    <button onClick={handleSubmit} className="continue-button">
                        Continue
                    </button>
                </div>
            </footer>

        </div>
    );
};

export default PaymentPage;