import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { deliveryDetails } = state || {};

    const orderItems = [
        { id: 1, name: 'GK FLORA', price: 1200, quantity: 1 },
        { id: 2, name: 'Cheriger', price: 800, quantity: 1 }
    ];

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleEditDelivery = () => {
        navigate('/payment', { state: { deliveryDetails } });
    };

    const handlePlaceOrder = () => {
        console.log('Placing order with:', { deliveryDetails, orderItems });
        alert('Order placed successfully!');
        navigate('/payment');
    };

    useEffect(() => {
        // Dynamically add the CSS file when this component is mounted
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/styles/OrderConfirmation.css'; // Make sure this file exists in the public folder
        link.id = 'order-confirmation-style';

        document.head.appendChild(link);

        return () => {
            document.getElementById('order-confirmation-style')?.remove();
        };
    }, []);

    return (
        <div className="order-confirmation-container">
            <div className="header">
                <h1>Order Confirmation</h1>
            </div>

            <div className="content-container">
                <div className="delivery-details">
                    <h2>Delivery Information</h2>
                    <div className="detail-card">
                        <div className="detail-section">
                            <h3>Recipient</h3>
                            <p><strong>Name:</strong> {deliveryDetails?.recipientName || 'Not provided'}</p>
                            <p><strong>Address:</strong> {deliveryDetails?.address || 'Not provided'}</p>
                            <p><strong>City:</strong> {deliveryDetails?.city || 'Not provided'}</p>
                            <p><strong>Contact:</strong> {deliveryDetails?.contactNumber || 'Not provided'}</p>
                        </div>
                        <div className="detail-section">
                            <h3>Sender</h3>
                            <p><strong>Name:</strong> {deliveryDetails?.senderName || 'Not provided'}</p>
                            {deliveryDetails?.senderEmail && (
                                <p><strong>Email:</strong> {deliveryDetails.senderEmail}</p>
                            )}
                            <p><strong>Phone:</strong> {deliveryDetails?.senderPhone || 'Not provided'}</p>
                        </div>
                        <div className="detail-section">
                            <h3>Delivery Schedule</h3>
                            <p><strong>Date:</strong> {deliveryDetails?.deliveryDate || 'Not specified'}</p>
                            <p><strong>Time:</strong> {deliveryDetails?.deliveryTime || 'Not specified'}</p>
                        </div>
                        <button className="edit-button" onClick={handleEditDelivery}>
                            Edit Delivery Details
                        </button>
                    </div>
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-card">
                        {orderItems.map(item => (
                            <div key={item.id} className="order-item">
                                <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">Rs. {item.price.toFixed(2)}</span>
                                </div>
                                <div className="item-quantity">
                                    <span>Qty: {item.quantity}</span>
                                </div>
                            </div>
                        ))}

                        <div className="total-section">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>Rs. {calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="total-row">
                                <span>Delivery Fee:</span>
                                <span>Rs. 200.00</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total:</span>
                                <span>Rs. {(calculateTotal() + 200).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button className="place-order-button" onClick={handlePlaceOrder}>
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
