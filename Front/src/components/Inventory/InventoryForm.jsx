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
    province: "",
    files: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [bloomTags, setBloomTags] = useState([]);

  const provinceOptions = [
    { code: "we", label: "Western" },
    { code: "no", label: "Northern" },
    { code: "ne", label: "North Eastern" },
    { code: "es", label: "Eastern" },
    { code: "nc", label: "North Central" },
    { code: "nw", label: "North Western" },
    { code: "sb", label: "Sabaragamuwa" },
    { code: "so", label: "Southern" },
    { code: "uv", label: "Uva" },
  ];

  useEffect(() => {
    if (id) fetchItemData(id);
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

  const handleRemoveImage = (indexToRemove) => {
  const updatedFiles = formData.files.filter((_, index) => index !== indexToRemove);
  const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
  setFormData({ ...formData, files: updatedFiles });
  setImagePreviews(updatedPreviews);
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
      bloomContains: Array.isArray(item.bloomContains) ? item.bloomContains.join(",") : "",
      province: Array.isArray(item.province) ? item.province.join(",") : "",
      files: [],
    });

    setImagePreviews(
      Array.isArray(item.images)
        ? item.images.map((img) => `data:image/jpeg;base64,${img.base64}`)
        : []
    );

    setIsUpdate(true);
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
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleTagClick = (tag) => {
    const current = formData.bloomContains.split(",").filter(Boolean);
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setFormData({ ...formData, bloomContains: updated.join(",") });
  };

  const handleProvinceClick = (code) => {
    const current = formData.province.split(",").filter(Boolean);
    const updated = current.includes(code)
      ? current.filter((c) => c !== code)
      : [...current, code];
    setFormData({ ...formData, province: updated.join(",") });
  };

  const handleIslandWideClick = () => {
    const allCodes = provinceOptions.map((p) => p.code);
    const selected = formData.province.split(",").filter(Boolean);
    const allSelected = allCodes.every((code) => selected.includes(code));
    const updated = allSelected ? [] : allCodes;
    setFormData({ ...formData, province: updated.join(",") });
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
    data.append("province", JSON.stringify(formData.province.split(",").filter(Boolean)));
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("qty", formData.qty);
    data.append("bloomContains", JSON.stringify(formData.bloomContains.split(",").filter(Boolean)));

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
      setImagePreviews([]);
    } catch (error) {
      console.error(`Failed to ${isUpdate ? "update" : "save"} inventory:`, error);
      alert("An error occurred while saving the inventory.");
    }
  };

  return (
    <div className="inventory-form">
      <form onSubmit={handleSubmit}>

  <div className="form-left">

        {/* ID */}
        <div>
          <label>ID:</label>
          <input type="text" name="id" value={formData.id} onChange={handleInputChange} required />
        </div>

        {/* Name */}
        <div>
          <label>Title:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>

        {/* Category */}
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



        {/* Price */}
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
        </div>

        {/* Quantity */}
        <div>
          <label>QTY:</label>
          <input type="number" name="qty" value={formData.qty} onChange={handleInputChange} required />
        </div>

                    {/* Province Multi-select */}
        <div>
          <label>Available Provinces:</label>
          <div className="tag-selector">
            <button
              type="button"
              className="tag-button island-wide"
              onClick={handleIslandWideClick}
            >
              Island-wide
            </button>
            {provinceOptions.map((prov) => (
              <button
                type="button"
                key={prov.code}
                className={`tag-button ${formData.province.includes(prov.code) ? "selected" : ""}`}
                onClick={() => handleProvinceClick(prov.code)}
              >
                {prov.label}
              </button>
            ))}
          </div>
          <small>Click to select multiple provinces</small>
        </div>

        </div>
  <div className="form-right">



        {/* Description */}
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />
        </div>    

        {/* Bloom Tags */}
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

        {/* Images */}
        <div>
          <label>Images:</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <small>Maximum 6 images allowed</small>
        </div>

{/* Image Previews */}
<div className="image-previews">
  {imagePreviews.map((preview, index) => (
    <div key={index} className="preview-container">
      <img src={preview} alt={`Preview ${index + 1}`} />
      <button
        type="button"
        className="remove-image-button"
        onClick={() => handleRemoveImage(index)}
      >
        ✕
      </button>
    </div>
  ))}
</div>


        {/* Submit */}
        <button type="submit">{isUpdate ? "Update Inventory" : "Save Inventory"}</button>
          </div>

      </form>
    </div>
  );
};

export default InventoryForm;
