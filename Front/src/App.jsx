import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import "./styles/App.css";
import Navbar from "./components/Navbar";


import Home from "./pages/Home";

//Inventory
import AdminDashboard from "./pages/Inventory/AdminDashboard";
import InventoryForm from "./components/Inventory/InventoryForm";
import InventoryList from "./pages/Inventory/InaventoryList";
import InventoryDetailsImage from "./components/Inventory/InventoryDetailsImage";
//delivery pages
import DeliveryForm from "./pages/Delivery/DeliveryForm";
import OrderConfirmation from "./pages/Delivery/OrderConfirmation";
import PaymentPage from "./pages/Delivery/PaymentPage";
import PaymentConfirmation from "./pages/Delivery/PaymentConfirmation";
import MyOrdersPage from "./pages/Delivery/MyOrdersPage"; 
import FlowerDeliveryPage from './pages/Delivery/FlowerDeliveryPage';
import AdminDeliveryForm from "./pages/Delivery/AdminDeliveryForm";
import AdminDeliveryTable from "./pages/Delivery/AdminDeliveryTable";


//Profile
import Login from './pages/Profile/Login';
import ResetPassword from './pages/Profile/ResetPassword';
import AccountDetails from './pages/Profile/AccountDetails';



//Loyalty-points
import Loyalty from './pages/loyalty-point/Loyalty.jsx';
import Loyalty1 from './pages/loyalty-point/Loyalty1.jsx';


//Review
import ReviewForm from './pages/Review/ReviewForm.jsx';

//Customization
import FlowerCustomization from './pages/Customization/FlowerCustomization.jsx';



const App = () => {
  return (
    <>
      <Navbar />


      {/* Routes */}
      <ToastContainer/>
      <Routes>

        
        <Route path="/" element={<Home />} />

        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/form" element={<InventoryFormWrapper />} />
        <Route path="/inventory/edit/:id" element={<InventoryForm />} />
        <Route path="/inventory/:id" element={<InventoryDetailsImage />} />
        
        
        <Route path="/category/:category" element={<h1>Category Page</h1>} />
        <Route path="/status" element={<MyOrdersPage />} />
        
        <Route path="/cart" element={<h1>Cart Page</h1>} />


        <Route path="/reviewForm" element={<ReviewForm />} />

        {/*delivery*/} 
        <Route path="/deliveryform" element={<DeliveryForm />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/status" element={<MyOrdersPage />} />
        <Route path="/delivery" element={<FlowerDeliveryPage />} />
        <Route path="/admin" element={<AdminDeliveryForm />} />
        <Route path="/admintable" element={<AdminDeliveryTable />} />
        <Route path="/admintable" element={<AdminDeliveryTable />} />
       
        

        
        <Route path='/login' element={<Login/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/account-details' element={<AccountDetails/>}/>



        
        <Route path='/loyalty' element={<Loyalty/>}/>
        <Route path='/loyalty1' element={<Loyalty1/>}/>

        {/*Customization*/}
        <Route path='/FlowerCustomization' element={<FlowerCustomization/>}/>

        
      </Routes>
    </>
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
