// Import necessary dependencies and components
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styles from '../../styles/Inventory/AdminDashboard.module.css';

import BloomTagModal from '../../components/Inventory/BloomTagModal';
import InventoryTable from '../../components/Inventory/InventoryTable';
import PaginationControls from '../../components/Inventory/PaginationControls';

function AdminDashboard() {
  const navigate = useNavigate();

  // State declarations
  const [items, setItems] = useState([]); // All inventory items
  const [searchTerm, setSearchTerm] = useState(""); // Search query
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' }); // Sorting configuration
  const [currentPage, setCurrentPage] = useState(1); // Current page in pagination
  const [selectedItems, setSelectedItems] = useState([]); // Items selected for deletion
  const itemsPerPage = 5; // Number of items shown per page

  // Bloom tag related states
  const [bloomTags, setBloomTags] = useState([]); // Existing bloom tags
  const [newBloomTag, setNewBloomTag] = useState(""); // New bloom tag input
  const [isBloomTagModalOpen, setIsBloomTagModalOpen] = useState(false); // Bloom tag modal visibility

  // Fetch items and bloom tags when component mounts
  useEffect(() => {
    fetchItems();
    fetchBloomTags();
  }, []);

  // Fetch all inventory items
  const fetchItems = () => {
    axios.get('http://localhost:8080/api/inventory/search/all')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  // Fetch all bloom tags
  const fetchBloomTags = () => {
    axios.get("http://localhost:8080/api/bloom-tags")
      .then(res => setBloomTags(res.data))
      .catch(err => console.error("Failed to load bloom tags", err));
  };

  // Handle sorting logic based on column key
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Update quantity of an item
  const updateQty = (id, newQty) => {
    axios.put(`http://localhost:8080/api/inventory/updateQty/${id}`, { qty: newQty })
      .then(() => fetchItems())
      .catch(error => {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity!');
      });
  };

  // Delete a single item
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

  // Delete all selected items
  

  // Toggle selection for individual item
  const toggleItemSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // Toggle select all items on the current page
  const toggleSelectAll = () => {
    const allIds = paginatedItems.map(item => item.id);
    const allSelected = allIds.every(id => selectedItems.includes(id));
    setSelectedItems(allSelected ? [] : [...new Set([...selectedItems, ...allIds])]);
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

  // Get sorted items based on current sort configuration
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

  // Filter items based on search term
  const filteredItems = getSortedItems().filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIdx, startIdx + itemsPerPage);

  // Change page handler
  const changePage = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Add a new bloom tag
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

  // Delete a bloom tag
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
  <div className={styles.dashboardWrapper}>
    {/* Sidebar */}
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Admin Panel</h2>
      <nav className={styles.navList}>
        <button onClick={() => navigate('/city')}>🏙 City Edit</button>
        <button onClick={() => navigate('/adminpayment')}>💳 Payment Status</button>
        <button onClick={() => navigate('/admin')}>👤 Assign Delivery</button>
        <button onClick={() => navigate('/faqadmin')}>❓ FAQ</button>
        <button onClick={() => navigate('/adminbanner')}>🖼 Add Banner</button>
        <button onClick={() => navigate('/form')}>➕ Add New Item</button>
      
        <button onClick={() => navigate("/AdminFlowerCustomization")}>🌸 Customization</button>
        <button onClick={() => setIsBloomTagModalOpen(true)}>🏷 Manage Bloom Tags</button>
      </nav>
    </aside>

    {/* Main Content */}
    <main className={styles.mainContent}>
      <InventoryTable
        paginatedItems={paginatedItems}
        selectedItems={selectedItems}
        toggleItemSelection={toggleItemSelection}
        toggleSelectAll={toggleSelectAll}
        handleSort={handleSort}
        updateQty={updateQty}
        handleDelete={handleDelete}
          handleDeleteSelected={handleDeleteSelected} // ✅ Include this

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
    </main>
  </div>
);

}

export default AdminDashboard;
