import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../styles/Profile/AddBanner.css'; // ✅ Correct CSS import

function AddBanner() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !image) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:8080/api/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Banner added successfully!');
      setTitle('');
      setDescription('');
      setImage(null);
      document.getElementById('image-input').value = '';
      navigate('/admin/dashboard'); // Optional redirect
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert('Failed to upload banner.');
    }
  };

  return (
    <div className="add-banner-container">
      <h2>Add New Banner</h2>
      <form onSubmit={handleSubmit} className="add-banner-form">
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Image:</label>
          <input
            type="file"
            id="image-input"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '8px' }}
          />
        )}

        <button type="submit">Upload Banner</button>
      </form>
    </div>
  );
}

export default AddBanner;
