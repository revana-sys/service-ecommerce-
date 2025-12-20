// CartTotalCalculator.jsx
import React, { useContext } from "react";
import { CartContext } from "./CartContext";

const CartTotalCalculator = () => {
  const { cart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="text-right mt-6 font-bold text-indigo-900 text-xl">
      Total: ${total.toFixed(2)}
    </div>
  );
};

export default CartTotalCalculator;
