import React, { useState } from "react";
import axios from "axios";
//import "./InventoryForm.css";

const InventoryForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    price: "",
    qty: "",
    file: null,
  });

  const [searchId, setSearchId] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  // Input Change Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  // Save or Update Inventory
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("id", formData.id);
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("qty", formData.qty);
    if (formData.file) data.append("file", formData.file);

    const url = isUpdate
      ? `http://localhost:8080/api/inventory/update/${formData.id}`
      : "http://localhost:8080/api/inventory/save";

    try {
      const response = await axios.post(url, data);
      alert(response.data);
      setIsUpdate(false);
      onSuccess();
    } catch (error) {
      console.error(`Failed to ${isUpdate ? "update" : "save"} inventory:`, error);
      alert(`Failed to ${isUpdate ? "update" : "save"} inventory!`);
    }
  };

  // Search Inventory
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/inventory/search/${searchId}`
      );
      const item = response.data;
      setFormData({
        id: formData.id,
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        qty: item.qty,
        file: null, // Image is not included in search
      });
      setIsUpdate(true); // Mark as update mode
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      alert("No inventory found with the given ID!");
    }
  };

  // Delete Inventory
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/inventory/delete/${formData.id}`);
      alert("Inventory deleted successfully!");
      setFormData({
        id: "",
        name: "",
        category: "",
        description: "",
        price: "",
        qty: "",
        file: null,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to delete inventory:", error);
      alert("Failed to delete inventory!");
    }
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">{isUpdate ? "Update Inventory" : "Save Inventory"}</button>
        {isUpdate && <button onClick={handleDelete}>Delete Inventory</button>}
      </form>
    </div>
  );
};

export default InventoryForm;
