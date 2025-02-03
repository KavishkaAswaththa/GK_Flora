import React, { useState, useEffect } from "react";
import axios from "axios";
import flowerImage from "../images/flower2.jpg"; 
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/DeliveryForm.css";

function DeliveryForm() {
    const [deliveryId, setDeliveryId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [message, setMessage] = useState("");
    const [deliveryType, setDeliveryType] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.delivery) {
            const { delivery } = location.state;
            setDeliveryId(delivery._id);
            setName(delivery.name);
            setPhone(delivery.phone);
            setAddress(delivery.address);
            setCity(delivery.city);
            setDeliveryDate(delivery.deliveryDate);
            setDeliveryTime(delivery.deliveryTime);
            setMessage(delivery.message);
            setDeliveryType(delivery.deliveryType || "gift");
        }
    }, [location.state]);

    const handleInputChange = (event) => {
        setDeliveryType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (deliveryId) {
                await axios.put(`http://localhost:8080/api/v1/delivery/edit/${deliveryId}`, {
                    name, phone, address, city, deliveryDate, deliveryTime, deliveryType, message,
                });
                alert("Delivery details updated successfully");
            } else {
                await axios.post("http://localhost:8080/api/v1/delivery/save", {
                    name, phone, address, city, deliveryDate, deliveryTime, deliveryType, message
                });
                alert("Details submitted successfully");
            }
            navigate("/table");
        } catch (error) {
            alert("Submission failed");
        }
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="container">
            <div className="delivery-page">
                <div className="progress-bar">
                    <div className="step completed"><span>Order Placed</span><i className="icon">✔️</i></div>
                    <div className="step in-progress"><span>In Transit</span><i className="icon">🚚</i></div>
                    <div className="step"><span>Completed</span><i className="icon">✅</i></div>
                </div>

                <div className="delivery-container">
                <div className="t"><h1>{deliveryId ? "Delivery Details" : "Delivery Details"}</h1></div>
                    <div className="delivery-sidebar">
                        <img className="delivery-picture" src={flowerImage} alt="Flower" />
                    </div>
                   

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <label htmlFor="recipientName">Recipient's Name</label>
                            <input type="text" id="recipientName" name="recipientName" placeholder="Enter recipient's name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-row">
                            <label>Phone</label>
                            <input type="text" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                        <div className="form-row">
                            <label htmlFor="address">Delivery Address</label>
                            <textarea id="address" name="address" placeholder="Enter delivery address" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
                        </div>
                        <div className="form-row">
                            <label>City</label>
                            <select value={city} onChange={(e) => setCity(e.target.value)} required>
                                <option value="">Select City</option>
                                <option value="Attidiya">Attidiya</option>
                                <option value="Baththaramulla">Baththaramulla</option>
                                <option value="Boralesgamuwa">Boralesgamuwa</option>
                                <option value="option3">Collombo 01-(Fort)</option>
                                <option value="option3">Collombo 02-(Union Place)</option>
                                <option value="option3">Collombo 03-(Kollupitiya)</option>
                                <option value="option3">Collombo 04-(Bambalapitiya)</option>
                                <option value="option3">Collombo 05-(Havelock/Kirulapana)</option>
                                <option value="option3">Collombo 06-(Wellawatta)</option>
                                <option value="option3">Collombo 07-(Cinnamon Gardens)</option>
                                <option value="option3">Collombo 08-(Borella)</option>
                                <option value="option3">Collombo 09-(Dematagoda)</option>
                                <option value="option3">Collombo 10-(Maradana)</option>
                                <option value="option3">Collombo 11-(Pettah)</option>
                                <option value="option3">Collombo 12-(Hultsdorf)</option>
                                <option value="option3">Collombo 13-(Kotahena)</option>
                                <option value="option3">Collombo 14-(Grandpass)</option>
                                <option value="option3">Collombo 15-(Mattakuliya)</option>
                                <option value="option3">Dehiwala</option>
                                <option value="option3">Delkanda</option>
                                <option value="option3">Gandodawila</option>
                                <option value="option3">Kalubowila</option>
                                <option value="option3">Karagampitiya</option>
                                <option value="option3">Kelaniya</option>
                                <option value="option3">Maharagama</option>
                                <option value="option3">Malabe</option>
                                <option value="option3">Maharagama</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <label>Delivery Date</label>
                            <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} required min={today} />
                        </div>
                        <div>
                            <label>Delivery Time</label>
                            <input type="time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} required />
                        </div>
                        <div className="form-row">
                            <label htmlFor="message">Your Personal Message</label>
                            <textarea id="message" name="message" placeholder="Optional" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                        </div>
                        <div className="button">
                            <button type="submit">{deliveryId ? "Update" : "View Details"}</button>
                        </div>
                        <div className="button">
                            <button type="submit">{deliveryId ? "Update" : "Proceed to Payment"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DeliveryForm;
