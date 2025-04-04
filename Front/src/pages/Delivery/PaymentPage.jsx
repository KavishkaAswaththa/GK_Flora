import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Delivery/PaymentPage.css';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [bankSlip, setBankSlip] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setUploadStatus('File size too large (max 2MB)');
                return;
            }
            setBankSlip(file);
            setUploadStatus('File selected: ' + file.name);
        }
    };

    const sendNotification = async (message) => {
        try {
            await fetch('http://localhost:8080/api/notifications/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: 'yosa', // Replace with actual user ID
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
        
        try {
            const formData = new FormData();
            formData.append('file', bankSlip);
            formData.append('orderId', '12345'); // Replace with actual order ID
            
            setUploadStatus('Uploading...');
            
            const response = await fetch('http://localhost:8080/api/bank-slips/upload', {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                setUploadStatus('Upload successful!');
                await sendNotification('Your bank slip has been uploaded successfully. The admin will review it soon. Your payment is pending.');
                navigate('/payment-confirmation'); // Changed to payment-confirmation
            } else {
                const errorText = await response.text();
                setUploadStatus(`Upload failed: ${errorText}`);
            }
        
        } catch (error) {
            setUploadStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="payment-container">
            <div className="header">
           
        <div className="logo-container">
        
        </div>
                <div className="user-icon">
                
                </div>
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
                    <p>Please upload a bank slip or screenshot in case of online payment for the selected items.</p>
                    
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
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                <button className="continue-button" onClick={handleSubmit}>Continue</button>
            </div>
        </div>
    );
};

export default PaymentPage;
