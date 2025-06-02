import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Inventory/InventoryDetails.css";

const InventoryDetailsImage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8080/api/inventory/${id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setMetadata({
          id: data.id,
          name: data.name,
          qty: data.qty,
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

        setTotal(data.price * 1);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (metadata.price) {
      setTotal(metadata.price * quantity);
    }
  }, [quantity, metadata.price]);

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(newQuantity);
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
        imageUrl: images[selectedImageIndex]?.src || "",
      };

      await axios.post("http://localhost:8080/api/cart/add", cartItem);
      navigate("/cart1");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  const handleBuyNow = () => {
    const item = {
      id: metadata.id,
      name: metadata.name,
      price: metadata.price,
      quantity: quantity,
      imageUrl: images[selectedImageIndex]?.src || ""
    };

    const orderSummary = {
      subTotal: total,
      flatDiscount: 0,
      total: total,
      itemCount: 1
    };

    navigate('/deliveryform', {
      state: {
        cartItems: [item],
        orderSummary: orderSummary,
        source: 'inventory-secondary-button'
      }
    });
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error)
    return (
      <div>
        <p className="error-text">Error: {error}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );

  return (
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
        <p><strong>Category:</strong> {metadata.category}</p>
        <p><strong>Description:</strong> {metadata.description}</p>
        <p className="inventory-price">LKR {metadata.price}</p>
        <p className="inventory-total"><strong>Total:</strong> LKR {total.toFixed(2)}</p>
        <p><strong>Bloom Contains:</strong> {metadata.bloomContains}</p>

        {/* Quantity and Buttons */}
        <div className="inventory-quantity-container">
          <label htmlFor="quantity"><strong>Quantity:</strong></label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            min="1"
            onChange={handleQuantityChange}
          />
        </div>

        <div className="inventory-button-container">
          {metadata.qty > 0 ? (
            <>
              <button onClick={handleAddToCart}>ADD TO CART</button>
              <button className="inventory-secondary-button" onClick={handleBuyNow}>BUY IT NOW</button>
            </>
          ) : (
            <>
              <h3 className="wishlist-msg">
                This item is currently unavailable. <br />
                You can add it to your wishlist, and we'll notify you once it's back in stock.
              </h3>
              <button
                className="inventory-secondary-button"
                onClick={() => alert("Added to wishlist!")}
              >
                ADD TO WISHLIST
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailsImage;
