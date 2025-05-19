import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from '../../styles/Inventory/AdminDashboard.module.css';

import TopbarControls from '../../components/Inventory/TopActions';
import BloomTagModal from '../../components/Inventory/BloomTagModal';
import InventoryTable from '../../components/Inventory/InventoryTable';
import PaginationControls from '../../components/Inventory/PaginationControls';

function AdminDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 5;

  const [bloomTags, setBloomTags] = useState([]);
  const [newBloomTag, setNewBloomTag] = useState("");
  const [isBloomTagModalOpen, setIsBloomTagModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchBloomTags();
  }, []);

  const fetchItems = () => {
    axios.get('http://localhost:8080/api/inventory/search/all')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const fetchBloomTags = () => {
    axios.get("http://localhost:8080/api/bloom-tags")
      .then(res => setBloomTags(res.data))
      .catch(err => console.error("Failed to load bloom tags", err));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const updateQty = (id, newQty) => {
    axios.put(`http://localhost:8080/api/inventory/updateQty/${id}`, { qty: newQty })
      .then(() => fetchItems())
      .catch(error => {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity!');
      });
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

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      alert("No items selected!");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`);
    if (!confirmDelete) return;

    axios.all(selectedItems.map(id =>
      axios.delete(`http://localhost:8080/api/inventory/${id}`)
    ))
      .then(() => {
        alert("Selected items deleted!");
        setSelectedItems([]);
        fetchItems();
      })
      .catch(error => {
        console.error('Error deleting selected items:', error);
        alert("Failed to delete some items.");
      });
  };

  const toggleItemSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allIds = paginatedItems.map(item => item.id);
    const allSelected = allIds.every(id => selectedItems.includes(id));
    setSelectedItems(allSelected ? [] : [...new Set([...selectedItems, ...allIds])]);
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

  const handleAddBloomTag = () => {
    if (newBloomTag.trim()) {
      axios.post("http://localhost:8080/api/bloom-tags", newBloomTag.trim())
        .then(() => {
          fetchBloomTags();
          setNewBloomTag("");
        })
        .catch(err => {
          console.error("Error adding bloom tag:", err);
          alert("Failed to add bloom tag!");
        });
    }
  };

  const handleDeleteBloomTag = (tag) => {
    axios.delete(`http://localhost:8080/api/bloom-tags/${tag}`)
      .then(() => {
        fetchBloomTags();
      })
      .catch(err => {
        console.error("Error deleting bloom tag:", err);
        alert("Failed to delete bloom tag!");
      });
  };

  return (
    <div className={styles["admin-dashboard"]}>
      <h2 className={styles["admin-dashboard__title"]}>Admin Dashboard</h2>

      <div className={styles["admin-dashboard__nav-buttons"]}>
        <button
          className={styles["admin-dashboard__nav-button"]}
          onClick={() => navigate('/city')}
        >
          City Edit
        </button>
        <button
          className={styles["admin-dashboard__nav-button"]}
          onClick={() => navigate('/adminpayment')}
        >
        Payment Status
        </button>
        <button
          className={styles["admin-dashboard__nav-button"]}
          onClick={() => navigate('/admin')}
        >
          Delivery person asign
        </button>
         <button
          className={styles["admin-dashboard__nav-button"]}
          onClick={() => navigate('/faqadmin')}
        >
          FAQ
        </button>
      </div>

      <TopbarControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
        navigate={navigate}
        handleDeleteSelected={handleDeleteSelected}
        selectedItems={selectedItems}
        setIsBloomTagModalOpen={setIsBloomTagModalOpen}
        styles={styles}
      />

      <InventoryTable
        paginatedItems={paginatedItems}
        selectedItems={selectedItems}
        toggleItemSelection={toggleItemSelection}
        toggleSelectAll={toggleSelectAll}
        handleSort={handleSort}
        updateQty={updateQty}
        handleDelete={handleDelete}
        navigate={navigate}
        sortConfig={sortConfig}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={changePage}
      />

      {isBloomTagModalOpen && (
        <BloomTagModal
          bloomTags={bloomTags}
          setBloomTags={setBloomTags}
          newBloomTag={newBloomTag}
          setNewBloomTag={setNewBloomTag}
          handleAddBloomTag={handleAddBloomTag}
          handleDeleteBloomTag={handleDeleteBloomTag}
          isOpen={isBloomTagModalOpen}
          setIsOpen={setIsBloomTagModalOpen}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
