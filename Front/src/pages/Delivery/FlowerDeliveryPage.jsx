import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Delivery/FlowerDeliveryPage.css';

const FlowerDeliveryPage = () => {
  const navigate = useNavigate();
  const [deliveryPerson, setDeliveryPerson] = useState({
    name: "John",
    phone: "0789654123"
  });

  const handleBackClick = () => {
    navigate('/'); // Navigate to admin dashboard
  };

  useEffect(() => {
    const sessionData = sessionStorage.getItem('currentDeliveryPerson');
    if (sessionData) {
      setDeliveryPerson(JSON.parse(sessionData));
      return;
    }

    const localData = localStorage.getItem('currentDeliveryPerson');
    if (localData) {
      setDeliveryPerson(JSON.parse(localData));
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/delivery/current");
        if (response.data) {
          setDeliveryPerson({
            name: response.data.delivername,
            phone: response.data.deliverphone
          });
        }
      } catch (error) {
        console.error("Error fetching delivery person:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flower-delivery-page">
      <header className="flower-delivery-header">
        <div className="flower-delivery-logo-container"></div>
        <div className="flower-delivery-profile-icon-container"></div>
      </header>

      <main className="flower-delivery-main-content">
        <h2 className="flower-delivery-title">Delivery person's details</h2>

        <div className="flower-delivery-details">
          <p>Name - {deliveryPerson.name}</p>
          <p>Phone Number - {deliveryPerson.phone}</p>
        </div>

        <div className="flower-delivery-info-container">
          <div className="flower-delivery-illustration">
            <img src="src/images/delivery/delivery.png" alt="delivery" className="flower-delivery-image" />
          </div>
        </div>

        <div className="flower-back-button-container">
          <button className="flower-back-button" onClick={handleBackClick}>
            <span className="flower-back-arrow"></span> Back
          </button>
        </div>
      </main>
    </div>
  );
};

export default FlowerDeliveryPage;