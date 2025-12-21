import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { useNotification } from "../../context/NotificationContext";
import { CartContext } from "./CartContext";
import { WishlistContext } from "./WishlistContext";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const customerName = user?.name || "Customer";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3002/product/getallproducts");
        console.log('Products response:', JSON.stringify(res.data, null, 2));

        // Check if we have a valid response
        if (!res.data) {
          throw new Error('No data received from server');
        }

        // Handle different possible response structures
        let productsData;
        if (Array.isArray(res.data)) {
          productsData = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          productsData = res.data.data;
        } else if (res.data.products && Array.isArray(res.data.products)) {
          productsData = res.data.products;
        } else {
          throw new Error('Invalid data format received from server');
        }

        // Process each product to ensure consistent image handling
        const processedProducts = productsData.map(product => {
          const imgs = Array.isArray(product.images)
            ? product.images
            : product.image
              ? [product.image]
              : [];

          const normalized = imgs
            .map(img => {
              if (!img) return "";
              if (typeof img === "string") return img;
              if (img.url) return img.url;
              if (img.path) return img.path;
              if (img.filename) return img.filename;
              return "";
            })
            .filter(Boolean);

          return { ...product, images: normalized };
        });

        setProducts(processedProducts);
        // Extract unique categories
        const uniqueCategories = [...new Set(processedProducts.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || "Error loading products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      showNotification({ message: "Please login to add items to cart", type: "error" });
      navigate("/customer/login");
      return;
    }
    addToCart(product);
    showNotification({ message: `${product.name} added to cart`, type: "success" });
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleViewDetails = (productId) => {
    navigate(`/Vproductt/${productId}`);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSortOption("");
    setSelectedCategory('All');
  };

  // Filter products based on search query and price range
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesMinPrice = !minPrice || product.price >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || product.price <= Number(maxPrice);
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'priceLowHigh':
          return a.price - b.price;
        case 'priceHighLow':
          return b.price - a.price;
        case 'nameAZ':
          return a.name.localeCompare(b.name);
        case 'nameZA':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 px-6 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {customerName}!</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-56 text-black"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-32 text-black"
              placeholder="0"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-32 text-black"
              placeholder="1000"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-48 text-black"
            >
              <option value="">None</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAZ">Name: A-Z</option>
              <option value="nameZA">Name: Z-A</option>
            </select>
          </div>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset Filters
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full ${selectedCategory === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Gallery */}
                <div className="relative h-64 bg-gray-100 group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={
                        (() => {
                          const img = product.images?.[0];
                          if (!img) return "/placeholder.png";
                          if (typeof img === 'string' && img.startsWith('http')) return img;
                          const file = String(img).replace(/^\/?uploads\//, '');
                          return `http://localhost:4008/uploads/${file}`;
                        })()
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {/* Wishlist Heart Icon */}
                  <button
                    onClick={(e) => handleToggleWishlist(e, product)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all z-10"
                    title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${isInWishlist(product._id)
                          ? 'fill-indigo-600 text-indigo-600'
                          : 'text-gray-400 hover:text-indigo-600'
                        }`}
                    />
                  </button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleViewDetails(product._id)}
                      className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 hover:scale-110"
                      title="View Details"
                    >
                      <Eye className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 hover:scale-110"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-6 h-6" />
                    </button>
                  </div>
                  {product.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-2 h-2 rounded-full bg-white opacity-75"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <p className="text-xl font-bold text-indigo-600 mb-4">
                    ${product.price?.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
