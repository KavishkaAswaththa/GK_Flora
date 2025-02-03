import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/DeliveryTable.css";

function DeliveryTable() {
    const [users, setUsers] = useState([]);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
    const navigate = useNavigate();

    // Fetch delivery data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get("http://localhost:8080/api/v1/delivery/getall");
                setUsers(result.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Handle delete action
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/delivery/delete/${id}`);
            setUsers(users.filter((user) => user._id !== id));
            alert("Delivery deleted successfully");
        } catch (error) {
            alert("Failed to delete the delivery");
        }
    };

    // Handle update action
    const handleUpdate = (delivery) => {
        setSelectedDeliveryId(delivery._id);
        navigate("/customer", { state: { delivery } });
    };

    return (
        <div className="container">
            <h1>Delivery Details</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Delivery Date</th>
                        <th>Delivery Time</th>
                        <th>Message</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.phone}</td>
                            <td>{user.address}</td>
                            <td>{user.city}</td>
                            <td>{user.deliveryDate}</td>
                            <td>{user.deliveryTime}</td>
                            <td>{user.message}</td>
                            <td>
                                <button onClick={() => handleUpdate(user)}>Update</button>
                                <button onClick={() => handleDelete(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button1">
                <button type="payment">{selectedDeliveryId ? "Update" : "Proceed to Payment"}</button>
            </div>
        </div>
    );
}

export default DeliveryTable;
