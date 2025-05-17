import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../images/logo.png";
import profileIcon from "../images/profile.png";
import cartIcon from "../images/cart.png";
import searchIcon from "../images/search.png";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logoo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
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
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {searchText && (
          <span className="clear-icon" onClick={() => setSearchText("")}>×</span>
        )}
        <img src={searchIcon} alt="Search" className="icon search-icon" />
      </div>

      {/* Nav Links */}
      <div className="nav-links">
        <Link to="/status" className="nav-item">Order Status</Link>
      </div>

      {/* Icons */}
      <div className="nav-icons">
        <div className="cart-wrapper">
          <Link to="/cart">
            <img src={cartIcon} alt="Cart" className="icon cart-icon" />
            <span className="cart-badge">2</span>
          </Link>
        </div>

        <div className="profile-dropdown">
          <img src={profileIcon} alt="Login" className="icon profile-icon" />
          <div className="dropdown-content right">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="//account-details">My Profile</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/">Home</Link>
          <Link to="/status">Order Status</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
