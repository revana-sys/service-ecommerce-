// WishlistPage.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaShoppingCart } from "react-icons/fa";
import { WishlistContext } from "./WishlistContext";
import { CartContext } from "./CartContext";

const WishlistPage = () => {
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist, clearWishlist, loading } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handleViewDetails = (productId) => {
        navigate(`/productt/${productId}`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-wide">
                My Wishlist
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

            {loading ? (
                <p className="text-center text-gray-500 text-lg mt-20">Loading wishlist...</p>
            ) : wishlist.length === 0 ? (
                <div className="text-center mt-20">
                    <p className="text-gray-500 text-lg mb-4">Your wishlist is empty.</p>
                    <button
                        onClick={() => navigate("/customer/dashboard")}
                        className="bg-indigo-700 hover:bg-indigo-900 text-white px-6 py-3 rounded transition"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                            <div
                                key={item._id}
                                className="border border-indigo-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-indigo-50"
                            >
                                {/* Product Image */}
                                <div className="w-full h-48 mb-4">
                                    <img
                                        src={`http://localhost:4008/uploads/${item.images && item.images.length > 0 ? item.images[0] : 'placeholder.jpg'}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200';
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <h3 className="text-xl font-semibold text-indigo-900 mb-2">{item.name}</h3>
                                <p className="text-indigo-700 mb-2 font-bold">${item.price?.toFixed(2)}</p>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => handleViewDetails(item._id)}
                                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                                        title="View Details"
                                    >
                                        <FaEye size={18} />
                                        <span className="text-sm">View</span>
                                    </button>

                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded transition text-sm"
                                    >
                                        <FaShoppingCart size={16} />
                                        Add to Cart
                                    </button>

                                    <button
                                        onClick={() => removeFromWishlist(item._id)}
                                        className="text-red-600 hover:text-red-800 font-semibold transition text-sm"
                                        aria-label={`Remove ${item.name} from wishlist`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Clear All Button */}
                    <div className="flex justify-end mt-8">
                        <button
                            onClick={clearWishlist}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
