import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import InventoryForm from "./components/InventoryForm";
import InventoryList from "./components/InaventoryList";
import InventoryDetailsImage from "./components/InventoryDetailsImage";
import "./styles/app.css";
import logo from "./images/logo.png";
import profileIcon from "./images/profile.png"; // Add profile icon
import cartIcon from "./images/cart.png"; // Add cart icon
import searchIcon from "./images/search.png";

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Category Dropdown */}
        <div className="dropdown">
          <button className="dropdown-button">Categories</button>
          <div className="dropdown-content">
            <Link to="/category/flowers">Occassion</Link>
            <Link to="/category/plants">Birth Day</Link>
            <Link to="/category/tools">Graduation</Link>
            <Link to="/category/tools">Romance</Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <img src={searchIcon} alt="Search" className="icon search-icon" />
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/form" className="nav-item">
            Add Inventory
          </Link>
          <Link to="/order-status" className="nav-item">
            Order Status
          </Link>
        </div>

        {/* Icons for Cart and Profile */}
        <div className="nav-icons">
          <Link to="/cart">
            <img src={cartIcon} alt="Cart" className="icon cart-icon" />
          </Link>
          <Link to="/profile">
            <img src={profileIcon} alt="Profile" className="icon profile-icon" />
          </Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<InventoryList />} />
        <Route path="/form" element={<InventoryFormWrapper />} />
        <Route path="/inventory/:id" element={<InventoryDetailsImage />} />
        <Route path="/category/:category" element={<h1>Category Page</h1>} />
        <Route path="/order-status" element={<h1>Order Status Page</h1>} />
        <Route path="/cart" element={<h1>Cart Page</h1>} />
        <Route path="/profile" element={<h1>Profile Page</h1>} />
      </Routes>
    </Router>
  );
};

// Wrapper for InventoryForm to enable navigation after submission
const InventoryFormWrapper = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/"); // Navigate to InventoryList after successful form submission
  };

  return <InventoryForm onSuccess={handleSuccess} />;
};

export default App;
