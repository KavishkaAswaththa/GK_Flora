import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Inventory/WishlistStyles.css'; // ✅ your CSS file

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/wishlist/all', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const itemIds = res.data.map(item => item.itemId);
        const itemDetailsPromises = itemIds.map(id =>
          axios.get(`http://localhost:8080/api/inventory/${id}`)
            .then(res => res.data)
            .catch(() => null)
        );

        const items = await Promise.all(itemDetailsPromises);
        setWishlistItems(items.filter(item => item));
        setLoading(false);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const handleAddToCart = async (itemId) => {
    try {
      await axios.post('http://localhost:8080/api/cart/add', { itemId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Added to cart!');
    } catch (err) {
      console.error('Add to cart failed:', err);
      alert('Failed to add item to cart');
    }
  };


   const handleRemove = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/wishlist/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdded(false);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove from wishlist.");
    }
  };
  
  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/wishlist/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Remove from wishlist failed:', err);
      alert('Failed to remove item');
    }
  };

  if (loading) return <div className="wishlist-container">Loading wishlist...</div>;

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">🌸 My Wishlist 🌸</h2>
      <div className="wishlist-grid">
        {wishlistItems.map(item => (
          <div key={item.id} className="wishlist-card">
            {/* Clickable image and name for navigation */}
            <div
              onClick={() => navigate(`/inventory/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={`data:image/jpeg;base64,${item.images?.[0]?.base64}`}
                alt={item.name}
                width={300}
                height={300}
              />
              <h3>{item.name}</h3>
            </div>

            <p>Rs. {item.price}</p>

            {/* Buttons */}
            <div className="wishlist-buttons">
              <button
                className="btn-add"
                onClick={() => handleAddToCart(item.id)}
              >
                Add to Cart
              </button>
              <button
                className="btn-remove"
                onClick={() => handleRemoveFromWishlist(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
