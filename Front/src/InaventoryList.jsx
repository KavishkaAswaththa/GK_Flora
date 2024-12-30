import React, { useEffect, useState } from "react";
import './InventoryList.css'

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
    <div>
      <h1>Inventory List</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              width: "300px",
            }}
          >
            <img
              src={`data:image/jpeg;base64,${item.image}`}
              alt={item.name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <h2>{item.name}</h2>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Quantity:</strong> {item.qty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryList;
