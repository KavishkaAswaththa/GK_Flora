import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/Inventory/InventoryDetails.css";
import faqImage from "../../images/faq.png";
import chatImage from "../../images/chat.png";
import contactImage from "../../images/contact.png";

const InventoryDetailsImage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8080/api/inventory/${id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setMetadata({
          id: data.id,
          name: data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          bloomContains: data.bloomContains,
        });

        setImages(
          data.images.map((image) => ({
            id: image.id,
            src: `data:image/jpeg;base64,${image.base64}`,
          }))
        );

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        name: metadata.name,
        price: metadata.price,
        quantity,
        imageUrl: images[selectedImageIndex]?.src || "", // send base64 as imageUrl
      };

      await axios.post("http://localhost:8080/api/cart/add", cartItem);

      // Navigate to cart page after adding item
      navigate("/cart1");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );

  return (
    <>
      <div className="inventory-details-container">
        {/* Image Display */}
        <div className="inventory-image-display">
          {images.length > 0 ? (
            <img
              src={images[selectedImageIndex].src}
              alt={metadata.name || "Inventory Item"}
              className="inventory-main-image"
            />
          ) : (
            <p>No images available</p>
          )}

          <div className="inventory-thumbnail-container">
            {images.map((image, index) => (
              <img
                key={image.id}
                src={image.src}
                alt={metadata.name || "Inventory Item"}
                className="inventory-thumbnail"
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>
            
        {/* Metadata Display */}
        <div className="inventory-details-content">
          <h1>{metadata.name}</h1>
          <p>
            <strong>Category:</strong> {metadata.category}
          </p>
          <p>
            <strong>Description:</strong> {metadata.description}
          </p>
          <p className="inventory-price">LKR {metadata.price}</p>
          <p>
            <strong>Bloom Contains:</strong> {metadata.bloomContains}
          </p>

          {/* Quantity and Buttons */}
          <div className="inventory-quantity-container">
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
            />
          </div>

          <div className="inventory-button-container">
            <button onClick={handleAddToCart}>ADD TO CART</button>
            <button
              className="inventory-secondary-button"
              onClick={() => navigate("/login")}
            >
              BUY IT NOW
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      
      
    </>
  );
};

export default InventoryDetailsImage;
