import React, { useState } from "react";
import axios from "axios";

const InventoryDetails = () => {
  const [item, setItem] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState(null);

  // Fetch item details and image by ID
  const fetchItemById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/inventory/search/${id}`, {
        responseType: "arraybuffer", // To handle binary data
      });

      // Extract headers for item details
      const headers = response.headers;

      // Convert image data to Base64
      const base64Image = `data:image/jpeg;base64,${btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), "")
      )}`;

      // Set item and image state
      setItem({
        id: headers["id"],
        name: headers["name"],
        category: headers["category"],
        description: headers["description"],
        price: headers["price"],
        qty: headers["qty"],
      });
      setImageSrc(base64Image);
      setError(null);
    } catch (err) {
      console.error("Error fetching inventory item:", err);
      setError("Failed to fetch inventory item. Please check the ID.");
      setItem(null);
      setImageSrc(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Search Inventory Item</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Item ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={() => fetchItemById(searchId)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {item && (
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          {imageSrc && (
            <img
              src={imageSrc}
              alt={item.name}
              style={{ width: "300px", height: "300px", objectFit: "cover", borderRadius: "8px" }}
            />
          )}
          <div>
            <h2>{item.name}</h2>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Quantity:</strong> {item.qty}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDetails;
