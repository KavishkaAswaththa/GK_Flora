import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../styles/FAQ/AdminPanel.css';

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ title: "", items: [] });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddOrUpdateCategory = async () => {
    try {
      const categoryData = {
        title: newCategory.title,
        items: newCategory.items,
      };

      if (editingCategory) {
        await axios.put(
          `http://localhost:8080/api/categories/${editingCategory.id}`,
          categoryData,
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/categories",
          categoryData,
          { headers: { "Content-Type": "application/json" } }
        );
      }

      setNewCategory({ title: "", items: [] });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:8080/api/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleEditCategory = (category) => {
    setNewCategory({
      title: category.title,
      items: category.items,
    });
    setEditingCategory(category);
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <div>
        <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
        <input
          type="text"
          placeholder="Category Title"
          value={newCategory.title}
          onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
        />
        <textarea
          placeholder="Items (comma-separated)"
          value={newCategory.items.join(", ")}
          onChange={(e) => setNewCategory({ ...newCategory, items: e.target.value.split(",") })}
        />
        <button onClick={handleAddOrUpdateCategory}>
          {editingCategory ? "Update Category" : "Add Category"}
        </button>
        {editingCategory && (
          <button
            className="cancel"
            onClick={() => {
              setNewCategory({ title: "", items: [] });
              setEditingCategory(null);
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <h2>Existing Categories</h2>
      {categories.map((category) => (
        <div className="category-item" key={category.id}>
          <h3>{category.title}</h3>
          <ul>
            {category.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <button className="edit" onClick={() => handleEditCategory(category)}>Edit</button>
          <button className="delete" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
