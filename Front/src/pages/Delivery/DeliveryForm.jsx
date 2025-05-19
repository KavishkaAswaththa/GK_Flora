import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Delivery/DeliveryForm.css';

const DeliveryForm = () => {
    const navigate = useNavigate();
    const { deliveryId } = useParams();
    const location = useLocation();
    const editFormData = location.state?.formData;

    const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
    const [selectedWrappingPaper, setSelectedWrappingPaper] = useState(location.state?.selectedWrappingPaper || null);
    
    const wrappingPaperPrice = selectedWrappingPaper?.price || 0;

    const [orderSummary, setOrderSummary] = useState(() => {
        const summary = location.state?.orderSummary || { subTotal: 0, flatDiscount: 0, total: 0 };
        return {
            ...summary,
            total: (summary.total || 0) + wrappingPaperPrice
        };
    });

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
    const [userData, setUserData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const user = response.data;
            setUserData(user);

            setFormData(prev => ({
                ...prev,
                senderName: user.name || '',
                senderEmail: user.email || '',
                phone2: user.mobileNo || '',
                address: user.address?.streetAddress || '',
                city: user.address?.city || ''
            }));
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoadingUser(false);
        }
    };

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
        fetchUserData();
        fetchCities();

        if (editFormData) {
            setFormData(editFormData);
        }

        if (!editFormData && !deliveryId) {
            const now = new Date();
            const future = new Date(now.getTime() + 2 * 60 * 60 * 1000);
            setFormData(prev => ({
                ...prev,
                deliveryDate: future.toISOString().split('T')[0],
                deliveryTime: `${future.getHours().toString().padStart(2, '0')}:${future.getMinutes().toString().padStart(2, '0')}`
            }));
        }

        if (deliveryId && !editFormData) {
            const fetchDelivery = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/v1/delivery/${deliveryId}`);
                    const deliveryData = response.data;

                    setFormData(prev => ({
                        ...prev,
                        ...deliveryData
                    }));

                    if (deliveryData.cartItems) setCartItems(deliveryData.cartItems);
                    if (deliveryData.orderSummary) setOrderSummary(deliveryData.orderSummary);
                    if (deliveryData.selectedWrappingPaper) setSelectedWrappingPaper(deliveryData.selectedWrappingPaper);
                } catch (error) {
                    console.error('Error loading delivery:', error);
                    alert('Failed to load delivery details');
                }
            };
            fetchDelivery();
        }
    }, [deliveryId, editFormData, navigate]);

    const validateDeliveryDateTime = (date, time) => {
        const now = new Date();
        const selected = new Date(`${date}T${time}`);
        const minAllowed = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        return selected >= minAllowed;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSameAsSenderChange = (e) => {
        const { checked } = e.target;
        if (checked) {
            setFormData(prev => ({
                ...prev,
                sameAsSender: true,
                name: prev.senderName,
                phone1: prev.phone2,
                address: userData?.address?.streetAddress || '',
                city: userData?.address?.city || ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                sameAsSender: false,
                name: '',
                phone1: '',
                address: '',
                city: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.phone1) {
            alert('Please fill in all required recipient fields');
            return;
        }

        if (!validateDeliveryDateTime(formData.deliveryDate, formData.deliveryTime)) {
            setTimeError('Delivery time must be at least 2 hours from now');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                sameAsSender: undefined,
                cartItems,
                orderSummary: {
                    ...orderSummary,
                    total: orderSummary.total + 350 // Delivery fee included
                },
                selectedWrappingPaper
            };

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            if (deliveryId) {
                await axios.put(`http://localhost:8080/api/v1/delivery/edit/${deliveryId}`, payload, { headers });
                alert('Delivery updated successfully');
            } else {
                await axios.post('http://localhost:8080/api/v1/delivery/save', payload, { headers });
                alert('Delivery submitted successfully');
            }

            navigate('/order-confirmation', {
                state: {
                    deliveryDetails: formData,
                    cartItems,
                    orderSummary: {
                        ...orderSummary,
                        total: orderSummary.total + 350
                    },
                    selectedWrappingPaper
                }
            });
        } catch (error) {
            console.error('Submission error:', error);
            alert(`Submission failed: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loadingUser) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your information...</p>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="summary-section">
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-card">
                        {cartItems.map(item => (
                            <div key={item.id} className="order-item">
                                <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">Rs. {item.price.toFixed(2)}</span>
                                </div>
                                <div className="item-quantity">
                                    <span>Qty: {item.quantity}</span>
                                </div>
                            </div>
                        ))}

                        {selectedWrappingPaper && (
                            <div className="order-item">
                                <div className="item-info">
                                    <span className="item-name">Wrapping Paper</span>
                                    <span className="item-price">Rs. {selectedWrappingPaper.price.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        <div className="total-section">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>Rs. {orderSummary.subTotal.toFixed(2)}</span>
                            </div>
                            {orderSummary.flatDiscount > 0 && (
                                <div className="total-row">
                                    <span>Discount:</span>
                                    <span>-Rs. {orderSummary.flatDiscount.toFixed(2)}</span>
                                </div>
                            )}
                            
                            <div className="total-row">
                                <span>Delivery Fee:</span>
                                <span>Rs. 350.00</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total:</span>
                                <span>Rs. {(orderSummary.total + 350).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="delivery-form-section">
                <div className="delivery-form-container">
                    <h2>{deliveryId ? 'Edit Delivery' : 'Delivery Details'}</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Sender Info */}
                        <div className="form-section">
                            <h3>Sender Information</h3>
                            <div className="form-group">
                                <label>Name *</label>
                                <input type="text" name="senderName" value={formData.senderName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" name="senderEmail" value={formData.senderEmail} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Phone *</label>
                                <input type="tel" name="phone2" value={formData.phone2} onChange={handleChange} required pattern="[0-9]{10}" />
                            </div>
                            <div className="checkbox-group">
                                <input type="checkbox" id="sameAsSender" name="sameAsSender" checked={formData.sameAsSender} onChange={handleSameAsSenderChange} />
                                <label htmlFor="sameAsSender">Use my information for recipient</label>
                            </div>
                        </div>

                        {/* Recipient Info */}
                        <div className="form-section">
                            <h3>Recipient Information</h3>
                            <div className="form-group">
                                <label>Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={formData.sameAsSender} />
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
                                    <input type="tel" name="phone1" value={formData.phone1} onChange={handleChange} required pattern="[0-9]{10}" disabled={formData.sameAsSender} />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Schedule */}
                        <div className="form-section">
                            <h3>Delivery Schedule</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
                                </div>
                                <div className="form-group">
                                    <label>Time *</label>
                                    <input type="time" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} required />
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
                                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Any special delivery instructions..." />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-button">
                                {deliveryId ? 'Update Delivery' : 'Proceed to Payment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeliveryForm;
