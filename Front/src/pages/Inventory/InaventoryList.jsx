import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Inventory/InventoryList.module.css"; // Scoped styles

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
      <h1 className={styles["inventory-list__title"]}>All Bouquets</h1>

      <div className={styles["inventory-list__grid"]}>
        {items.map((item) => (
          <Link
            to={`/inventory/${item.id}`}
            key={item.id}
            className={styles["inventory-list__card-link"]}
          >
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
    </div>
  );
};

export default InventoryList;
