import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../../styles/Customization/Custom.css";

export default function UserFlowerCustomization() {
  const [flowers, setFlowers] = useState([]);
  const [wrappingPapers, setWrappingPapers] = useState([]);
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [selectedWrappingPaper, setSelectedWrappingPaper] = useState(null);
  const [gridType, setGridType] = useState("5x5");

  const navigate = useNavigate();

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
      const res = await axios.get("http://localhost:8080/api/flowers/all");
      setFlowers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching flowers:", err);
      setFlowers([]);
    }
  };

  const fetchWrappingPapers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/wrappingPapers");
      setWrappingPapers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching wrapping papers:", err);
      setWrappingPapers([]);
    }
  };

  const selectFlower = (flower) => {
    setSelectedFlowers((prev) => [...prev, flower].sort(() => Math.random() - 0.5));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(selectedFlowers);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSelectedFlowers(reordered);
  };

  const handlePlaceOrder = () => {
    const cartItems = selectedFlowers.reduce((acc, flower) => {
      const found = acc.find((item) => item.id === flower.id);
      if (found) {
        found.quantity += 1;
      } else {
        acc.push({ ...flower, quantity: 1 });
      }
      return acc;
    }, []);

    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const wrappingPaperCost = selectedWrappingPaper?.price || 0;
    const flatDiscount = subTotal > 1000 ? 100 : 0;
    const total = subTotal + wrappingPaperCost - flatDiscount;

    navigate("/delivery-form", {
      state: {
        cartItems,
        selectedWrappingPaper,
        orderSummary: {
          subTotal,
          wrappingPaperCost,
          flatDiscount,
          total,
        },
      },
    });
  };

  return (
    <div className="flower-customization">
      <h1>Customize Your Bouquet</h1>

      <h2>Available Flowers</h2>
      <div className="scroll-container">
        {flowers.map((flower) => (
          <div key={flower.id} className="card-container" onClick={() => selectFlower(flower)}>
            <img
              src={
                flower.imageBase64
                  ? `data:image/jpeg;base64,${flower.imageBase64}`
                  : "/path/to/placeholder.jpg"
              }
              alt={flower.name}
              className="card-image"
            />
            <div className="card-title">{flower.name}</div>
            <div className="card-price">Rs.{flower.price}</div>
          </div>
        ))}
      </div>

      <h2>Selected Flowers</h2>
      <label htmlFor="gridType">Grid Layout: </label>
      <select id="gridType" value={gridType} onChange={(e) => setGridType(e.target.value)}>
        {Object.keys(gridOptions).map((key) => (
          <option key={key} value={key}>
            {key.replace("x", " × ")}
          </option>
        ))}
      </select>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="grid" direction="horizontal">
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
              }}
            >
              {selectedFlowers.slice(0, gridOptions[gridType] ** 2).map((flower, index) => (
                <Draggable
                  key={`flower-${index}-${flower.id}`}
                  draggableId={`flower-${index}-${flower.id}`}
                  index={index}
                >
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
                      }}
                    >
                      <img
                        src={
                          flower.imageBase64
                            ? `data:image/jpeg;base64,${flower.imageBase64}`
                            : "/path/to/placeholder.jpg"
                        }
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
          <div
            key={paper.id}
            className={`card-container ${selectedWrappingPaper?.id === paper.id ? "selected" : ""}`}
            onClick={() => setSelectedWrappingPaper(paper)}
          >
            <img
              src={
                paper.imageBase64
                  ? `data:image/jpeg;base64,${paper.imageBase64}`
                  : "/path/to/placeholder.jpg"
              }
              alt="Wrapping"
              className="card-image"
            />
            <div className="card-price">Rs.{paper.price}</div>
          </div>
        ))}
      </div>

      <button className="order-button" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
}
