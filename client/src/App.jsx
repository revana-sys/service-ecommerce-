// App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Public Pages
import { Home, About, Login } from "./pages";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import Addproduct from "./pages/Admin/Addproduct";
import EditProduct from "./pages/Admin/editproduct";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Vproduct from "./pages/Vproduct";
import Vproductt from "./pages/Vproductt";
import Feedbacks from "./pages/Admin/feedbacks";
import Orders from "./pages/Admin/orders";

// Feedback Pages
import WriteFeedback from "./pages/feedback/WriteFeedback";
import FeedbackList from "./pages/feedback/FeedbackList";
import UpdateFeedback from "./pages/feedback/UpdateFeedback";
import FeedbackCreate from "./pages/FeedbackCreate";

// Customer Pages
import CustomerLogin from "./pages/Customer/CustomerLogin";
import CustomerSignup from "./pages/Customer/CustomerSignup";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CartPage from "./pages/Customer/CartPage";
import Checkout from "./pages/Customer/checkout";
import Myorders from "./pages/Customer/myorders";

// CRUD Pages
import { Page, Update } from "./crud";

// Context Providers
import { CartProvider } from "./pages/Customer/CartContext";
import { NotificationProvider } from "./context/NotificationContext";

import AllProducts from './pages/Admin/Products/AllProducts';
import SummerProducts from './pages/Admin/Products/SummerProducts';
import WinterProducts from './pages/Admin/Products/WinterProducts';
import TurbanProducts from './pages/Admin/Products/TurbanProducts';
import Sidebar from "./components/Sidebar";
import Navigation from "./components/layout/Navigation";

const App = () => {
  return (
    <NotificationProvider>
      <CartProvider>
        <Routes>
          {/* Public Routes with Navigation Bar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/signup" element={<CustomerSignup />} />
            <Route path="/product/:id" element={<Vproduct />} />
            <Route path="/Vproductt/:id" element={<Vproductt />} />
          </Route>

          {/* Admin Routes with Navigation Bar and Sidebar */}
          <Route path="/admin/*" element={
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <div className="flex">
                <Sidebar isAdmin={true} />
                <div className="ml-64 flex-1">
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/Addproduct" element={<Addproduct />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/feedbacks" element={<Feedbacks />} />
                    <Route path="/editproduct/:id" element={<EditProduct />} />
                    <Route path="/products" element={<AllProducts />} />
                    <Route path="/products/summer" element={<SummerProducts />} />
                    <Route path="/products/winter" element={<WinterProducts />} />
                    <Route path="/products/turban" element={<TurbanProducts />} />
                  </Routes>
                </div>
              </div>
            </div>
          } />

          {/* Customer Routes with Navigation Bar and Sidebar */}
          <Route path="/customer/*" element={
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <div className="flex">
                <Sidebar isAdmin={false} />
                <div className="ml-64 flex-1">
                  <Routes>
                    <Route path="/dashboard" element={<CustomerDashboard />} />
                    <Route path="/CartPage" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/myorders" element={<Myorders />} />
                    <Route path="/products" element={<AllProducts />} />
                    <Route path="/products/summer" element={<SummerProducts />} />
                    <Route path="/products/winter" element={<WinterProducts />} />
                    <Route path="/products/turban" element={<TurbanProducts />} />
                  </Routes>
                </div>
              </div>
            </div>
          } />

          {/* Feedback Routes with Navigation Bar and Sidebar */}
          <Route path="/feedback/*" element={
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <div className="flex">
                <Sidebar isAdmin={false} />
                <div className="ml-64 flex-1">
                  <Routes>
                    <Route path="/list" element={<FeedbackList />} />
                    <Route path="/write" element={<WriteFeedback />} />
                    <Route path="/edit/:id" element={<UpdateFeedback />} />
                    <Route path="/create" element={<FeedbackCreate />} />
                  </Routes>
                </div>
              </div>
            </div>
          } />

          {/* CRUD Routes */}
          <Route path="/update/:id" element={<Update />} />
          <Route path="/page" element={<Page />} />
          <Route path="/app" element={<Page />} />
        </Routes>
      </CartProvider>
    </NotificationProvider>
  );
};

export default App;
