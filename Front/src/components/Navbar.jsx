import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../images/logo.png";
import profileIcon from "../images/profile.png";
import cartIcon from "../images/cart.png";
import searchIcon from "../images/search.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile data when component mounts or when token changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        setUserProfileImage(null);
        setUserName("");
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setIsLoggedIn(true);
        setUserProfileImage(response.data.profileImage);
        setUserName(response.data.name || "");
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // If token is invalid, clear it and reset state
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUserProfileImage(null);
          setUserName("");
        }
      }
    };

    fetchUserProfile();

    // Listen for custom events when profile is updated
    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setUserProfileImage(event.detail.profileImage);
        setUserName(event.detail.name || "");
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserProfileImage(null);
    setUserName("");
    toast.info("You have been signed out");
    navigate("/");
  };

  // Function to get user initials for placeholder when no profile image
  const getUserInitials = () => {
    if (!userName) return "";
    const names = userName.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return userName.charAt(0).toUpperCase();
  };

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
          <span className="clear-icon" onClick={() => setSearchText("")}>
            ×
          </span>
        )}
        <img src={searchIcon} alt="Search" className="icon search-icon" />
      </div>

      

      {/* Nav Links */}
      <div className="nav-links">
        <Link to="/status" className="nav-item">
          Order Status
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/wishlist" className="nav-item">
          My Wishlist
        </Link>
      </div>

      {/* Icons */}
      <div className="nav-icons">
        <div className="cart-wrapper">
          <Link to="/cart1">
            <img src={cartIcon} alt="Cart" className="icon cart-icon" />
          </Link>
        </div>

        <div className="profile-dropdown">
          {/* Dynamic Profile Image/Icon */}
          {isLoggedIn && userProfileImage ? (
            <img 
              src={userProfileImage} 
              alt="Profile" 
              className="icon profile-icon profile-image-navbar" 
            />
          ) : isLoggedIn && userName ? (
            <div className="profile-initials-navbar">
              {getUserInitials()}
            </div>
          ) : (
            <img src={profileIcon} alt="Login" className="icon profile-icon" />
          )}
          
          <div className="dropdown-content right">
            {isLoggedIn ? (
              <>
                <Link to="/account-details">My Profile</Link>
                <button onClick={handleSignOut} className="dropdown-signout-btn">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/">Home</Link>
          <Link to="/status">Order Status</Link>
          <Link to="/cart">Cart</Link>
          {isLoggedIn ? (
            <>
              <Link to="/account-details">My Profile</Link>
              <button onClick={handleSignOut} className="mobile-signout-btn">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;