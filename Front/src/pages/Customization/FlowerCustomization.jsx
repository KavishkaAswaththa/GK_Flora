import { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../../styles/Customization/Custom.css";

export default function FlowerCustomization() {
  const [flowers, setFlowers] = useState([]);
  const [wrappingPapers, setWrappingPapers] = useState([]);
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [showFlowerForm, setShowFlowerForm] = useState(false);
  const [showWrappingForm, setShowWrappingForm] = useState(false);
  const [flowerName, setFlowerName] = useState("");
  const [flowerPrice, setFlowerPrice] = useState("");
  const [flowerImage, setFlowerImage] = useState(null);
  const [wrappingImage, setWrappingImage] = useState(null);
  const [wrappingPrice, setWrappingPrice] = useState("");
  const [message, setMessage] = useState("");
  const [gridType, setGridType] = useState("5x5");

  const gridOptions = {
    "3x3": 3,
    "4x4": 4,
    "5x5": 5,
    "6x6": 6,
    "7x7": 7,
  };

  useEffect(() => {
    fetchFlowers();
    fetchWrappingPapers();
  }, []);

  const fetchFlowers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/flowers/all");
      setFlowers(response.data);
    } catch (error) {
      console.error("Error fetching flowers:", error.response || error.message);
      setMessage("Error fetching flowers. Please try again.");
    }
  };

  const fetchWrappingPapers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/wrappingPapers");
      setWrappingPapers(response.data);
    } catch (error) {
      console.error("Error fetching wrapping papers:", error.response || error.message);
      setMessage("Error fetching wrapping papers. Please try again.");
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
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Flower added successfully!");
      setTimeout(() => {
        fetchFlowers();
        setFlowerName("");
        setFlowerPrice("");
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
    if (!wrappingImage || !wrappingPrice) {
      setMessage("Please provide both price and image for wrapping paper.");
      return;
    }

    const formData = new FormData();
    formData.append("image", wrappingImage);
    formData.append("price", wrappingPrice);

    try {
      await axios.post("http://localhost:8080/api/wrappingPapers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Wrapping paper added successfully!");
      setTimeout(() => {
        fetchWrappingPapers();
        setWrappingImage(null);
        setWrappingPrice("");
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

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(selectedFlowers);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setSelectedFlowers(reordered);
  };

  return (
    <div className="flower-customization">
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
            <input type="text" placeholder="Flower Name" value={flowerName} onChange={(e) => setFlowerName(e.target.value)} required />
            <input type="number" placeholder="Flower Price" value={flowerPrice} onChange={(e) => setFlowerPrice(e.target.value)} step="0.01" required />
            <input type="file" onChange={handleFlowerUpload} required />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {showWrappingForm && (
        <div className="form-container">
          <h2>Add Wrapping Paper</h2>
          <form onSubmit={addWrappingPaper}>
            <input type="number" placeholder="Wrapping Paper Price" value={wrappingPrice} onChange={(e) => setWrappingPrice(e.target.value)} step="0.01" required />
            <input type="file" onChange={handleWrappingUpload} required />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      <div className="collection-container">
        <h2>Flowers</h2>
        <div className="scroll-container">
          {flowers.map((flower) => (
            <div key={flower.id} className="card-container" onClick={() => selectFlower(flower)}>
              <img
                src={flower.imageBase64 ? `data:image/jpeg;base64,${flower.imageBase64}` : "/path/to/placeholder-image.jpg"}
                alt={flower.name}
                className="card-image"
              />
              <div className="card-title">{flower.name}</div>
              <div className="card-price">Rs.{flower.price}</div>
            </div>
          ))}
        </div>

        <h2>Selected Flowers</h2>
        <label htmlFor="gridType">Select Grid Layout: </label>
        <select id="gridType" value={gridType} onChange={(e) => setGridType(e.target.value)}>
          {Object.keys(gridOptions).map((option) => (
            <option key={option} value={option}>{option.replace("x", " × ")}</option>
          ))}
        </select>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="flower-grid" direction="horizontal">
            {(provided) => (
              <div
                className="grid-container"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "15px",
                  width: "100%",
                }}
              >
                {selectedFlowers.slice(0, gridOptions[gridType] ** 2).map((flower, index) => (
                  <Draggable key={`flower-${index}-${flower.id}`} draggableId={`flower-${index}-${flower.id}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          flex: `1 0 calc(${100 / gridOptions[gridType]}% - 10px)`,
                          maxWidth: `calc(${100 / gridOptions[gridType]}% - 10px)`,
                          boxSizing: "border-box",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={flower.imageBase64 ? `data:image/jpeg;base64,${flower.imageBase64}` : "/path/to/placeholder-image.jpg"}
                          alt={flower.name}
                          className="grid-image"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <h2>Wrapping Papers</h2>
        <div className="scroll-container">
          {wrappingPapers.map((paper) => (
            <div key={paper.id} className="card-container">
              <img
                src={paper.imageBase64 ? `data:image/jpeg;base64,${paper.imageBase64}` : "/path/to/placeholder-image.jpg"}
                alt="Wrapping Paper"
                className="card-image"
              />
              <div className="card-price">Rs.{paper.price}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="order-button">Place Order</button>
    </div>
  );
}
