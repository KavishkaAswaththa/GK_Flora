import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DeliveryTable.css";

function DeliveryTable() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        const result = await axios.get("http://localhost:8080/api/v1/delivery/getperson");
        setUsers(result.data);
    }

    async function deleteDelivery(deliveryid) {
        await axios.delete(`http://localhost:8080/api/v1/delivery/deleteperson/${deliveryid}`);
        alert("Details deleted successfully");
        loadUsers();
    }

    function editDelivery(delivery) {
        navigate("/admin", {
            state: {
                deliveryid: delivery._id,
                delivername: delivery.delivername,
                deliverphone: delivery.deliverphone,
            },
        });
    }

    return (
        <div className="container">
            <h1>Delivery Table</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Delivery Person Name</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((delivery) => (
                        <tr key={delivery._id}>
                            <td>{delivery.delivername}</td>
                            <td>{delivery.deliverphone}</td>
                            <td>
                                <button onClick={() => editDelivery(delivery)}>Edit</button>
                                <button onClick={() => deleteDelivery(delivery._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DeliveryTable;
