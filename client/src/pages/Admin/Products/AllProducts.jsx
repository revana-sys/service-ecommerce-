import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../../context/NotificationContext";
import { Pencil, Trash2, Eye } from "lucide-react";

const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const apiUrl = "http://localhost:3002/product/getallproducts";

  useEffect(() => {
    viewProducts();
  }, []);

  const viewProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(apiUrl);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    showNotification({
      message: "Are you sure you want to delete this product?",
      type: "confirm",
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:3002/product/deleteproduct/${id}`);
          viewProducts();
        } catch (err) {
          showNotification({
            message: "Failed to delete product. Please try again.",
            type: "error",
          });
        }
      },
    });
  };

  const handleView = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddProduct = () => {
    navigate("/admin/Addproduct");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">All Products</h2>
        <div className="flex gap-4">
          <button
            onClick={viewProducts}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleAddProduct}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Add New Product
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : products.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : ''}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">${product.price}</p>
                <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleView(product._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default AllProducts; 