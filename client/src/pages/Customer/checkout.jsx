// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext"; // ✅ adjust path if needed

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];
  const { showNotification } = useNotification(); // Use showNotification from context
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    paymentMethod: "cash",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showNotification({ message: "Please login to place an order" });
      navigate("/customer/login");
      return;
    }

    if (cart.length === 0) {
      showNotification({ message: "Your cart is empty" });
      return;
    }

    const orderData = {
      customerInfo: {
        userId: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
      },
      orderItems: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      })),
      totalAmount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification({ message: "Please login to place an order" });
        navigate("/customer/login");
        return;
      }

      await axios.post("http://localhost:4008/api/orders/create", orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear the cart after successful order
      localStorage.removeItem(`cart_${user.email}`);
      
      showNotification({ message: "Order placed successfully!" });
      navigate("/customer/dashboard");
    } catch (err) {
      console.error("Order failed:", err);
      showNotification({ 
        message: err.response?.data?.message || "Failed to place order. Please try again."
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === "cash"}
              onChange={handleChange}
              className="mr-2"
            />
            Cash
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="credit"
              checked={formData.paymentMethod === "credit"}
              onChange={handleChange}
              className="mr-2"
            />
            Credit
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
