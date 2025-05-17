// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Order/AdminDashboard.css';

const OrderAdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAccept = (id) => {
    axios.post(`http://localhost:8080/api/orders/${id}/accept`)
      .then(() => {
        setOrders(prev => prev.map(order =>
          order.id === id ? { ...order } : order
        ));
      })
      .catch(err => console.error(err));
  };

  const handleReject = (id) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Order Dashboard</h1>
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Item Qty</th>
              <th>Total</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(({ id, name, itemQty, total, location }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{itemQty}</td>
                <td>{total}</td>
                <td>{location}</td>
                <td>
                  <button className="accept" onClick={() => handleAccept(id)}>Accept</button>
                  <button className="reject" onClick={() => handleReject(id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderAdminDashboard;
