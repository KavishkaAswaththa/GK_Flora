import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Delivery/DeliveryForm.css";

function DeliveryForm() {
    const [delivername, setName] = useState("");
    const [deliverphone, setPhone] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    async function save(event) {
        event.preventDefault();
        
        if (!delivername.trim()) {
            setError("Name is required!");
            return;
        }
        
        if (!deliverphone.trim()) {
            setError("Phone number is required!");
            return;
        }
        
        if (!validatePhone(deliverphone)) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/v1/delivery/saveperson", {
                delivername,
                deliverphone,
            });
            
            // Store in localStorage and sessionStorage for immediate access
            const deliveryData = {
                name: delivername,
                phone: deliverphone,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('currentDeliveryPerson', JSON.stringify(deliveryData));
            sessionStorage.setItem('currentDeliveryPerson', JSON.stringify(deliveryData));
            
            alert("Delivery person added successfully");
            navigate("/admintable", { 
                state: { 
                    newDeliveryPerson: response.data,
                    message: "Delivery person added successfully" 
                }
            });
        } catch (error) {
            alert("Submission failed: " + (error.response?.data?.message || error.message));
        }
    }

    function resetForm() {
        setName("");
        setPhone("");
        setError("");
    }

    return (
        <div className="container">
            <div>
                <h1>Delivery Person's Details</h1>
            </div>
            <form onSubmit={save}>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label>Delivery Person's Name</label>
                    <input
                        type="text"
                        value={delivername}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError("");
                        }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={deliverphone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            setError("");
                        }}
                        pattern="[0-9]{10}"
                        title="10 digit phone number"
                        required
                    />
                </div>
                <div className="btn-group">
                    <button type="submit" className="submit-btn">Submit</button>
                    <button type="button" onClick={resetForm} className="reset-btn">Reset</button>
                </div>
            </form>
        </div>
    );
}

export default DeliveryForm;