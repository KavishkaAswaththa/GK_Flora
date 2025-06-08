// src/components/AdminDashboard/InventoryTable.jsx
import React from 'react';
import styles from '../../styles/Inventory/InventoryTable.module.css';

function InventoryTable({
  paginatedItems = [],
  selectedItems = [],
  toggleItemSelection,
  toggleSelectAll,
  handleSort,
  updateQty,
  handleDelete,
  handleDeleteSelected,
  navigate,
  sortConfig = {}
}) {
  const isAllSelected = paginatedItems.length > 0 && paginatedItems.every(item => selectedItems.includes(item.id));

  return (
    <div>
      <table className={styles["admin-dashboard__table"]}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={isAllSelected}
              />
            </th>
            <th>Image</th>
            <th>ID</th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
              Category {sortConfig.key === 'category' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
              Price {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('qty')} style={{ cursor: 'pointer' }}>
              QTY {sortConfig.key === 'qty' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Bloom Contains</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item, index) => {
              const isLowStock = item.qty <= 2;

              return (
                <tr
                  key={item.id}
                  className={`${index % 2 === 0 ? styles["admin-dashboard__row--even"] : styles["admin-dashboard__row--odd"]} ${isLowStock ? styles["admin-dashboard__row--low-stock"] : ""}`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                    />
                  </td>
                  <td>
                    {item.image ? (
                      <img
                        src={`data:image/jpeg;base64,${item.image}`}
                        alt="Item"
                        className={styles["admin-dashboard__image"]}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>LKR {item.price}</td>
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
                  <td>{Array.isArray(item.bloomContains) ? item.bloomContains.join(', ') : item.bloomContains}</td>
                  <td className={styles["admin-dashboard__actions"]}>
                    <button
                      className={styles["admin-dashboard__edit-btn"]}
                      onClick={() => navigate(`/inventory/edit/${item.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles["admin-dashboard__delete-btn"]}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center', padding: '1rem' }}>
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🗑 Bulk delete button */}
      {paginatedItems.length > 0 && (
        <div className={styles["admin-dashboard__bulk-actions"]}>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
            className={styles["admin-dashboard__delete-multi-btn"]}
          >
            🗑 Delete Selected
          </button>
        </div>
      )}
    </div>
  );
}

export default InventoryTable;
