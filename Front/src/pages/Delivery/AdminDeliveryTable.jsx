import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Delivery/AdminDeliveryTable.css";

function DeliveryTable({ mode = "admin", onSelect }) {
    const [users, setUsers] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
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

    function handleSelect(delivery) {
        setSelectedPerson(delivery._id);
        if (onSelect) {
            onSelect(delivery);
        }
        // Navigate to delivery page with the selected delivery person's data
        navigate("/delivery", {
            state: {
                deliveryPerson: delivery
            }
        });
    }

    function handleAddDeliveryPerson() {
        navigate("/admin"); // Navigate to the form to add a new delivery person
    }

    return (
        <div className="container">
            <h1>{mode === "admin" ? "Delivery Table" : "Select Delivery Person"}</h1>
            {mode === "admin" && (
                <button 
                    onClick={handleAddDeliveryPerson}
                    className="add-delivery-person-btn"
                >
                    Add New Delivery Person
                </button>
            )}
            <table className="delivery-table" border="1">
                <thead>
                    <tr>
                        <th>Delivery Person Name</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((delivery) => (
                        <tr 
                            key={delivery._id}
                            className={selectedPerson === delivery._id ? "selected-row" : ""}
                        >
                            <td>{delivery.delivername}</td>
                            <td>{delivery.deliverphone}</td>
                            <td>
                                {mode === "admin" ? (
                                    <>
                                        <button onClick={() => editDelivery(delivery)}>Edit</button>
                                        <button onClick={() => deleteDelivery(delivery._id)}>Delete</button>
                                        <button onClick={() => handleSelect(delivery._id)}>Select</button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => handleSelect(delivery)}
                                        className={selectedPerson === delivery._id ? "selected-btn" : ""}
                                    >
                                        Select
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DeliveryTable;