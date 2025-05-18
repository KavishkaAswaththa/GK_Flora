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
  const [editingFlowerId, setEditingFlowerId] = useState(null);
  const [editingWrappingId, setEditingWrappingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFlowers();
    fetchWrappingPapers();
  }, []);

  const fetchFlowers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/flowers/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setFlowers(res.data);
      } else {
        setFlowers([]);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching flowers.");
    }
  };

  const fetchWrappingPapers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/wrappingPapers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setWrappingPapers(res.data);
      } else {
        setWrappingPapers([]);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching wrapping papers.");
    }
  };

  const handleFlowerUpload = (e) => setFlowerImage(e.target.files[0]);
  const handleWrappingUpload = (e) => setWrappingImage(e.target.files[0]);

  const resetFlowerForm = () => {
    setFlowerName("");
    setFlowerPrice("");
    setFlowerImage(null);
    setEditingFlowerId(null);
  };

  const resetWrappingForm = () => {
    setWrappingPrice("");
    setWrappingImage(null);
    setEditingWrappingId(null);
  };

  const addOrUpdateFlower = async (e) => {
    e.preventDefault();

    if (!flowerName || !flowerPrice) {
      setMessage("Please fill in all flower details.");
      return;
    }

    const formData = new FormData();
    formData.append("name", flowerName);
    formData.append("price", flowerPrice);
    if (flowerImage) formData.append("image", flowerImage);

    try {
      if (editingFlowerId) {
        await axios.put(`http://localhost:8080/api/flowers/${editingFlowerId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("✅ Flower updated!");
      } else {
        await axios.post("http://localhost:8080/api/flowers", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("✅ Flower added!");
      }

      fetchFlowers();
      resetFlowerForm();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add/update flower.");
    }
  };

  const addOrUpdateWrappingPaper = async (e) => {
    e.preventDefault();

    if (!wrappingPrice) {
      setMessage("Please fill in all wrapping paper details.");
      return;
    }

    const formData = new FormData();
    formData.append("price", wrappingPrice);
    if (wrappingImage) formData.append("image", wrappingImage);

    try {
      if (editingWrappingId) {
        await axios.put(`http://localhost:8080/api/wrappingPapers/${editingWrappingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("✅ Wrapping paper updated!");
      } else {
        await axios.post("http://localhost:8080/api/wrappingPapers", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("✅ Wrapping paper added!");
      }

      fetchWrappingPapers();
      resetWrappingForm();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add/update wrapping paper.");
    }
  };

  const editFlower = (flower) => {
    setFlowerName(flower.name);
    setFlowerPrice(flower.price);
    setEditingFlowerId(flower.id);
  };

  const deleteFlower = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/flowers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Flower deleted!");
      fetchFlowers();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete flower.");
    }
  };

  const editWrappingPaper = (paper) => {
    setWrappingPrice(paper.price);
    setEditingWrappingId(paper.id);
  };

  const deleteWrappingPaper = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/wrappingPapers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Wrapping paper deleted!");
      fetchWrappingPapers();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete wrapping paper.");
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Customization</h2>
      {message && <div className="message">{message}</div>}

      <div className="form-columns">
        <div className="form-card">
          <h3>{editingFlowerId ? "Edit Flower" : "Add New Flower"}</h3>
          <form onSubmit={addOrUpdateFlower}>
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
            <button type="submit">{editingFlowerId ? "Update Flower" : "Add Flower"}</button>
          </form>
        </div>

        <div className="form-card">
          <h3>{editingWrappingId ? "Edit Wrapping Paper" : "Add Wrapping Paper"}</h3>
          <form onSubmit={addOrUpdateWrappingPaper}>
            <input
              type="number"
              placeholder="Price"
              value={wrappingPrice}
              onChange={(e) => setWrappingPrice(e.target.value)}
            />
            <input type="file" onChange={handleWrappingUpload} />
            <button type="submit">{editingWrappingId ? "Update Wrapping" : "Add Wrapping"}</button>
          </form>
        </div>
      </div>

      <div className="list-section">
        <h3>Flowers</h3>
        <div className="scroll-container">
          {flowers.map((flower) => (
            <div key={flower.id} className="card-container">
              <img
                src={flower.imageBase64 ? `data:image/jpeg;base64,${flower.imageBase64}` : "/path/to/placeholder.jpg"}
                alt={flower.name}
                className="card-image"
              />
              <div className="card-title">{flower.name}</div>
              <div className="card-price">Rs.{flower.price}</div>
              <button onClick={() => editFlower(flower)}>✏️ Edit</button>
              <button onClick={() => deleteFlower(flower.id)}>🗑️ Delete</button>
            </div>
          ))}
        </div>

        <h3>Wrapping Papers</h3>
        <div className="scroll-container">
          {Array.isArray(wrappingPapers) &&
            wrappingPapers.map((paper) => (
              <div key={paper.id} className="card-container">
                <img
                  src={paper.imageBase64 ? `data:image/jpeg;base64,${paper.imageBase64}` : "/path/to/placeholder.jpg"}
                  alt="Wrapping"
                  className="card-image"
                />
                <div className="card-price">Rs.{paper.price}</div>
                <button onClick={() => editWrappingPaper(paper)}>✏️ Edit</button>
                <button onClick={() => deleteWrappingPaper(paper.id)}>🗑️ Delete</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
