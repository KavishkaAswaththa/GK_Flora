import React, { useState } from "react";
import axios from "axios";
import "../styles/InventoryForm.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

// Import footer images
import faqImage from "../images/faq.png";
import chatImage from "../images/chat.png";
import contactImage from "../images/contact.png";

const InventoryForm = ({ onSuccess }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: id || "", // Set id from URL params if available
    name: "",
    category: "",
    description: "",
    price: "",
    qty: "",
    bloomContains: "",
    files: [],
  });
  
  useEffect(() => {
    if (id) {
      fetchItemData(id);
    }
  }, [id]);

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
        bloomContains: item.bloomContains,
        files: [],
      });
      setIsUpdate(true);
      setImagePreviews([]);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      alert("No inventory found with the given ID!");
    }
  };

  

  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

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

    // Generate image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    formData.files.forEach((file) => data.append("files", file)); // Append files separately
  
    // Append other fields
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("qty", formData.qty);
    data.append("bloomContains", formData.bloomContains);
  
    if (isUpdate) {
      data.append("id", formData.id); // Required for updates
    }
  
    const url = isUpdate
      ? `http://localhost:8080/api/inventory/update`
      : "http://localhost:8080/api/inventory/save";
  
    try {
      const response = await axios({
        method: isUpdate ? "put" : "post", // Use PUT for updates
        url,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert(response.data || `Inventory ${isUpdate ? "updated" : "saved"} successfully!`);
      setIsUpdate(false);
      onSuccess();
      setImagePreviews([]); // Clear image previews
    } catch (error) {
      console.error(`Failed to ${isUpdate ? "update" : "save"} inventory:`, error);
  
      let errorMessage = `Failed to ${isUpdate ? "update" : "save"} inventory!`;
  
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          errorMessage = data || "Invalid input! Please check your data.";
        } else if (status === 404) {
          errorMessage = "Inventory not found!";
        } else if (status === 500) {
          errorMessage = "Server error! Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "No response from server! Please check your connection.";
      } else {
        errorMessage = error.message || "An unexpected error occurred!";
      }
  
      alert(errorMessage);
    }
  };
  
  

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/inventory/search/${searchId}`
      );
      const item = response.data;
      setFormData({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        qty: item.qty,
        bloomContains: item.bloomContains,
        files: [],
      });
      setIsUpdate(true);
      setImagePreviews([]);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      alert("No inventory found with the given ID!");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/inventory/${formData.id}`);
      alert("Inventory deleted successfully!");
      setFormData({
        id: "",
        name: "",
        category: "",
        description: "",
        price: "",
        qty: "",
        bloomContains: "",
        files: [],
      });
      onSuccess();
      setImagePreviews([]);
    } catch (error) {
      console.error("Failed to delete inventory:", error);
      alert("Failed to delete inventory!");
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
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
            <label>Title:</label>
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
            <label>QTY:</label>
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Bloom Contains:</label>
            <input
              type="text"
              name="bloomContains"
              value={formData.bloomContains}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            <small>Maximum 6 images allowed</small>
          </div>
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index + 1}`} />
            ))}
          </div>
          <button type="submit">{isUpdate ? "Update Inventory" : "Save Inventory"}</button>
          {isUpdate && (
            <button type="button" onClick={handleDelete}>
              Delete Inventory
            </button>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-icons">
          <a href="/faq" className="footer-icon">
            <img src={faqImage} alt="FAQ" className="footer-icon-image" />
            <span>FAQ</span>
          </a>
          <a href="/chat" className="footer-icon">
            <img src={chatImage} alt="Chat" className="footer-icon-image" />
            <span>Chat</span>
          </a>
          <a href="/contact" className="footer-icon">
            <img src={contactImage} alt="Contact" className="footer-icon-image" />
            <span>Contact</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default InventoryForm;
