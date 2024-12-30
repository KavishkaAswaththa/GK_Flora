import React, { useEffect, useState } from "react";

const InventoryImage = ({ id }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    // Fetch the image and metadata
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
          const headers = response.headers;
          const metadata = {
            id: headers.get("x-id"),
            name: headers.get("x-name"),
            category: headers.get("x-category"),
            description: headers.get("x-description"),
            price: headers.get("x-price"),
            qty: headers.get("x-qty"),
          };
          console.log(metadata);
          setMetadata(metadata);
        } else {
          throw new Error("Invalid content type");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt={metadata.name || "Inventory Item"} />
      ) : (
        <p>Loading image...</p>
      )}
      <div>
        <h3>Metadata:</h3>
        <p><strong>ID:</strong> {metadata.id}</p>
        <p><strong>Name:</strong> {metadata.name}</p>
        <p><strong>Category:</strong> {metadata.category}</p>
        <p><strong>Description:</strong> {metadata.description}</p>
        <p><strong>Price:</strong> ${metadata.price}</p>
        <p><strong>Quantity:</strong> {metadata.qty}</p>
      </div>
    </div>
  );
};

export default InventoryImage;
