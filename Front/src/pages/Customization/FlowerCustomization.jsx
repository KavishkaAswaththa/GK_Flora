import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Customization/Custom.css";

export default function FlowerCustomization() {
  const [flowers, setFlowers] = useState([]);
  const [wrappingPapers, setWrappingPapers] = useState([]); // Always an array
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [showFlowerForm, setShowFlowerForm] = useState(false);
  const [showWrappingForm, setShowWrappingForm] = useState(false);
  const [flowerName, setFlowerName] = useState("");
  const [flowerImage, setFlowerImage] = useState(null);
  const [wrappingImage, setWrappingImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFlowers();
    fetchWrappingPapers();
  }, []);

  const fetchFlowers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/flowers/all");
      setFlowers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching flowers:", error.response || error.message);
      setMessage("Error fetching flowers. Please try again.");
    }
  };

  const fetchWrappingPapers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/wrappingPapers");
      setWrappingPapers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching wrapping papers:", error.response || error.message);
      setMessage("Error fetching wrapping papers. Please try again.");
    }
  };

  const handleFlowerUpload = (e) => setFlowerImage(e.target.files[0]);
  const handleWrappingUpload = (e) => setWrappingImage(e.target.files[0]);

  const addFlower = async (e) => {
    e.preventDefault();
    if (!flowerName || !flowerImage) {
      setMessage("Please enter a flower name and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", flowerName);
    formData.append("image", flowerImage);

    try {
      await axios.post("http://localhost:8080/api/flowers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Flower added successfully!");
      setTimeout(() => {
        fetchFlowers();
        setFlowerName("");
        setFlowerImage(null);
        setShowFlowerForm(false);
        setMessage("");
      }, 500);
    } catch (error) {
      console.error("Error adding flower:", error.response || error.message);
      setMessage("Error adding flower. Try again!");
    }
  };

  const addWrappingPaper = async (e) => {
    e.preventDefault();
    if (!wrappingImage) {
      setMessage("Please select an image for the wrapping paper.");
      return;
    }

    const formData = new FormData();
    formData.append("image", wrappingImage);

    try {
      await axios.post("http://localhost:8080/api/wrappingPapers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Wrapping paper added successfully!");
      setTimeout(() => {
        fetchWrappingPapers();
        setWrappingImage(null);
        setShowWrappingForm(false);
        setMessage("");
      }, 500);
    } catch (error) {
      console.error("Error adding wrapping paper:", error.response || error.message);
      setMessage("Error adding wrapping paper. Try again!");
    }
  };

  const selectFlower = (flower) => {
    setSelectedFlowers((prev) => [...prev, flower].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="app-container">
      <h1>Flower Bouquet Customization</h1>

      {message && <p className="message">{message}</p>}

      <div className="button-container">
        <button onClick={() => setShowFlowerForm(!showFlowerForm)}>Add Flower</button>
        <button onClick={() => setShowWrappingForm(!showWrappingForm)}>Add Wrapping Paper</button>
      </div>

      {showFlowerForm && (
        <div className="form-container">
          <h2>Add Flower</h2>
          <form onSubmit={addFlower}>
            <input
              type="text"
              placeholder="Flower Name"
              value={flowerName}
              onChange={(e) => setFlowerName(e.target.value)}
              required
            />
            <input type="file" onChange={handleFlowerUpload} required />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {showWrappingForm && (
        <div className="form-container">
          <h2>Add Wrapping Paper</h2>
          <form onSubmit={addWrappingPaper}>
            <input type="file" onChange={handleWrappingUpload} required />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      <div className="collection-container">
        <h2>Flowers</h2>
        <div className="scroll-container">
          {Array.isArray(flowers) &&
            flowers.map((flower) => (
              <div
                key={flower.id}
                className="card-container"
                onClick={() => selectFlower(flower)}
              >
                <img
                  src={
                    flower.imageBase64
                      ? `data:image/jpeg;base64,${flower.imageBase64}`
                      : "/path/to/placeholder-image.jpg"
                  }
                  alt={flower.name}
                  className="card-image"
                />
                <div className="card-title">{flower.name}</div>
              </div>
            ))}
        </div>

        <h2>Selected Flowers (5×5 Grid)</h2>
        <div className="grid-container">
          {selectedFlowers.slice(0, 25).map((flower, index) => (
            <img
              key={index}
              src={
                flower.imageBase64
                  ? `data:image/jpeg;base64,${flower.imageBase64}`
                  : "/path/to/placeholder-image.jpg"
              }
              alt={flower.name}
              className="grid-image"
            />
          ))}
        </div>

        <h2>Wrapping Papers</h2>
        <div className="scroll-container">
          {Array.isArray(wrappingPapers) &&
            wrappingPapers.map((paper) => (
              <div key={paper.id} className="card-container">
                <img
                  src={
                    paper.imageBase64
                      ? `data:image/jpeg;base64,${paper.imageBase64}`
                      : "/path/to/placeholder-image.jpg"
                  }
                  alt="Wrapping Paper"
                  className="card-image"
                />
              </div>
            ))}
        </div>
      </div>

      <button className="order-button">Place Order</button>
    </div>
  );
}
