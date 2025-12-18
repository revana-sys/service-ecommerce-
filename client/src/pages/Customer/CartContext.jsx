// CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNotification } from "../../context/NotificationContext"; // ✅ adjust path if needed

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { showNotification } = useNotification(); // Use showNotification from context

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setCart([]);
      return;
    }
    const savedCart = localStorage.getItem(`cart_${user.email}`);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  const updateLocalStorage = (updatedCart) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    updateLocalStorage(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    updateLocalStorage(updatedCart);
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateLocalStorage(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    updateLocalStorage(updatedCart);
  };

  const clearCart = () => {
    showNotification({
      type: "confirm", // must be handled in your NotificationContext
      message: "Are you sure you want to clear your cart?",
      onConfirm: () => updateLocalStorage([]),
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        updateLocalStorage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
