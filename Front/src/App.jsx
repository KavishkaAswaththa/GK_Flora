import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";


import "./styles/App.css";
import Navbar from "./components/Navbar";


//Inventory
import AdminDashboard from "./pages/Inventory/AdminDashboard";
import InventoryForm from "./components/Inventory/InventoryForm";
import InventoryList from "./pages/Inventory/InaventoryList";
import InventoryDetailsImage from "./components/Inventory/InventoryDetailsImage";



//Review
import ReviewForm from './pages/Review/ReviewForm.jsx';


const App = () => {
  return (
    <Router>
      <Navbar />


      {/* Routes */}
      <Routes>

        
        <Route path="/" element={<InventoryList />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/form" element={<InventoryFormWrapper />} />
        <Route path="/inventory/edit/:id" element={<InventoryForm />} />
        <Route path="/inventory/:id" element={<InventoryDetailsImage />} />
        
        
        <Route path="/category/:category" element={<h1>Category Page</h1>} />
        <Route path="/order-status" element={<h1>Order Status Page</h1>} />
        <Route path="/cart" element={<h1>Cart Page</h1>} />


        <Route path="/reviewForm" element={<ReviewForm />} />

        
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
