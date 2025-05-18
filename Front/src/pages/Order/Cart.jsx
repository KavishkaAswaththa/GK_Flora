import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../styles/Order/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/cart');
      setCartItems(response.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load cart items');
      setLoading(false);
      console.error('Error fetching cart items:', err);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`http://localhost:8080/api/cart/items/${itemId}`, {
        quantity: newQuantity
      });

      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/items/${itemId}`);
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (err) {
      setError('Failed to remove item');
      console.error('Error removing item:', err);
    }
  };

  const getItemSubtotal = (item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    return price * quantity;
  };

  const calculateTotals = () => {
    const subTotal = cartItems.reduce((total, item) => total + getItemSubtotal(item), 0);
    return {
      subTotal,
      flatDiscount: 0,
      total: subTotal
    };
  };

  const handleCheckout = () => {
    const totals = calculateTotals();
    navigate('/deliveryform', {
      state: {
        cartItems,
        orderSummary: {
          subTotal: totals.subTotal,
          flatDiscount: totals.flatDiscount,
          total: totals.total,
          itemCount: cartItems.length,
          source: 'cart'
        }
      }
    });
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;

  const totals = calculateTotals();

  return (
    <div className="cart-container">
      <div className="cart-items-container">
        <div className="cart-header">
          <div className="header-item">Item</div>
          <div className="header-quantity">Quantity</div>
          <div className="header-subtotal">Sub Total</div>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty</div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <div className="item-image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Rs. {(item.price || 0).toFixed(2)}</p>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity || 0}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, (item.quantity || 0) + 1)}
                >
                  +
                </button>
              </div>

              <div className="item-subtotal">
                Rs. {getItemSubtotal(item).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="item-count">{cartItems.length} item(s)</div>

        <div className="summary-details">
          <div className="summary-row">
            <span>Sub Total:</span>
            <span>Rs. {totals.subTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Flat Discount:</span>
            <span>Rs. {totals.flatDiscount.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>Rs. {totals.total.toFixed(2)}</span>
          </div>
        </div>

        <button className="checkout-button" onClick={handleCheckout}>
          CHECKOUT
        </button>
        <button className="continue-shopping" onClick={handleContinueShopping}>
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
};

export default Cart;