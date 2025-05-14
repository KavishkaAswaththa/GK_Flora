// src/components/AdminDashboard/PaginationControls.jsx
import React from 'react';
import styles from '../../styles/Inventory/AdminDashboard.module.css';

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className={styles["admin-dashboard__pagination"]}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange('prev')}
      >
        ⟨ Prev
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange('next')}
      >
        Next ⟩
      </button>
    </div>
  );
}

export default PaginationControls;
