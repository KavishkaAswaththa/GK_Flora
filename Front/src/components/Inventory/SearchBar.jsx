// src/components/AdminDashboard/SearchBar.jsx
import React from 'react';
import styles from '../../styles/Inventory/AdminDashboard.module.css';

function SearchBar({ searchTerm, setSearchTerm, setCurrentPage }) {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <input
      type="text"
      placeholder="Search by name or category..."
      value={searchTerm}
      onChange={handleSearchChange}
      className={styles["admin-dashboard__search"]}
    />
  );
}

export default SearchBar;
