import React from 'react';
import '../../styles/loyalty-point/Loyalty1.css';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import crownImage from '../../images/silver-crown.jpg'; // Make sure to add this image to your assets

const SilverMembership = () => {
  return (
    <div className="app">
      
      
      
      {/* Main Content */}
      <main className="membership-content">
        <div className="congratulations-container">
          {/* Congratulations Banner */}
          <div className="congratulations-banner">
            <h1 className="congratulations-title">CONGRATULATIONS!!!</h1>
            <img src={crownImage} alt="Silver Crown" className="crown-image" />
          </div>
          
          {/* Membership Info */}
          <div className="membership-info">
            <h2 className="welcome-message">welcome to silver family</h2>
            
            <p className="membership-description">
              you have earn 75 points and now you earned silver membership. you can join to the family and get your discounts!
            </p>
            
            <div className="accept-container">
              <p className="update-question">Do you want to update your membership ?</p>
              <button className="accept-button">Accept</button>
            </div>
            
            {/* Options */}
            <div className="options-container">
              <button className="option-button left-option">New Ways to Collect Points</button>
              <button className="option-button right-option">New Ways to Earn Rewards</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SilverMembership;