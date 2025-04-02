import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import InventoryForm from "./components/InventoryForm";
import InventoryList from "./components/InaventoryList";
import InventoryDetailsImage from "./components/InventoryDetailsImage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserDetails from "./components/UserDetails";
import "./styles/app.css";
import logo from "./images/logo.png";
import profileIcon from "./images/profile.png"; // Add profile icon
import cartIcon from "./images/cart.png"; // Add cart icon
import searchIcon from "./images/search.png";

import DeliveryForm from "./components/DeliveryForm";
import OrderConfirmation from "./components/OrderConfirmation";
import PaymentPage from "./components/PaymentPage";
import PaymentConfirmation from "./components/PaymentConfirmation";
import MyOrdersPage from "./components/MyOrdersPage"; 
import MyOrderPage1 from "./components/MyOrderPage1";
import MyOrderPage2 from "./components/MyOrderPage2";
import FlowerDeliveryPage from './components/FlowerDeliveryPage';
import AdminDeliveryForm from "./components/AdminDeliveryForm";
import AdminDeliveryTable from "./components/AdminDeliveryTable";



import CustomerDeliveryForm from "./pages/CustomerDeliveryForm";
import CustomerDeliveryTable from "./pages/CustomerDeliveryTable";
import Delivery from "./pages/Delivery";
import AdminDeliveryForm from "./pages/AdminDeliveryForm";
import AdminDeliveryTable from "./pages/AdminDeliveryTable";
import DeliveryPerson from "./pages/DeliveryPerson";
import AdminDashboard from "./pages/AdminDashboard";


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
          <Link to="/to-be-delivery" className="nav-item">
            Order Status
          </Link>
          
        </div>

        {/* Icons for Cart and Profile */}
        <div className="nav-icons">
          <Link to="/cart">
            <img src={cartIcon} alt="Cart" className="icon cart-icon" />
          </Link>
          <Link to="/Login">
            <img src={profileIcon} alt="Login" className="icon profile-icon" />
        </Link>

        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<InventoryList />} />
       
        <Route path="/form" element={<InventoryFormWrapper />} />
        <Route path="/inventory/edit/:id" element={<InventoryForm />} />
        <Route path="/inventory/:id" element={<InventoryDetailsImage />} />
        <Route path="/category/:category" element={<h1>Category Page</h1>} />
        <Route path="/order-status" element={<h1>Order Status Page</h1>} />
        <Route path="/cart" element={<h1>Cart Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userdetails" element={<UserDetails />} />

        <Route path="/deliveryform" element={<DeliveryForm />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/status" element={<MyOrdersPage />} />
        <Route path="/to-be-delivery" element={<MyOrderPage1 />} />
        <Route path="/shipped" element={<MyOrderPage2 />} />
        <Route path="/delivery" element={<FlowerDeliveryPage />} />
        <Route path = "/admin" element={<AdminDeliveryForm/>}/>
        <Route path = "/Admintable" element={<AdminDeliveryTable/>}/>

        <Route path="/admindashboard" element={<AdminDashboard />} />

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
