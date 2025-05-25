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
            const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
            const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
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
            <div className="header">
                <div className="logo-container"></div>
                <div className="user-icon"></div>
            </div>

            <div className="payment-content">
                <div className="payment-details">
                    <h2>Payment Details</h2>
                    <div className="bank-details">
                        <h3>Bank of Ceylon</h3>
                        <div className="detail-item"><span>Account Number - </span><span>1002547896531</span></div>
                        <div className="detail-item"><span>Beneficiary Name - </span><span>Gamindu Pasan</span></div>
                        <div className="detail-item"><span>Branch - </span><span>Baththaramulla</span></div>
                    </div>
                    <div className="payment-icon">
                        <img src="src/images/delivery/payment.png" alt="Payment" />
                    </div>
                </div>

                <div className="upload-section">
                    <h2>Upload Bank Slip</h2>
                    <p>Please upload a bank slip or screenshot in case of online payment.</p>

                    <div className="email-input">
                        <label htmlFor="email">Your Email Address:</label>
                        <input
                            type="email"
                            id="email"
                            value={userEmail}
                            readOnly
                        />
                    </div>

                    <div className="orderid-input">
                        <label htmlFor="orderId">Order ID:</label>
                        <input
                            type="text"
                            id="orderId"
                            value={orderId}
                            readOnly
                        />
                    </div>

                    <div className="terms-section">
                        <h4>Terms of Use</h4>
                        <ol>
                            <li>The bank slip must clearly show the payment amount and bank stamp.</li>
                            <li>Uploading the wrong, unclear, or fake bank slip may result in payment failure.</li>
                            <li>You can upload bank slips in PNG, JPEG, or PDF format.</li>
                        </ol>
                    </div>

                    <div className="file-upload">
                        <input
                            type="file"
                            id="bank-slip"
                            accept=".png,.jpeg,.jpg,.pdf"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="bank-slip">Choose File</label>
                        {bankSlip && <span>{bankSlip.name}</span>}
                    </div>
                    {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
                </div>
            </div>

            <div className="action-buttons">
                <button className="back-button" onClick={() => navigate('/deliveryform')}>Back</button>
                <button className="continue-button" onClick={handleSubmit}>Continue</button>
            </div>
        </div>
    );
};

export default PaymentPage;