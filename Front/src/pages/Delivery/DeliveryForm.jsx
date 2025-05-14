import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Delivery/DeliveryForm.css';

const DeliveryForm = () => {
    const navigate = useNavigate();
    const { deliveryId } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        phone1: '',
        sameAsSender: false,
        senderName: '',
        senderEmail: '',
        phone2: '',
        deliveryDate: '',
        deliveryTime: '',
        deliveryType: '',
        message: ''
    });

    const [timeError, setTimeError] = useState('');
    const [cities, setCities] = useState([]);

    // Fetch available cities from backend
    const fetchCities = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/delivery/cities');
            setCities(response.data);
        } catch (error) {
            console.error('Failed to load cities:', error);
            alert('Error fetching cities');
        }
    };

    useEffect(() => {
        fetchCities();

        // Set default delivery date/time (2 hours later)
        const now = new Date();
        const future = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        setFormData(prev => ({
            ...prev,
            deliveryDate: future.toISOString().split('T')[0],
            deliveryTime: `${future.getHours().toString().padStart(2, '0')}:${future.getMinutes().toString().padStart(2, '0')}`
        }));

        if (deliveryId) {
            const fetchDelivery = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/v1/delivery/${deliveryId}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error loading delivery:', error);
                    alert('Failed to load delivery details');
                }
            };
            fetchDelivery();
        }
    }, [deliveryId]);

    const validateDeliveryDateTime = (date, time) => {
        const now = new Date();
        const selected = new Date(`${date}T${time}`);
        const minAllowed = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        return selected >= minAllowed;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updated = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };

        if (name === 'sameAsSender' && checked) {
            updated.senderName = formData.name;
            updated.phone2 = formData.phone1;
        }

        if (name === 'deliveryDate' || name === 'deliveryTime') {
            const newDate = name === 'deliveryDate' ? value : formData.deliveryDate;
            const newTime = name === 'deliveryTime' ? value : formData.deliveryTime;
            const valid = validateDeliveryDateTime(newDate, newTime);
            setTimeError(valid ? '' : 'Delivery time must be at least 2 hours from now');
        }

        setFormData(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.phone1) {
            alert('Please fill in all required fields');
            return;
        }

        const isTimeValid = validateDeliveryDateTime(formData.deliveryDate, formData.deliveryTime);
        if (!isTimeValid) {
            setTimeError('Delivery time must be at least 2 hours from now');
            return;
        }

        const payload = {
            ...formData,
            sameAsSender: undefined // exclude
        };

        try {
            if (deliveryId) {
                await axios.put(`http://localhost:8080/api/v1/delivery/edit/${deliveryId}`, payload);
                alert('Delivery updated successfully');
            } else {
                await axios.post('http://localhost:8080/api/v1/delivery/save', payload);
                alert('Delivery submitted successfully');
            }

            navigate('/order-confirmation', { state: { deliveryDetails: formData } });
        } catch (error) {
            console.error('Submission error:', error);
            alert(`Submission failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="delivery-form-container">
            <h1>{deliveryId ? 'Edit Delivery' : 'Delivery Details'}</h1>

            <form onSubmit={handleSubmit}>
                {/* Recipient Info */}
                <div className="form-section">
                    <h2>Recipient Information</h2>
                    <div className="form-group">
                        <label>Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Address *</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>City *</label>
                            <select name="city" value={formData.city} onChange={handleChange} required>
                                <option value="">Select City</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Contact Number *</label>
                            <input
                                type="tel"
                                name="phone1"
                                value={formData.phone1}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{10}"
                            />
                        </div>
                    </div>
                </div>

                {/* Sender Info */}
                <div className="form-section">
                    <h2>Sender Information</h2>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="sameAsSender"
                            name="sameAsSender"
                            checked={formData.sameAsSender}
                            onChange={handleChange}
                        />
                        <label htmlFor="sameAsSender">Same as Recipient</label>
                    </div>
                    {!formData.sameAsSender && (
                        <>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="senderName"
                                    value={formData.senderName}
                                    onChange={handleChange}
                                    required={!formData.sameAsSender}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="senderEmail"
                                    value={formData.senderEmail}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone *</label>
                                <input
                                    type="tel"
                                    name="phone2"
                                    value={formData.phone2}
                                    onChange={handleChange}
                                    required={!formData.sameAsSender}
                                    pattern="[0-9]{10}"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Schedule Info */}
                <div className="form-section">
                    <h2>Delivery Schedule</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date *</label>
                            <input
                                type="date"
                                name="deliveryDate"
                                value={formData.deliveryDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Time *</label>
                            <input
                                type="time"
                                name="deliveryTime"
                                value={formData.deliveryTime}
                                onChange={handleChange}
                                required
                            />
                            {timeError && <div className="error-message">{timeError}</div>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Delivery Type</label>
                        <select name="deliveryType" value={formData.deliveryType} onChange={handleChange}>
                            <option value="select">Select delivery type</option>
                            <option value="express">Get delivered to your door step</option>
                            <option value="priority">Pickup From Your Nearest Branch</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Special Instructions</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Any special delivery instructions..."
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        {deliveryId ? 'Update Delivery' : 'Submit Delivery'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeliveryForm;
