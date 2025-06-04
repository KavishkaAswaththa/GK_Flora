import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/Delivery/CityManager.css";

const CityManager = () => {
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');
    const [editCityId, setEditCityId] = useState(null);
    const [editCityName, setEditCityName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCities, setSelectedCities] = useState([]); // Track selected cities
    
    const fetchCities = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8080/api/v1/delivery/cities');
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
            setError("Failed to fetch cities");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCities();
    }, []);
    
    const handleAddCity = async () => {
        if (!newCity.trim()) return;
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/v1/delivery/cities', { name: newCity });
            setCities(prevCities => [...prevCities, response.data]);
            setNewCity('');
        } catch (error) {
            console.error("Error adding city:", error);
            setError("Failed to add city");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Toggle selection for a single city
    const toggleCitySelection = (cityId) => {
        setSelectedCities(prevSelected => 
            prevSelected.includes(cityId)
                ? prevSelected.filter(id => id !== cityId)
                : [...prevSelected, cityId]
        );
    };
    
    // Select all cities
    const selectAllCities = () => {
        if (selectedCities.length === cities.length) {
            setSelectedCities([]);
        } else {
            setSelectedCities(cities.map(city => city.id));
        }
    };
    
    // Delete selected cities
    const deleteSelectedCities = async () => {
        if (selectedCities.length === 0) return;
        
        setIsLoading(true);
        try {
            // Delete each selected city
            await Promise.all(
                selectedCities.map(id => 
                    axios.delete(`http://localhost:8080/api/v1/delivery/cities/${id}`)
                )
            );
            
            // Update local state
            setCities(prevCities => 
                prevCities.filter(city => !selectedCities.includes(city.id))
            );
            
            // Clear selection
            setSelectedCities([]);
        } catch (error) {
            console.error("Error deleting cities:", error);
            setError("Failed to delete selected cities");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleEdit = (id, name) => {
        setEditCityId(id);
        setEditCityName(name);
    };
    
    const handleUpdate = async () => {
        if (!editCityName.trim()) return;
        setIsLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:8080/api/v1/delivery/cities/${editCityId}`, 
                { name: editCityName }
            );
            setCities(prevCities => 
                prevCities.map(city => 
                    city.id === editCityId ? response.data : city
                )
            );
            setEditCityId(null);
            setEditCityName('');
        } catch (error) {
            console.error("Error updating city:", error);
            setError("Failed to update city");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

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
                    disabled={isLoading}
                />
                <button 
                    onClick={handleAddCity}
                    className="add-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Adding...' : 'Add City'}
                </button>
            </div>
            
            {/* Bulk actions */}
            {cities.length > 0 && (
                <div className="bulk-actions">
                    <label className="select-all-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedCities.length === cities.length && cities.length > 0}
                            onChange={selectAllCities}
                            disabled={isLoading}
                        />
                        Select All
                    </label>
                    <button
                        onClick={deleteSelectedCities}
                        className="delete-selected-button"
                        disabled={selectedCities.length === 0 || isLoading}
                    >
                        {isLoading ? 'Deleting...' : `Delete Selected (${selectedCities.length})`}
                    </button>
                </div>
            )}
            
            <ul className="city-list">
                {cities.map((city) => (
                    <li key={city.id} className="city-item">
                        <input
                            type="checkbox"
                            checked={selectedCities.includes(city.id)}
                            onChange={() => toggleCitySelection(city.id)}
                            className="city-checkbox"
                            disabled={isLoading}
                        />
                        
                        {editCityId === city.id ? (
                            <div className="edit-container">
                                <input
                                    value={editCityName}
                                    onChange={(e) => setEditCityName(e.target.value)}
                                    className="edit-input"
                                    disabled={isLoading}
                                />
                                <button 
                                    onClick={handleUpdate}
                                    className="update-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="city-name">{city.name}</span>
                                <div className="button-container">
                                    <button 
                                        onClick={() => handleEdit(city.id, city.name)}
                                        className="edit-button"
                                        disabled={isLoading}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => setSelectedCities([city.id])}
                                        className="delete-button"
                                        disabled={isLoading}
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