import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Customization/AdminCustom.css";

export default function AdminFlowerCustomization() {
  const [flowers, setFlowers] = useState([]);
  const [wrappingPapers, setWrappingPapers] = useState([]);
  const [flowerName, setFlowerName] = useState("");
  const [flowerPrice, setFlowerPrice] = useState("");
  const [flowerImage, setFlowerImage] = useState(null);
  const [wrappingImage, setWrappingImage] = useState(null);
  const [wrappingPrice, setWrappingPrice] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFlowers();
    fetchWrappingPapers();
  }, []);

  const fetchFlowers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/flowers/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFlowers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching flowers.");
    }
  };

  const fetchWrappingPapers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/wrappingPapers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWrappingPapers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching wrapping papers.");
    }
  };

  const handleFlowerUpload = (e) => setFlowerImage(e.target.files[0]);
  const handleWrappingUpload = (e) => setWrappingImage(e.target.files[0]);

  const addFlower = async (e) => {
    e.preventDefault();
    if (!flowerName || !flowerImage || !flowerPrice) {
      setMessage("Please fill in all flower details.");
      return;
    }
    const formData = new FormData();
    formData.append("name", flowerName);
    formData.append("price", flowerPrice);
    formData.append("image", flowerImage);

    try {
      await axios.post("http://localhost:8080/api/flowers", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ Flower added!");
      fetchFlowers();
      setFlowerName("");
      setFlowerPrice("");
      setFlowerImage(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add flower.");
    }
  };

  const addWrappingPaper = async (e) => {
    e.preventDefault();
    if (!wrappingImage || !wrappingPrice) {
      setMessage("Please fill in all wrapping paper details.");
      return;
    }
    const formData = new FormData();
    formData.append("image", wrappingImage);
    formData.append("price", wrappingPrice);

    try {
      await axios.post("http://localhost:8080/api/wrappingPapers", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ Wrapping paper added!");
      fetchWrappingPapers();
      setWrappingImage(null);
      setWrappingPrice("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add wrapping paper.");
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Customization</h2>
      {message && <div className="message">{message}</div>}
      <div className="form-columns">
        <div className="form-card">
          <h3>Add a New Flower</h3>
          <form onSubmit={addFlower}>
            <input
              type="text"
              placeholder="Flower Name"
              value={flowerName}
              onChange={(e) => setFlowerName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={flowerPrice}
              onChange={(e) => setFlowerPrice(e.target.value)}
            />
            <input type="file" onChange={handleFlowerUpload} />
            <button type="submit">Add Flower</button>
          </form>
        </div>

        <div className="form-card">
          <h3>Add Wrapping Paper</h3>
          <form onSubmit={addWrappingPaper}>
            <input
              type="number"
              placeholder="Price"
              value={wrappingPrice}
              onChange={(e) => setWrappingPrice(e.target.value)}
            />
            <input type="file" onChange={handleWrappingUpload} />
            <button type="submit">Add Wrapping</button>
          </form>
        </div>
      </div>
    </div>
  );
}
