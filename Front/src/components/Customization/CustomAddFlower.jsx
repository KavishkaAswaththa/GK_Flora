import { useState } from "react";
import { addFlower } from "../api";

export default function AddFlower({ fetchFlowers }) {  
  const [flowerName, setFlowerName] = useState("");
  const [flowerImage, setFlowerImage] = useState(null);
  const [message, setMessage] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flowerName || !flowerImage) {
      setMessage("Please fill in all fields!");
      return;
    }

    try {
      await addFlower(flowerName, flowerImage);
      setMessage("✅ Flower added successfully!"); // Show success message

      // Reset form fields
      setFlowerName("");
      setFlowerImage(null);

      // Refresh flowers list
      fetchFlowers();  

      // Clear the message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Error adding flower. Try again!");
      console.error("Error:", error);

      // Clear the error message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Flower</h2>
      {message && <p className="message">{message}</p>} {/* Ensure message displays */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Flower Name"
          value={flowerName}
          onChange={(e) => setFlowerName(e.target.value)}
          required
        />
        <input 
          type="file" 
          onChange={(e) => setFlowerImage(e.target.files[0])} 
          required 
        />
        <button type="submit">Add Flower</button>
      </form>
    </div>
  );
}
