import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Delivery/MyOrdersPage.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    TO_BE_SHIPPED: 0,
    SHIPPED: 0,
    COMPLETE: 0
  });
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.deliveryPerson) {
      setDeliveryPerson(location.state.deliveryPerson);
    }
  }, [location.state]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/orders/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      calculateStatusCounts(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const calculateStatusCounts = (ordersData) => {
    const counts = {
      TO_BE_SHIPPED: 0,
      SHIPPED: 0,
      COMPLETE: 0
    };
    
    ordersData.forEach(order => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      }
    });
    
    setStatusCounts(counts);
  };

  const handleViewDeliveryPerson = () => {
    navigate('/delivery', { state: { deliveryPerson } });
  };

  useEffect(() => {
    fetchOrders();
    
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
    
    const handleStatusUpdate = (event) => {
      if (event.detail?.statusCounts) {
        setStatusCounts(prevCounts => ({
          ...prevCounts,
          ...event.detail.statusCounts
        }));
        fetchOrders();
      }
    };
    
    window.addEventListener('orderStatusUpdated', handleStatusUpdate);
    
    return () => {
      window.removeEventListener('orderStatusUpdated', handleStatusUpdate);
    };
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      TO_BE_SHIPPED: '⏳',
      SHIPPED: '🚚',
      COMPLETE: '✅'
    };
    return statusIcons[status] || '';
  };

  return (
    <div className="my-orders-container">
      <div className="orders-content">
        <div className="orders-header">
          <h1>My Orders</h1>
        </div>

        {deliveryPerson && (
          <div className="delivery-person-info">
            <h3>Assigned Delivery Person</h3>
            <div className="delivery-person-details">
              <p><strong>Name:</strong> {deliveryPerson.delivername}</p>
              <p><strong>Phone:</strong> {deliveryPerson.deliverphone}</p>
              <button 
                className="view-delivery-person-btn"
                onClick={handleViewDeliveryPerson}
              >
                View Delivery Person Details
              </button>
            </div>
          </div>
        )}

        <div className="order-status-tabs">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div className="status-tab" key={status}>
              <div className={`status-icon ${status.toLowerCase()}`}>
                <span className="status-emoji">{getStatusIcon(status)}</span>
                <span className="badge">{count}</span>
              </div>
              <p>{status.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You have no orders yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-container">
              <div className="order-header">
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="order-details-link">
                  <Link to={`/orders/${order.id}`}>Order details &gt;</Link>
                </div>
              </div>

              <div className="order-summary">
                <div className="order-meta">
                  <p><strong>Order #:</strong> {order.id}</p>
                  <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                  <p><strong>Total:</strong> Rs. {order.total?.toFixed(2) || '0.00'}</p>
                </div>

                <div className="order-items-preview">
                  {order.items?.slice(0, 3).map((item) => (
                    <div key={item.id} className="preview-item">
                      <img src={item.image} alt={item.name} />
                      <span>{item.quantity} × {item.name}</span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="more-items">+{order.items.length - 3} more items</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button 
                                    className="assign-delivery-button"
                                    onClick={() => navigate('/delivery')}
                                >
                                    View delivery person details
                                </button>
    </div>
  );
};

export default MyOrdersPage;