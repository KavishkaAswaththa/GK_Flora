import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Delivery/OrderConfirmation.css';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { deliveryDetails } = state || {};
    
    // Sample order items (would normally come from your cart/state)
    const orderItems = [
        { id: 1, name: 'GK FLORA', price: 1200, quantity: 1 },
        { id: 2, name: 'Cheriger', price: 800, quantity: 1 }
    ];

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleEditDelivery = () => {
        // Navigate directly to the delivery form with the current details
        navigate('/deliveryform', { state: { formData: deliveryDetails } });
    };

    const handlePlaceOrder = () => {
        // Here you would typically send both deliveryDetails and orderItems to your backend
        console.log('Placing order with:', { deliveryDetails, orderItems });
        alert('Order placed successfully!');
        navigate('/payment');
    };

    return (
        <div className="order-confirmation-container">
            <div className="header">
                <h1>Order Confirmation</h1>
                <div className="support-links">
                 
                </div>
            </div>
            
            <div className="content-container">
                <div className="delivery-details">
                    <h2>Delivery Information</h2>
                    <div className="detail-card">
                        <div className="detail-section">
                            <h3>Recipient</h3>
                            <p><strong>Name:</strong> {deliveryDetails?.name || 'Not provided'}</p>
                            <p><strong>Address:</strong> {deliveryDetails?.address || 'Not provided'}</p>
                            <p><strong>City:</strong> {deliveryDetails?.city || 'Not provided'}</p>
                            <p><strong>Contact:</strong> {deliveryDetails?.phone1 || 'Not provided'}</p>
                        </div>
                        
                        <div className="detail-section">
                            <h3>Sender</h3>
                            <p><strong>Name:</strong> {deliveryDetails?.senderName || 'Not provided'}</p>
                            {deliveryDetails?.senderEmail && (
                                <p><strong>Email:</strong> {deliveryDetails.senderEmail}</p>
                            )}
                            <p><strong>Phone:</strong> {deliveryDetails?.phone2 || 'Not provided'}</p>
                        </div>
                        
                        <div className="detail-section">
                            <h3>Delivery Schedule</h3>
                            <p><strong>Date:</strong> {deliveryDetails?.deliveryDate || 'Not specified'}</p>
                            <p><strong>Time:</strong> {deliveryDetails?.deliveryTime || 'Not specified'}</p>
                            {deliveryDetails?.deliveryType && (
                                <p><strong>Type:</strong> {deliveryDetails.deliveryType}</p>
                            )}
                            {deliveryDetails?.message && (
                                <p><strong>Special Instructions:</strong> {deliveryDetails.message}</p>
                            )}
                        </div>
                        
                        <button 
                            className="edit-button"
                            onClick={handleEditDelivery}
                        >
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
                    
                    <div className="delivery-type">
                        <h3>Delivery Type</h3>
                        <div className="delivery-type-info">
                            {deliveryDetails?.deliveryType === 'express' && (
                                <p>Get delivered to your door step</p>
                            )}
                            {deliveryDetails?.deliveryType === 'priority' && (
                                <p>Pickup From Your Nearest Branch</p>
                            )}
                            {(!deliveryDetails?.deliveryType || deliveryDetails?.deliveryType === 'select') && (
                                <p>Standard delivery</p>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        className="place-order-button"
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;