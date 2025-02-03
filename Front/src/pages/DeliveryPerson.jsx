import axios from "axios";

import React, { useEffect, useState } from "react";


function Delivery() {
    const [users, setUsers] = useState([]); 
    const [error, setError] = useState(null); 

    
    useEffect(() => {
        (async () => await Load())();
    }, []);

   
    async function Load() {
        try {
            const result = await axios.get("http://localhost:8080/api/v1/delivery/getperson");
            setUsers(result.data);
            setError(null); 
        } catch (error) {
            console.error("Failed to load delivery person details:", error);
            setError("Failed to fetch delivery details. Please try again later.");
        }
    }

    return (
        <div className="delivery-container">
            <h1 className="text-center">Delivery Person Details</h1>

           
            {error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}

         
            <div className="container mt-4">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Delivery Person's Name</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                     
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.delivername}</td>
                                    <td>{user.deliverphone}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center">
                                    No delivery persons found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Delivery;
