import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Import Link here
import "../styles/InventoryDetails.css";
// Import footer images
import faqImage from "../images/faq.png";
import chatImage from "../images/chat.png";
import contactImage from "../images/contact.png";

const InventoryDetailsImage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const [images, setImages] = useState([]); // State to store the images
  const [metadata, setMetadata] = useState({}); // State to store metadata
  const [loading, setLoading] = useState(true); // State to handle loading spinner
  const [error, setError] = useState(""); // State to handle errors
  const [quantity, setQuantity] = useState(1); // State to store the quantity
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // State for the selected image index

  useEffect(() => {
    // Fetch inventory details by ID
    fetch(`http://localhost:8080/api/inventory/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json(); // Parse JSON response

        // Set metadata
        setMetadata({
          id: data.id,
          name: data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          bloomContains: data.bloomContains,
        });

        // Set images (decoded from base64)
        setImages(
          data.images.map((image) => ({
            id: image.id,
            src: `data:image/jpeg;base64,${image.base64}`,
          }))
        );

        setLoading(false); // Stop loading spinner
      })
      .catch((err) => {
        setError(err.message); // Set error message
        setLoading(false); // Stop loading spinner
      });
  }, [id]);

  const handleQuantityChange = (e) => {
    // Update quantity, making sure it doesn't go below 1
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const handleThumbnailClick = (index) => {
    // Update the selected image index when a thumbnail is clicked
    setSelectedImageIndex(index);
  };

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
    <>
      <div className="details-container">
        {/* Image Display */}
        <div className="image-display">
          {/* Main Image */}
          {images.length > 0 ? (
            <img
              src={images[selectedImageIndex].src}
              alt={metadata.name || "Inventory Item"}
              className="main-image"
            />
          ) : (
            <p>No images available</p>
          )}

          {/* Thumbnail Images */}
          <div className="thumbnail-container">
            {images.map((image, index) => (
              <img
                key={image.id}
                src={image.src}
                alt={metadata.name || "Inventory Item"}
                className="thumbnail"
                onClick={() => handleThumbnailClick(index)} // Set main image on thumbnail click
              />
            ))}
          </div>
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
          <p className="price">LKR {metadata.price}</p>
          <p>
            <strong>Bloom Contains:</strong> {metadata.bloomContains}
          </p>

          {/* Quantity and Button */}
          <div className="quantity-container">
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
            />
          </div>

          <div className="button-container">
            <button>ADD TO CART</button>
            <button className="secondary-button">BUY IT NOW</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-icons">
          <Link to="/faq" className="footer-icon">
            <img src={faqImage} alt="FAQ" className="footer-icon-image" />
            <span>FAQ</span>
          </Link>
          <Link to="/chat" className="footer-icon">
            <img src={chatImage} alt="Chat" className="footer-icon-image" />
            <span>Chat</span>
          </Link>
          <Link to="/contact" className="footer-icon">
            <img src={contactImage} alt="Contact" className="footer-icon-image" />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default InventoryDetailsImage;
