import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { CartContext } from "./Customer/CartContext";
import "./Vproduct.css";

const Vproductt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { showNotification } = useNotification();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4008/products/${id}`);
        const productData = res.data;
        const processedProduct = {
          ...productData,
          images: Array.isArray(productData.images) ? productData.images : productData.image ? [productData.image] : []
        };
        setProduct(processedProduct);
        setSelectedImage(processedProduct.images[0] || "");
      } catch (err) {
        setError("Error loading product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedColor) {
      showNotification({ message: 'Please select a color', type: 'error' });
      return;
    }
    if (!selectedSize) {
      showNotification({ message: 'Please select a size', type: 'error' });
      return;
    }

    addToCart({
      ...product,
      selectedColor,
      selectedSize,
      quantity: 1
    });
    showNotification({ message: 'Added to cart!' });
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="loader"></div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="text-red-600 text-xl">{error || "Product not found"}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Left: Product Images */}
          <div className="relative">
            <div className="h-[400px] md:h-[500px] bg-gray-100 rounded-lg overflow-hidden group relative">
              <img src={selectedImage} alt={product.name} className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105" />
              {product.images.length > 1 && (
                <>
                  <button onClick={() => {
                    const i = product.images.indexOf(selectedImage);
                    setSelectedImage(product.images[(i - 1 + product.images.length) % product.images.length]);
                  }} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-110 transition">
                    <ArrowLeft />
                  </button>
                  <button onClick={() => {
                    const i = product.images.indexOf(selectedImage);
                    setSelectedImage(product.images[(i + 1) % product.images.length]);
                  }} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-110 transition">
                    <ArrowRight />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-lg border cursor-pointer object-cover transition-transform duration-200 ${selectedImage === img ? 'border-indigo-600 scale-105' : 'border-gray-200 hover:scale-105'}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-sm text-gray-500 capitalize">{product.category}</p>

            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-indigo-600">${product.price}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-800">Material</h4>
                <p className="text-gray-600">{product.material}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Category</h4>
                <p className="text-gray-600">{product.category}</p>
              </div>
            </div>

            
          {/* Colors */}
{product.colors && product.colors.length > 0 && (
  <div>
    <h4 className="font-medium mb-2">Colors</h4>
    <div className="flex flex-wrap gap-2">
      {product.colors.map((color, idx) => {
        const colorName = typeof color === "object" ? color.name : color;
        return (
          <button
            key={idx}
            onClick={() => setSelectedColor(color)}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition
              ${selectedColor === color
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}`}
          >
            {colorName}
          </button>
        );
      })}
    </div>
  </div>
)}


            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Sizes</h4>
                <div className="flex gap-2">
                  {product.sizes.map((size, idx) => {
                    const sizeValue = typeof size === "object" ? size.name : size;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 rounded-full border text-sm font-medium transition ${selectedSize === size ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {sizeValue}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedColor || !selectedSize || product.stock < 1}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vproductt;
