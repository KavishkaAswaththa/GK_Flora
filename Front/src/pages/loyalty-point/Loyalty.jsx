import React from 'react';
import '../../styles/loyalty-point/Loyalty.css';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';

const MembershipLevels = () => {
  return (
    <div className="app">
      
      
      <main className="membership-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to GKFLORA!!!</h1>
          
          <div className="membership-banner">
            <h2 className="discover-text">There is so much discover..!!!</h2>
            <p className="get-started-text">
              Get started on your new GKFLORA<br />
              member journey now
            </p>
          </div>
          
          <div className="membership-details">
            <h2 className="section-title">1. New Member Levels</h2>
            
            <p className="section-description">
              We've introduce new member levels to help to earn ore rewards on GKFLORA
            </p>
            
            <h3 className="levels-title">New Levels</h3>
            
            <div className="levels-table">
              <div className="table-header">
                <div className="column levels-column">Levels</div>
                <div className="column points-column">Points</div>
              </div>
              
              <div className="table-row">
                <div className="column levels-column">
                  <span className="crown silver">👑</span> Silver Member
                </div>
                <div className="column points-column">1-100</div>
              </div>
              
              <div className="table-row">
                <div className="column levels-column">
                  <span className="crown gold">👑</span> Gold Member
                </div>
                <div className="column points-column">101-500</div>
              </div>
              
              <div className="table-row">
                <div className="column levels-column">
                  <span className="crown platinum">👑</span> Platinum Member
                </div>
                <div className="column points-column">501-1500</div>
              </div>
              
              <div className="table-row">
                <div className="column levels-column">
                  <span className="crown diamond">👑</span> Diamond Member
                </div>
                <div className="column points-column">&gt;1500</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MembershipLevels;