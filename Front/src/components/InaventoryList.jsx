import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/InventoryList.css";
import banner from "../images/banner.jpg";
// Import footer images
import faqImage from "../images/faq.png";
import chatImage from "../images/chat.png";
import contactImage from "../images/contact.png";

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/inventory/search/all") // Backend endpoint for all items
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading items...</p>;
  }

  return (
    <div className="inventory-container">
      {/* Banner Image */}
      <div className="banner">
        <img src={banner} alt="Banner" className="banner-image" />
      </div>

      {/* Inventory Cards */}
      <h1>Flower Bouquets</h1>

      {/* Corrected Delivery Details Link */}
      <Link to="/CustomerDeliveryForm" className="delivery-link">
        Delivery Details
      </Link>
      <br></br>
      <Link to="/Delivery" className="delivery-link">
        Delivery List
      </Link>
      <br></br>
      <Link to="/AdminDeliveryForm" className="delivery-link">
        Admin Form
      </Link>
      <br></br>
      <Link to="/DeliveryPerson" className="delivery-link">
        Delivery Person
      </Link>


      <div className="card-columns">
        {items.map((item) => (
          <Link to={`/inventory/${item.id}`} key={item.id} className="card-link">
            <div className="card">
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.name}
                className="card-image"
              />
              <div className="card-content">
                <h2 className="card-title">{item.name}</h2>
                <p>
                  <strong>Price:</strong> LKR {item.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
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
    </div>
  );
};

export default InventoryList;
