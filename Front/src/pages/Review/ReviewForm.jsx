import React, { useState } from "react";
import "../../styles/Review/ReviewForm.css";
import starIcon from "../../images/star.jpg";
import filledStarIcon from "../../images/filled-star.png";

function App() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleStarHover = (index) => {
    setHoveredRating(index);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div className="review-form-container">
      <h2>Add Rating</h2>
      <div className="divider"></div>

      <div className="rating-section">
        <p>Select rating</p>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((index) => (
            <img
              key={index}
              src={(hoveredRating || rating) >= index ? filledStarIcon : starIcon}
              alt={`Star ${index}`}
              className="star-icon"
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleStarHover(index)}
              onMouseLeave={handleStarLeave}
            />
          ))}
        </div>
      </div>

      <div className="divider"></div>

      <div className="form-group">
        <label htmlFor="itemCode">Item Code</label>
        <input type="text" id="itemCode" />
      </div>

      <div className="form-group">
        <label htmlFor="comment">Add Comment</label>
        <input type="text" id="comment" />
      </div>

      <div className="form-group">
        <label htmlFor="username">User Name</label>
        <input type="text" id="username" />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />
      </div>

      <button className="submit-btn">Add Review</button>
    </div>
  );
}

export default App;
