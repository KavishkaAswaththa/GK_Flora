import React from 'react';
import '../../styles/loyalty-point/Loyalty1.css';
import crownImage from '../../images/silver-crown.jpg';

const SilverMembership = () => {
  return (
    <div className="silver-app">
      <main className="silver-membership-content">
        <div className="silver-congratulations-container">
          <div className="silver-congratulations-banner">
            <h1 className="silver-congratulations-title">CONGRATULATIONS!!!</h1>
            <img src={crownImage} alt="Silver Crown" className="silver-crown-image" />
          </div>

          <div className="silver-membership-info">
            <h2 className="silver-welcome-message">Welcome to Silver Family</h2>
            <p className="silver-membership-description">
              You have earned 75 points and now you are a Silver Member. Join the family and enjoy your discounts!
            </p>

            <div className="silver-accept-container">
              <p className="silver-update-question">Do you want to update your membership?</p>
              <button className="silver-accept-button">Accept</button>
            </div>

            <div className="silver-options-container">
              <button className="silver-option-button">New Ways to Collect Points</button>
              <button className="silver-option-button">New Ways to Earn Rewards</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SilverMembership;
