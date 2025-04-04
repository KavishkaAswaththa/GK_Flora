import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Inventory/InventoryList.module.css"; // Scoped styles
import banner from "../../images/banner.jpg";
import faqImage from "../../images/faq.png";
import chatImage from "../../images/chat.png";
import contactImage from "../../images/contact.png";

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/inventory/search/all")
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
    <div className={styles["inventory-list"]}>
      {/* Banner */}
      <div className={styles["inventory-list__banner"]}>
        <img src={banner} alt="Banner" className={styles["inventory-list__banner-image"]} />
      </div>

      <h1 className={styles["inventory-list__title"]}>Flower Bouquets</h1>

  

      {/* Inventory Items */}
      <div className={styles["inventory-list__grid"]}>
        {items.map((item) => (
          <Link to={`/inventory/${item.id}`} key={item.id} className={styles["inventory-list__card-link"]}>
            <div className={styles["inventory-list__card"]}>
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.name}
                className={styles["inventory-list__image"]}
              />
              <div className={styles["inventory-list__content"]}>
                <h2 className={styles["inventory-list__name"]}>{item.name}</h2>
                <p className={styles["inventory-list__price"]}>
                  <strong>Price:</strong> LKR {item.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className={styles["inventory-list__footer"]}>
        <div className={styles["inventory-list__footer-icons"]}>
          <Link to="/faq" className={styles["inventory-list__footer-link"]}>
            <img src={faqImage} alt="FAQ" className={styles["inventory-list__footer-img"]} />
            <span className={styles["inventory-list__footer-text"]}>FAQ</span>
          </Link>
          <Link to="/chat" className={styles["inventory-list__footer-link"]}>
            <img src={chatImage} alt="Chat" className={styles["inventory-list__footer-img"]} />
            <span className={styles["inventory-list__footer-text"]}>Chat</span>
          </Link>
          <Link to="/contact" className={styles["inventory-list__footer-link"]}>
            <img src={contactImage} alt="Contact" className={styles["inventory-list__footer-img"]} />
            <span className={styles["inventory-list__footer-text"]}>Contact</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
