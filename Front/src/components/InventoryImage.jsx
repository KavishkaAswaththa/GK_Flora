import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/InventoryDetails.css";

const InventoryDetailsImage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null); // State to store the image
  const [metadata, setMetadata] = useState({}); // State to store metadata
  const [loading, setLoading] = useState(true); // State to handle loading spinner
  const [error, setError] = useState(""); // State to handle errors

  useEffect(() => {
    // Fetch inventory details and image by ID
    fetch(`http://localhost:8080/api/inventory/search/${id}`) // Adjust the URL to match your backend
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const contentType = response.headers.get("content-type");
        if (contentType.startsWith("image/")) {
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          setImageSrc(imageUrl);

          // Extract metadata from headers
          const metadata = {
            id: response.headers.get("x-id"),
            name: response.headers.get("x-name"),
            category: response.headers.get("x-category"),
            description: response.headers.get("x-description"),
            price: response.headers.get("x-price"),
            qty: response.headers.get("x-qty"),
          };
          setMetadata(metadata);
        } else {
          throw new Error("Invalid content type");
        }
        setLoading(false); // Stop loading spinner
      })
      .catch((err) => {
        setError(err.message); // Set error message
        setLoading(false); // Stop loading spinner
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>; // Display loading spinner
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="details-container">
      {/* Image Display */}
      <div className="image-display">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={metadata.name || "Inventory Item"}
            className="inventory-image"
          />
        ) : (
          <p>No image available</p>
        )}
      </div>

      {/* Metadata Display */}
      <div className="details-content">
        <h1>{metadata.name}</h1>
        <p>
          <strong>Category:</strong> {metadata.category}
        </p>
        <p>
          <strong>Description:</strong> {metadata.description}
        </p>
        <p>
          <strong>Price:</strong> LKR {metadata.price}
        </p>
        <p>
          <strong>Quantity:</strong> {metadata.qty}
        </p>
        <button onClick={() => navigate("/")}>Back to Inventory List</button>
      </div>
    </div>
  );
};

export default InventoryDetailsImage;
