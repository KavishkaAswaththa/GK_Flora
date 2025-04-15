import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/Delivery/CityManager.css";

const CityManager = () => {
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');
    const [editCityId, setEditCityId] = useState(null);
    const [editCityName, setEditCityName] = useState('');
    
    const fetchCities = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/delivery/cities');
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
            alert("Failed to fetch cities");
        }
    };
    
    useEffect(() => {
        fetchCities();
    }, []);
    
    const handleAddCity = async () => {
        if (!newCity.trim()) return;
        try {
            await axios.post('http://localhost:8080/api/v1/delivery/cities', { name: newCity });
            setNewCity('');
            alert('City added successfully!');
            fetchCities();
        } catch (error) {
            console.error("Error adding city:", error);
            alert("Failed to add city");
        }
    };
    
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/delivery/cities/${id}`);
            alert('City deleted successfully!');
            fetchCities();
        } catch (error) {
            console.error("Error deleting city:", error);
            alert("Failed to delete city");
        }
    };
    
    const handleEdit = (id, name) => {
        setEditCityId(id);
        setEditCityName(name);
    };
    
    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/api/v1/delivery/cities/${editCityId}`, { name: editCityName });
            setEditCityId(null);
            setEditCityName('');
            alert('City updated successfully!');
            fetchCities();
        } catch (error) {
            console.error("Error updating city:", error);
            alert("Failed to update city");
        }
    };
    
    return (
        <div className="admin-city-container">
            <h2>Manage Cities</h2>
            
            <div className="city-input-container">
                <input
                    type="text"
                    placeholder="Add new city"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="city-input"
                />
                <button 
                    onClick={handleAddCity}
                    className="add-button"
                >
                    Add City
                </button>
            </div>
            
            <ul className="city-list">
                {cities.map((city) => (
                    <li key={city.id} className="city-item">
                        {editCityId === city.id ? (
                            <div className="edit-container">
                                <input
                                    value={editCityName}
                                    onChange={(e) => setEditCityName(e.target.value)}
                                    className="edit-input"
                                />
                                <button 
                                    onClick={handleUpdate}
                                    className="update-button"
                                >
                                    Update
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="city-name">{city.name}</span>
                                <div className="button-container">
                                    <button 
                                        onClick={() => handleEdit(city.id, city.name)}
                                        className="edit-button"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(city.id)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CityManager;