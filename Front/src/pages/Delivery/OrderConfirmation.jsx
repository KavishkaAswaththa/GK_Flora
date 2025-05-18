import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Delivery/OrderConfirmation.css";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { deliveryDetails, orderSummary } = state || {};
  const { flowers = [], wrappingPaper = null } = orderSummary || {};

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Group flowers by name
    const groupedFlowers = flowers.reduce((acc, flower) => {
      const key = flower.name;
      if (!acc[key]) {
        acc[key] = { ...flower, quantity: 1 };
      } else {
        acc[key].quantity += 1;
      }
      return acc;
    }, {});
    const flowerItems = Object.values(groupedFlowers);
    setCartItems(flowerItems);
    setLoading(false);
  }, [flowers]);

  const calculateTotal = () => {
    const flowerTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const wrappingTotal = wrappingPaper?.price || 0;
    return flowerTotal + wrappingTotal;
  };

  const handleEditDelivery = () => {
    navigate("/deliveryform", { state: { formData: deliveryDetails } });
  };

  const handlePlaceOrder = () => {
    console.log("Order submitted:", { deliveryDetails, cartItems, wrappingPaper });
    alert("Order placed successfully!");
    navigate("/payment");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="order-confirmation-container">
      <div className="header">
        <h1>Order Confirmation</h1>
      </div>

      <div className="content-container">
        {/* Delivery Info */}
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
              {deliveryDetails?.senderEmail && <p><strong>Email:</strong> {deliveryDetails.senderEmail}</p>}
              <p><strong>Phone:</strong> {deliveryDetails?.phone2 || 'Not provided'}</p>
            </div>

            <div className="detail-section">
              <h3>Delivery Schedule</h3>
              <p><strong>Date:</strong> {deliveryDetails?.deliveryDate || 'Not specified'}</p>
              <p><strong>Time:</strong> {deliveryDetails?.deliveryTime || 'Not specified'}</p>
              {deliveryDetails?.deliveryType && <p><strong>Type:</strong> {deliveryDetails.deliveryType}</p>}
              {deliveryDetails?.message && <p><strong>Special Instructions:</strong> {deliveryDetails.message}</p>}
            </div>

            <button className="edit-button" onClick={handleEditDelivery}>
              Edit Delivery Details
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-card">
            {cartItems.map((item) => (
              <div key={item.id + item.name} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">Rs. {item.price.toFixed(2)}</span>
                </div>
                <div className="item-quantity">
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
            ))}

            {wrappingPaper && (
              <div className="order-item">
                <div className="item-info">
                  <span className="item-name">Wrapping Paper</span>
                  <span className="item-price">Rs. {wrappingPaper.price.toFixed(2)}</span>
                </div>
                <div className="item-quantity">
                  <span>Qty: 1</span>
                </div>
              </div>
            )}

            <div className="total-section">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>Rs. {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee:</span>
                <span>Rs. 350.00</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>Rs. {(calculateTotal() + 350).toFixed(2)}</span>
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
