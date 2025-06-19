import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import "./styles/App.css";
import Navbar from "./components/Navbar";

// Layout
import AdminLayout from "./components/Inventory/AdminLayout";

// Home
import Home from "./pages/Home";

// Inventory
import AdminDashboard from "./pages/Inventory/AdminDashboard";
import InventoryForm from "./components/Inventory/InventoryForm";
import InventoryList from "./pages/Inventory/InaventoryList";
import InventoryDetailsImage from "./components/Inventory/InventoryDetailsImage";

// Wishlist
import WishlistPage from './components/Inventory/Wishlist';

// Delivery pages
import DeliveryForm from "./pages/Delivery/DeliveryForm";
import OrderConfirmation from "./pages/Delivery/OrderConfirmation";
import PaymentPage from "./pages/Delivery/PaymentPage";
import PaymentConfirmation from "./pages/Delivery/PaymentConfirmation";
import MyOrdersPage from "./pages/Delivery/MyOrdersPage";
import FlowerDeliveryPage from './pages/Delivery/FlowerDeliveryPage';
import AdminDeliveryForm from "./pages/Delivery/AdminDeliveryForm";
import AdminDeliveryTable from "./pages/Delivery/AdminDeliveryTable";
import CityManager from "./pages/Delivery/CityManager";
import AdminPaymentReview from "./pages/Delivery/AdminPaymentReview";

// Profile
import Login from './pages/Profile/Login';
import ResetPassword from './pages/Profile/ResetPassword';
import AccountDetails from './pages/Profile/AccountDetails';
import UserList from "./pages/Profile/UserList";
import AddBanner from "./pages/Profile/AddBanner";

// Loyalty
import Loyalty from './pages/loyalty-point/Loyalty';
import Loyalty1 from './pages/loyalty-point/Loyalty1';

// Review
import ReviewForm from './pages/Review/ReviewForm';

// Customization
import AdminFlowerCustomization from './pages/Customization/AdminFlowerCustomization';
import UserFlowerCustomization from './pages/Customization/UserFlowerCustomization';

// FAQ
import AdminPanel from "./pages/FAQ/AdminPanel";
import CustomerSupport from "./pages/FAQ/CustomerSupport";

// Order
import OrderAdminDashbord from "./pages/Order/OrderAdminDashboard";
import Cart from "./pages/Order/Cart";

const App = () => {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/form" element={<InventoryFormWrapper />} />
        <Route path="/inventory/edit/:id" element={<InventoryForm />} />
        <Route path="/inventory/:id" element={<InventoryDetailsImage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/category/:category" element={<h1>Category Page</h1>} />
        <Route path="/status" element={<MyOrdersPage />} />
        <Route path="/cart" element={<h1>Cart Page</h1>} />
        <Route path="/reviewForm" element={<ReviewForm />} />

        {/* Delivery */}
        <Route path="/deliveryform" element={<DeliveryForm />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/delivery" element={<FlowerDeliveryPage />} />

        {/* Profile */}
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/account-details' element={<AccountDetails />} />
        <Route path="/userlist" element={<UserList />} />

        {/* Loyalty */}
        <Route path='/loyalty' element={<Loyalty />} />
        <Route path='/loyalty1' element={<Loyalty1 />} />

        {/* Customization */}
        <Route path='/UserFlowerCustomization' element={<UserFlowerCustomization />} />

        {/* FAQ */}
        <Route path="/faqhome" element={<CustomerSupport />} />

        {/* Order */}
        <Route path="/orderAdmin" element={<OrderAdminDashbord />} />
        <Route path="/cart1" element={<Cart />} />

        {/* Admin Routes with Persistent Sidebar */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="form" element={<InventoryFormWrapper />} />
          <Route path="delivery" element={<AdminDeliveryForm />} />
          <Route path="admintable" element={<AdminDeliveryTable />} />
          <Route path="city" element={<CityManager />} />
          <Route path="payment" element={<AdminPaymentReview />} />
          <Route path="banner" element={<AddBanner />} />
          <Route path="faq" element={<AdminPanel />} />
          <Route path="customization" element={<AdminFlowerCustomization />} />
        </Route>
      </Routes>
    </>
  );
};

// Wrapper for InventoryForm to enable navigation after submission
const InventoryFormWrapper = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/inventory");
  };

  return <InventoryForm onSuccess={handleSuccess} />;
};

export default App;
