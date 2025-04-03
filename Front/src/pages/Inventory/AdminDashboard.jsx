import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from '../../styles/Inventory/AdminDashboard.module.css'; // Updated import

function AdminDashboard({ onEdit }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get('http://localhost:8080/api/inventory/search/all')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/inventory/${id}`)
      .then(() => {
        alert('Item deleted successfully!');
        fetchItems();
      })
      .catch(error => {
        console.error('Error deleting item:', error);
        alert('Failed to delete item!');
      });
  };

  return (
    <div className={styles["admin-dashboard"]}>
      <h2 className={styles["admin-dashboard__title"]}>Admin Dashboard</h2>
      <table className={styles["admin-dashboard__table"]}>
        <thead>
          <tr>
            <th>Image</th>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>QTY</th>
            <th>Bloom Contains</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? styles["admin-dashboard__row--even"] : styles["admin-dashboard__row--odd"]}>
              <td>
                {item.image ? (
                  <img src={`data:image/jpeg;base64,${item.image}`} alt="Item" className={styles["admin-dashboard__image"]} />
                ) : (
                  'No Image'
                )}
              </td>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>${item.price}</td>
              <td>{item.qty}</td>
              <td>{item.bloomContains}</td>
              <td className={styles["admin-dashboard__actions"]}>
                <button className={styles["admin-dashboard__edit-btn"]} onClick={() => navigate(`/inventory/edit/${item.id}`)}>Edit</button>
                <button className={styles["admin-dashboard__delete-btn"]} onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
