import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import InventoryForm from "./InventoryForm";

import InventoryList from "./InaventoryList";

const App = () => {

















  
  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Home
        </Link>
        <Link to="/form">Add Inventory</Link>
      </nav>
      <Routes>
        <Route path="/" element={<InventoryList />} />
        <Route path="/form" element={<InventoryFormWrapper />} />
      </Routes>
    </Router>
  );
};

// Wrapper for InventoryForm to enable navigation after submission
const InventoryFormWrapper = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/"); // Navigate to InventoryList after success
  };

  return <InventoryForm onSuccess={handleSuccess} />;
};

export default App;
