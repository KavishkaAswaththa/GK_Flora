import React from 'react';
import styles from '../../styles/Inventory/AdminDashboard.module.css';

// Component to manage bloom tags in a modal
function BloomTagModal({
  isOpen,                 // Boolean to control whether the modal is open
  setIsOpen,              // Function to set the modal's open state
  bloomTags,              // Array of current bloom tags
  newBloomTag,            // Value of the new bloom tag input field
  setNewBloomTag,         // Function to update the new bloom tag input value
  handleAddBloomTag,      // Function to handle adding a new bloom tag
  handleDeleteBloomTag    // Function to handle deleting a bloom tag
}) {
  // If modal is not open, do not render anything
  if (!isOpen) return null;

  return (
    <div className={styles["admin-dashboard__modal-overlay"]}>
      {/* Modal container */}
      <div className={styles["admin-dashboard__modal-content"]}>
        <h3>Manage Bloom Tags</h3>

        {/* Input and button for adding a new bloom tag */}
        <div className={styles["admin-dashboard__bloom-tag-controls"]}>
          <input
            type="text"
            placeholder="New Bloom Tag"
            value={newBloomTag}
            onChange={(e) => setNewBloomTag(e.target.value)}
            className={styles["admin-dashboard__input"]}
          />
          <button
            onClick={handleAddBloomTag}
            className={styles["admin-dashboard__add-btn"]}
          >
            + Add Tag
          </button>
        </div>

        {/* List of existing bloom tags with delete buttons */}
        <ul className={styles["admin-dashboard__bloom-tag-list"]}>
          {bloomTags.map((tag, idx) => (
            <li key={idx} className={styles["admin-dashboard__bloom-tag-item"]}>
              {tag}
              <button
                onClick={() => handleDeleteBloomTag(tag)}
                className={styles["admin-dashboard__delete-btn"]}
              >
                ✖️
              </button>
            </li>
          ))}
        </ul>

        {/* Close button for the modal */}
        <button
          onClick={() => setIsOpen(false)}
          className={styles["admin-dashboard__close-modal-btn"]}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default BloomTagModal;
