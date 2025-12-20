// CartPage.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { CartContext } from "./CartContext";
import CartTotalCalculator from "./CartTotalCalculator";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useContext(CartContext);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate("/customer/checkout", { state: { cart } });
  };

  const handleViewDetails = (productId) => {
    navigate(`/productt/${productId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-wide">
        Your Cart
      </h2>

      <button
        onClick={() => navigate("/customer/dashboard")}
        className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Continue Shopping
      </button>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-start border border-indigo-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-indigo-50"
            >
              <div className="flex-1 w-full">
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={`http://localhost:4008/uploads/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-indigo-900">{item.name}</h3>
                        <p className="text-indigo-700 mt-1">Price: ${item.price.toFixed(2)}</p>
                        
                        {/* Selected Color and Size */}
                        {item.selectedColor && (
                          <p className="text-sm text-gray-600 mt-1">
                            Color: <span className="font-medium">{item.selectedColor.name}</span>
                          </p>
                        )}
                        {item.selectedSize && (
                          <p className="text-sm text-gray-600 mt-1">
                            Size: <span className="font-medium">{item.selectedSize.name}</span>
                          </p>
                        )}

                        <div className="flex items-center mt-3 space-x-3">
                          <button
                            onClick={() => decreaseQuantity(item._id)}
                            className="w-9 h-9 flex justify-center items-center bg-indigo-200 rounded-md text-indigo-800 hover:bg-indigo-300 transition"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="text-lg font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item._id)}
                            className="w-9 h-9 flex justify-center items-center bg-indigo-200 rounded-md text-indigo-800 hover:bg-indigo-300 transition"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 ml-4">
                        <button
                          onClick={() => handleViewDetails(item._id)}
                          className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                          title="View Details"
                        >
                          <FaEye size={20} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-600 hover:text-red-800 font-semibold transition"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <CartTotalCalculator />

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={clearCart}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded transition"
            >
              Clear Cart
            </button>

            <button
              onClick={handleCheckout}
              className="bg-indigo-700 hover:bg-indigo-900 text-white px-5 py-2 rounded transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
