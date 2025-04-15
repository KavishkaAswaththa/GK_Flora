// File: App.jsx
import { useState } from 'react';
import '../../styles/review1/review2.css';
import starFilled from '../../images/filled-star.png';
import starEmpty from '../../images/star.jpg';
import { FaChevronRight } from 'react-icons/fa';

function App() {
  const [searchText, setSearchText] = useState('');

  const reviews = [
    {
      name: "Heather J",
      verified: true,
      condition: "Back Pain",
      rating: 5,
      title: "Very pleased",
      description: "We are very happy with our new Leesa mattress. It's a huge improvement over our old one and we are both sleeping better and have less back pain."
    },
    {
      name: "Kimberly D",
      verified: true,
      condition: "Back Pain",
      rating: 5,
      title: "Didn't realize how bad my old mattress was...",
      description: "My husband and I are now sleeping more soundly, and I rotate between sleeping on my back and side. I have less back pain, and I'm actually sleeping cooler on this mattress than I did on my standard inner-spring."
    },
    {
      name: "Louis D",
      verified: true,
      condition: "Back Pain",
      rating: 5,
      title: "Amazing mattress",
      description: "I used to suffer from lower back pain. After getting my new Leesa Mattress, the pain was gone in a couple days!"
    },
    {
      name: "Karen K",
      verified: true,
      condition: "Back Pain",
      rating: 5,
      title: "Most comfortable mattress I've ever owned",
      description: "I used to wake up in the morning 'triggered' by the mattress. I can finally sleep on my back again without causing low back pain."
    }
  ];

  return (
    <div className="review-app">
      <main>
        <section className="review-my-review">
          <h2>My Review</h2>
          <div className="review-rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <img
                key={star}
                src={star <= 3 ? starFilled : starEmpty}
                alt={star <= 3 ? "Filled Star" : "Empty Star"}
                className="review-my-review-star"
              />
            ))}
          </div>
          <div className="review-content">
            <p>Thank you G.K creations for your kindly, friendly, super quick and quality service...</p>
            <p>Keep it up & Highly Recommended...!!!</p>
          </div>
          <div className="review-actions">
            <button className="review-edit-btn">Edit</button>
            <button className="review-delete-btn">Delete</button>
          </div>
        </section>

        <div className="review-divider"></div>

        <section className="review-section">
          <h2>Reviews</h2>
          <div className="review-container">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.name}</span>
                  {review.verified && <span className="verified-badge">✓</span>}
                </div>
                <div className="review-condition">{review.condition}</div>
                <div className="review-star-row">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="review-star">
                      {i < review.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <h3 className="review-title">{review.title}</h3>
                <p className="review-description">{review.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
