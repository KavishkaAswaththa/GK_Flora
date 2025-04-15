import React from 'react';
import '../../styles/loyalty-point/loyalty2.css';
import { ShoppingCart, Users, Trophy, Ticket, Cake, Calendar } from 'lucide-react';

function Loyalty2() {
  return (
    <div className="app loyalty2-page">
      <main className="content">
        <div className="loyalty-section">
          <h2 className="section-title">1. New Ways to Collect Points</h2>

          <div className="points-option">
            <div className="icon-container shopping">
              <ShoppingCart size={24} />
            </div>
            <span className="option-text">Shopping points</span>
          </div>

          <div className="points-option">
            <div className="icon-container fan">
              <Users size={24} />
            </div>
            <span className="option-text">Fan points</span>
          </div>

          <div className="points-option">
            <div className="icon-container bonus">
              <Trophy size={24} />
            </div>
            <span className="option-text">Bonus points</span>
          </div>

          <h2 className="section-title">2. New Ways to Earn Rewards</h2>

          <div className="points-option">
            <div className="icon-container coupon">
              <Ticket size={24} />
            </div>
            <span className="option-text">Level-Up Coupons</span>
          </div>

          <div className="points-option">
            <div className="icon-container birthday">
              <Cake size={24} />
            </div>
            <span className="option-text">Birthday rewards</span>
          </div>

          <div className="points-option">
            <div className="icon-container anniversary">
              <Calendar size={24} />
            </div>
            <span className="option-text">Anniversary rewards</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Loyalty2;
