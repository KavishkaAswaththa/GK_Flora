import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from '../../styles/Inventory/AdminDashboard.module.css';

function TopActions({ handleDeleteSelected, selectedItems, setIsBloomTagModalOpen }) {
  const navigate = useNavigate();

  return (
    <div className={styles["admin-dashboard__actions"]}>
      <button
        className={styles["admin-dashboard__add-btn"]}
        onClick={() => navigate('/form')}
      >
        + Add New Item
      </button>
      <button
        className={styles["admin-dashboard__delete-multi-btn"]}
        onClick={handleDeleteSelected}
        disabled={selectedItems.length === 0}
      >
        🗑️ Delete Selected
      </button>
      <button
        onClick={() => navigate("/AdminFlowerCustomization")}
        className={styles["admin-dashboard__customization-btn"]}
      >
        Customization
      </button>


      <button onClick={() => setIsBloomTagModalOpen(true)} className={styles["admin-dashboard__add-btn"]}>
        Manage Bloom Tags
      </button>
    </div>
  );
}

export default TopActions;
