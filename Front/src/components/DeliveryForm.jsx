import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/DeliveryForm.css';

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

    useEffect(() => {
        // Set default date and time (today + 2 hours)
        const now = new Date();
        const deliveryTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const formattedDate = deliveryTime.toISOString().split('T')[0];
        const formattedTime = `${deliveryTime.getHours().toString().padStart(2, '0')}:${deliveryTime.getMinutes().toString().padStart(2, '0')}`;
        
        setFormData(prev => ({
            ...prev,
            deliveryDate: formattedDate,
            deliveryTime: formattedTime
        }));

        // Load existing delivery if editing
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
        const selectedDateTime = new Date(`${date}T${time}`);
        const minimumDateTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        
        return selectedDateTime >= minimumDateTime;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'sameAsSender' && checked) {
            setFormData(prev => ({
                ...prev,
                senderName: prev.name,
                phone2: prev.phone1
            }));
        }

        // Validate delivery time when date or time changes
        if (name === 'deliveryDate' || name === 'deliveryTime') {
            const newDate = name === 'deliveryDate' ? value : formData.deliveryDate;
            const newTime = name === 'deliveryTime' ? value : formData.deliveryTime;
            
            if (newDate && newTime) {
                const isValid = validateDeliveryDateTime(newDate, newTime);
                setTimeError(isValid ? '' : 'Delivery time must be at least 2 hours from now');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.name || !formData.address || !formData.phone1) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate delivery time
        const isTimeValid = validateDeliveryDateTime(formData.deliveryDate, formData.deliveryTime);
        if (!isTimeValid) {
            setTimeError('Delivery time must be at least 2 hours from now');
            return;
        }

        try {
            // Prepare payload matching your backend expectations
            const payload = {
                name: formData.name,
                phone1: formData.phone1,
                address: formData.address,
                city: formData.city,
                deliveryDate: formData.deliveryDate,
                deliveryTime: formData.deliveryTime,
                deliveryType: formData.deliveryType,
                message: formData.message,
                senderName: formData.senderName,
                senderEmail: formData.senderEmail,
                phone2: formData.phone2
            };

            if (deliveryId) {
                // Update existing delivery
                await axios.put(`http://localhost:8080/api/v1/delivery/edit/${deliveryId}`, payload);
                alert('Delivery details updated successfully');
            } else {
                // Create new delivery
                await axios.post('http://localhost:8080/api/v1/delivery/save', payload);
                alert('Details submitted successfully');
            }
            
            // Navigate to confirmation page with the form data
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
                <div className="form-section">
                    <h2>Recipient Information</h2>
                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address *</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>City *</label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            >
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
                        <select
                            name="deliveryType"
                            value={formData.deliveryType}
                            onChange={handleChange}
                        >
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