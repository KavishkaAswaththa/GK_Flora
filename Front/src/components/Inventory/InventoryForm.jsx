import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Inventory/InventoryForm.css";
import { useParams } from "react-router-dom";

import faqImage from "../../images/faq.png";
import chatImage from "../../images/chat.png";
import contactImage from "../../images/contact.png";

const InventoryForm = ({ onSuccess }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: id || "",
    name: "",
    category: "",
    description: "",
    price: "",
    qty: "",
    bloomContains: "",
    files: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [bloomTags, setBloomTags] = useState([]);

  useEffect(() => {
    if (id) {
      fetchItemData(id);
    }
    fetchBloomTags();
  }, [id]);

  const fetchBloomTags = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/bloom-tags");
      setBloomTags(response.data);
    } catch (error) {
      console.error("Failed to fetch bloom tags:", error);
    }
  };

  const fetchItemData = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/inventory/${itemId}`);
      const item = response.data;
      setFormData({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        qty: item.qty,
        bloomContains: item.bloomContains.join(","),
        files: [],
      });
      setIsUpdate(true);
      setImagePreviews([]);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      alert("No inventory found with the given ID!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      alert("You can upload a maximum of 6 images.");
      return;
    }
    setFormData({ ...formData, files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleTagClick = (tag) => {
    const current = formData.bloomContains.split(",").filter(Boolean);
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];

    setFormData({ ...formData, bloomContains: updated.join(",") });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: No token found.");
      return;
    }

    const data = new FormData();
    formData.files.forEach((file) => data.append("files", file));
    data.append("id", formData.id);
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("qty", formData.qty);
    data.append("bloomContains", JSON.stringify(formData.bloomContains.split(",").filter(Boolean)));

    if (isUpdate) {
      data.append("id", formData.id);
    }

    const url = isUpdate
      ? "http://localhost:8080/api/inventory/update"
      : "http://localhost:8080/api/inventory/save";

    try {
      const response = await axios({
        method: isUpdate ? "put" : "post",
        url,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data || `Inventory ${isUpdate ? "updated" : "saved"} successfully!`);
      setIsUpdate(false);
      onSuccess();
      setImagePreviews([]);
    } catch (error) {
      console.error(`Failed to ${isUpdate ? "update" : "save"} inventory:`, error);
      alert("An error occurred while saving the inventory.");
    }
  };

  return (
    <div className="inventory-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input type="text" name="id" value={formData.id} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Title:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleInputChange} required>
            <option value="">-- Select Category --</option>
            <option value="Occasion">Occasion</option>
            <option value="Birthday">Birthday</option>
            <option value="Graduation">Graduation</option>
            <option value="Romance">Romance</option>
          </select>
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
        </div>
        <div>
          <label>QTY:</label>
          <input type="number" name="qty" value={formData.qty} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Bloom Contains:</label>
          <div className="tag-selector">
            {bloomTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`tag-button ${formData.bloomContains.includes(tag) ? "selected" : ""}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <small>Click to select multiple tags</small>
        </div>
        <div>
          <label>Images:</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <small>Maximum 6 images allowed</small>
        </div>
        <div className="image-previews">
          {imagePreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`Preview ${index + 1}`} />
          ))}
        </div>
        <button type="submit">{isUpdate ? "Update Inventory" : "Save Inventory"}</button>
      </form>
    </div>
  );
};

export default InventoryForm;
