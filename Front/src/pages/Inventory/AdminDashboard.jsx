import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from '../../styles/Inventory/AdminDashboard.module.css';

function AdminDashboard({ onEdit }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get('http://localhost:8080/api/inventory/search/all')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

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

  const updateQty = (id, newQty) => {
    axios.put(`http://localhost:8080/api/inventory/updateQty/${id}`, { qty: newQty })
      .then(() => fetchItems())
      .catch(error => {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity!');
      });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = () => {
    const sorted = [...items].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      } else {
        return sortConfig.direction === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      }
    });

    return sorted;
  };

  const filteredItems = getSortedItems().filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIdx, startIdx + itemsPerPage);

  const changePage = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className={styles["admin-dashboard"]}>
      <h2 className={styles["admin-dashboard__title"]}>Admin Dashboard</h2>

      <div className={styles["admin-dashboard__topbar"]}>
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={styles["admin-dashboard__search"]}
        />
        <button
          className={styles["admin-dashboard__add-btn"]}
          onClick={() => navigate('/form')}
        >
          + Add New Item
        </button>
      </div>

      <table className={styles["admin-dashboard__table"]}>
        <thead>
          <tr>
            <th>Image</th>
            <th>ID</th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name</th>
            <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>Category</th>
            <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>Price</th>
            <th onClick={() => handleSort('qty')} style={{ cursor: 'pointer' }}>QTY</th>
            <th>Bloom Contains</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item, index) => {
            const isLowStock = item.qty <= 2;

            return (
              <tr
                key={index}
                className={`${index % 2 === 0 ? styles["admin-dashboard__row--even"] : styles["admin-dashboard__row--odd"]} ${isLowStock ? styles["admin-dashboard__row--low-stock"] : ""}`}
              >
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
                <td>
                  <div className={styles["admin-dashboard__qty-control"]}>
                    <button
                      className={styles["qty-btn"]}
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 0}
                    >
                      -
                    </button>
                    <span className={styles["qty-value"]}>{item.qty}</span>
                    <button
                      className={styles["qty-btn"]}
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{item.bloomContains}</td>
                <td className={styles["admin-dashboard__actions"]}>
                  <button className={styles["admin-dashboard__edit-btn"]} onClick={() => navigate(`/inventory/edit/${item.id}`)}>Edit</button>
                  <button className={styles["admin-dashboard__delete-btn"]} onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles["admin-dashboard__pagination"]}>
        <button
          disabled={currentPage === 1}
          onClick={() => changePage('prev')}
        >⟨ Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => changePage('next')}
        >Next ⟩</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
