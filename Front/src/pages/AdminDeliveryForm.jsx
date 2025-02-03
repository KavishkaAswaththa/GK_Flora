import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DeliveryForm.css";

function DeliveryForm() {
    const [deliveryid, setId] = useState("");
    const [delivername, setName] = useState("");
    const [deliverphone, setPhone] = useState("");
    const [error, setError] = useState(""); // State for error messages
    const navigate = useNavigate();

    async function save(event) {
        event.preventDefault();
        if (!delivername.trim() || !deliverphone.trim()) {
            setError("All fields are required!");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/v1/delivery/saveperson", {
                delivername,
                deliverphone,
            });
            alert("Details submitted successfully");
            resetForm();
            navigate("/AdminDeliveryTable");
        } catch (error) {
            alert("Submission failed");
        }
    }

    async function update(event) {
        event.preventDefault();
        if (!delivername.trim() || !deliverphone.trim()) {
            setError("All fields are required!");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/v1/delivery/updateperson/${deliveryid}`, {
                delivername,
                deliverphone,
            });
            alert("Details updated");
            resetForm();
            navigate("/table");
        } catch (error) {
            alert("Update failed");
        }
    }

    function resetForm() {
        setId("");
        setName("");
        setPhone("");
        setError("");
    }

    return (
        <div className="container">
            <div>
                <h1>Delivery Person's Details</h1>
            </div>
            <form>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <div>
                    <label>Delivery Person's Name</label>
                    <input
                        type="text"
                        value={delivername}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={deliverphone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="btn">
                    <button onClick={save}>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default DeliveryForm;
