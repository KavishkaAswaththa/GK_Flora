import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../images/logo.png";
import profileIcon from "../images/profile.png";
import cartIcon from "../images/cart.png";
import searchIcon from "../images/search.png";

const Navbar = () => {
  return (
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
        <Link to="/login">
          <img src={profileIcon} alt="Login" className="icon profile-icon" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
