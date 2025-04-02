import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MyOrdersPage.css';

const MyOrdersPage = () => {
  // Sample order data
  const orders = [
    {
      id: '12345',
      status: 'unpaid',
      items: [
        {
          id: 1,
          name: 'New Rose flower bunch with excellent rapping',
          price: 2500.00,
          quantity: 1,
          image: 'src/images/rose.jpg'
        }
      ],
      total: 2850.00, // Including delivery fee
      delivery_fee: 350.00
    }
  ];

  return (
    <div className="my-orders-container">
      <div className="header">
        <div className="logo">
         
          
        </div>
        <div className="user-profile">
          
        </div>
      </div>

      <div className="orders-content">
        <div className="orders-header">
          <h1>My Orders</h1>
        </div>

        <div className="order-status-tabs">
          <div className="status-tab">
            <div className="status-icon unpaid">
              <img src="src/images/unpaid.png" alt="Unpaid" />
             
            </div>
            <p>Unpaid</p>
          </div>
          <div className="status-tab">
            <div className="status-icon to-be-shipped">
              <img src="src/images/to-be-shipped.png" alt="To be Shipped" />
              <span className="badge">1</span>
            </div>
            <p>To be Shipped</p>
          </div>
          <div className="status-tab">
            <div className="status-icon shipped">
              <img src="src/images/shipped-.png" alt="Shipped" />
            </div>
            <p>Shipped</p>
          </div>
          <div className="status-tab">
            <div className="status-icon to-be-reviewed">
              <img src="src/images/to-be-.png" alt="To be reviewed" />
            </div>
            <p>To be reviewed</p>
          </div>
        </div>

        {orders.map((order) => (
          <div key={order.id} className="order-container">
            <div className="order-header">
              <div className="order-status">
                <p>To ship</p>
              </div>
              <div className="order-details-link">
                <Link to={`/orders/${order.id}`}>Order details &gt;</Link>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>x {item.quantity}</p>
                    <p className="item-price">Rs. {item.price.toFixed(2)}</p>
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