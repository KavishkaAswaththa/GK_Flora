import React from 'react';
import styles from '../../styles/Inventory/AdminDashboard.module.css';

function BloomTagModal({
  isOpen,
  setIsOpen,
  bloomTags,
  newBloomTag,
  setNewBloomTag,
  handleAddBloomTag,
  handleDeleteBloomTag
}) {
  if (!isOpen) return null;

  return (
    <div className={styles["admin-dashboard__modal-overlay"]}>
      <div className={styles["admin-dashboard__modal-content"]}>
        <h3>Manage Bloom Tags</h3>
        <div className={styles["admin-dashboard__bloom-tag-controls"]}>
          <input
            type="text"
            placeholder="New Bloom Tag"
            value={newBloomTag}
            onChange={(e) => setNewBloomTag(e.target.value)}
            className={styles["admin-dashboard__input"]}
          />
          <button onClick={handleAddBloomTag} className={styles["admin-dashboard__add-btn"]}>
            + Add Tag
          </button>
        </div>
        <ul className={styles["admin-dashboard__bloom-tag-list"]}>
          {bloomTags.map((tag, idx) => (
            <li key={idx} className={styles["admin-dashboard__bloom-tag-item"]}>
              {tag}
              <button onClick={() => handleDeleteBloomTag(tag)} className={styles["admin-dashboard__delete-btn"]}>
                ✖️
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => setIsOpen(false)} className={styles["admin-dashboard__close-modal-btn"]}>
          Close
        </button>
      </div>
    </div>
  );
}

export default BloomTagModal;
