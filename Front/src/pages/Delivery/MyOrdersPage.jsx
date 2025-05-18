import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/Delivery/MyOrdersPage.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    TO_BE_SHIPPED: 0,
    SHIPPED: 0,
    COMPLETE: 0
  });

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/orders/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      
      // Calculate status counts from fetched orders
      const counts = {
        TO_BE_SHIPPED: 0,
        SHIPPED: 0,
        COMPLETE: 0
      };
      
      response.data.forEach(order => {
        if (counts.hasOwnProperty(order.status)) {
          counts[order.status]++;
        }
      });
      
      setStatusCounts(counts);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Check if there are updated status counts in localStorage
    const savedCounts = localStorage.getItem('orderStatusCounts');
    if (savedCounts) {
      try {
        const parsedCounts = JSON.parse(savedCounts);
        setStatusCounts(prevCounts => ({
          ...prevCounts,
          ...parsedCounts
        }));
      } catch (err) {
        console.error('Error parsing saved status counts:', err);
      }
    }
    
    // Add event listener for real-time updates from AdminPaymentReview page
    const handleStatusUpdate = (event) => {
      console.log('Status update received:', event.detail);
      if (event.detail?.statusCounts) {
        setStatusCounts(prevCounts => ({
          ...prevCounts,
          ...event.detail.statusCounts
        }));
        
        // Refresh orders to show latest statuses
        fetchOrders();
      }
    };
    
    window.addEventListener('orderStatusUpdated', handleStatusUpdate);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('orderStatusUpdated', handleStatusUpdate);
    };
  }, []);

  return (
    <div className="my-orders-container">
      <div className="orders-content">
        <div className="orders-header">
          <h1>My Orders</h1>
        </div>

        {/* Order status banner with updated counts */}
        <div className="order-status-tabs">
          {['TO_BE_SHIPPED', 'SHIPPED', 'COMPLETE'].map((status) => (
            <div className="status-tab" key={status}>
              <div className={`status-icon ${status?.toLowerCase()}`}>
                <img
                  src={`src/images/delivery/${status?.toLowerCase().replace(/_/g, '-')}.png`}
                  alt={status}
                />
                <span className="badge">
                  {statusCounts[status] || 0}
                </span>
              </div>
              <p>{status?.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>

        {/* No orders message */}
        {orders.length === 0 && (
          <div className="no-orders">
            <p>You have no orders yet.</p>
          </div>
        )}

        {/* Orders List */}
        {orders.map((order) => (
          <div key={order.id} className="order-container">
            {/* Order Header */}
            <div className="order-header">
              <div className="order-status">
                <p>{order.status.replace(/_/g, ' ')}</p>
              </div>
              <div className="order-details-link">
                <Link to={`/orders/${order.id}`}>Order details &gt;</Link>
              </div>
            </div>

            {/* Order Confirmation Info */}
            <div className="order-confirmation">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
            </div>

            {/* Items in the order */}
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">Rs. {item.price.toFixed(2)}</p>
                    {item.category && <p>Category: {item.category}</p>}
                    {item.description && <p>Description: {item.description}</p>}
                    {item.productId && (
                      <Link to={`/product/${item.productId}`}>View Product</Link>
                    )}
                  </div>
                  <div className="item-total">
                    <p className="total-label">Total</p>
                    <p className="total-price">Rs {order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;