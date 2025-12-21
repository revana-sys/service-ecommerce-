// WishlistContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [wishlistProductIds, setWishlistProductIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    const API_URL = "http://localhost:3002/api/wishlist";
    const PRODUCT_API_URL = "http://localhost:4008/api/product";

    // Get userId from localStorage
    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?._id || user?.id || null;
    };

    // Load wishlist on mount
    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        const userId = getUserId();
        if (!userId) {
            setWishlist([]);
            setWishlistProductIds(new Set());
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/${userId}`);
            const productIds = response.data || [];

            // Fetch full product details for each productId
            const productPromises = productIds.map(async (productId) => {
                try {
                    const productRes = await axios.get(`${PRODUCT_API_URL}/${productId}`);
                    return productRes.data;
                } catch (error) {
                    console.error(`Failed to fetch product ${productId}:`, error);
                    return null;
                }
            });

            const products = (await Promise.all(productPromises)).filter(Boolean);
            setWishlist(products);
            setWishlistProductIds(new Set(productIds));
        } catch (error) {
            console.error("Error loading wishlist:", error);
            setWishlist([]);
            setWishlistProductIds(new Set());
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product) => {
        const userId = getUserId();
        if (!userId) {
            toast.error("Please login to add items to wishlist");
            return;
        }

        try {
            await axios.post(`${API_URL}/add`, {
                userId,
                productId: product._id,
            });

            setWishlist([...wishlist, product]);
            setWishlistProductIds(new Set([...wishlistProductIds, product._id]));
            toast.success("Added to wishlist!");
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        const userId = getUserId();
        if (!userId) return;

        try {
            await axios.delete(`${API_URL}/remove`, {
                data: { userId, productId },
            });

            setWishlist(wishlist.filter((item) => item._id !== productId));
            const newSet = new Set(wishlistProductIds);
            newSet.delete(productId);
            setWishlistProductIds(newSet);
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove from wishlist");
        }
    };

    const clearWishlist = async () => {
        const userId = getUserId();
        if (!userId) return;

        if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
            try {
                await axios.delete(`${API_URL}/clear/${userId}`);
                setWishlist([]);
                setWishlistProductIds(new Set());
                toast.success("Wishlist cleared");
            } catch (error) {
                console.error("Error clearing wishlist:", error);
                toast.error("Failed to clear wishlist");
            }
        }
    };

    const isInWishlist = (productId) => {
        return wishlistProductIds.has(productId);
    };

    const toggleWishlist = async (product) => {
        if (isInWishlist(product._id)) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                clearWishlist,
                isInWishlist,
                toggleWishlist,
                loading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistProvider;
