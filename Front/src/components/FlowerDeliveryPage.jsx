import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FlowerDeliveryPage.css';

const FlowerDeliveryPage = () => {
  const [deliveryPerson, setDeliveryPerson] = useState({
    name: "John", // Default values
    phone: "0789654123"
  });
  
  const placeholderBouquet = "https://via.placeholder.com/80x80/ff69b4/FFFFFF?text=Bouquet";
  const placeholderProfile = "https://via.placeholder.com/30x30/808080/FFFFFF?text=P";
  
  const handleBackClick = () => {
    console.log('Back button clicked');
  };

  useEffect(() => {
    // 1. Check sessionStorage first (most recent session)
    const sessionData = sessionStorage.getItem('currentDeliveryPerson');
    if (sessionData) {
      setDeliveryPerson(JSON.parse(sessionData));
      return;
    }

    // 2. Check localStorage (persisted across sessions)
    const localData = localStorage.getItem('currentDeliveryPerson');
    if (localData) {
      setDeliveryPerson(JSON.parse(localData));
      return;
    }

    // 3. Fallback to API request
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
    <div className="delivery-page">
      <header className="header">
        <div className="logo-container">
          <img src="src/images/logo.png" alt="GE FLORA" className="logo" />
        </div>
        <div className="profile-icon-container">
          <img src={placeholderProfile} alt="Profile" className="profile-icon" />
        </div>
      </header>

      <main className="main-content">
        <h2 className="delivery-title">Delivery person's details</h2>
        
        <div className="delivery-details">
          <p>Name - {deliveryPerson.name}</p>
          <p>Phone Number - {deliveryPerson.phone}</p>
        </div>

        <div className="delivery-info-container">
          <div className="order-info">
            <img src="src/images/rose.jpg" alt="Flower Bouquet" className="bouquet-image" />
            <div className="total-bill">
              <p>Total Bill Rs.</p>
              <p className="amount">2580.00</p>
            </div>
            <p className="delivery-note">This order will be delivered to you safely.</p>
            <p className="delivery-note">If you want to know more about delivery, call the courier.</p>
          </div>

          <div className="delivery-illustration">
            <img src="src/images/delivery.png" alt="delivery" className="delivery-image" />
          </div>
        </div>

        <div className="back-button-container">
          <button className="back-button" onClick={handleBackClick}>
            <span className="back-arrow"></span> Back
          </button>
        </div>
      </main>
    </div>
  );
};

export default FlowerDeliveryPage;