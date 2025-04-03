import { useState } from "react";
import { addFlower } from "../api";
import { useNavigate } from "react-router-dom";

export default function AddFlower() {
  const [flowerName, setFlowerName] = useState("");
  const [flowerImage, setFlowerImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flowerName || !flowerImage) return alert("Fill all fields!");

    await addFlower(flowerName, flowerImage);
    navigate("/"); // Redirect to main page
  };

  return (
    <div className="form-container">
      <h2>Add Flower</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Flower Name" onChange={(e) => setFlowerName(e.target.value)} />
        <input type="file" onChange={(e) => setFlowerImage(e.target.files[0])} />
        <button type="submit">Add Flower</button>
      </form>
    </div>
  );
}
