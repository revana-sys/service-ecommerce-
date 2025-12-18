import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import { Pencil, Trash2, Eye } from "lucide-react";

const PRODUCT_UPDATED_EVENT = 'productUpdated';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const apiUrl = "http://localhost:3002";

  const categoryMap = {
    summer: "Summer Collection",
    winter: "Winter Collection",
    turban: "Turban Collection",
  };

  const getCategoryFromPath = () => {
    const pathSegment = location.pathname.split("/").pop();
    return categoryMap[pathSegment] || "All";
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(apiUrl + "/product/getallproducts");
      const fetched = res.data?.data || [];

      const processed = fetched.map(product => {
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

      setProducts(processed);
      const category = getCategoryFromPath();
      setFilteredProducts(
        category === "All"
          ? fetched
          : fetched.filter((p) => p.category === category)
      );
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);

  useEffect(() => {
    const handleUpdate = () => fetchProducts();
    window.addEventListener(PRODUCT_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(PRODUCT_UPDATED_EVENT, handleUpdate);
  }, []);

  const handleDelete = (id) => {
    showNotification({
      message: "Are you sure you want to delete this product?",
      type: "confirm",
      onConfirm: async () => {
        try {
          await axios.delete(`${apiUrl}/product/deleteproduct/${id}`);
          fetchProducts();
          showNotification({ message: "Product deleted.", type: "success" });
        } catch (err) {
          showNotification({ message: "Delete failed.", type: "error" });
        }
      },
    });
  };

  const handleAddProduct = () => navigate("/admin/Addproduct");
  const handleView = (id) => navigate(`/product/${id}`);
  const handleEdit = (id) => navigate(`/admin/editproduct/${id}`);

  const adminName = (() => {
    try {
      const admin = JSON.parse(localStorage.getItem("admin"));
      return admin?.name || "Admin";
    } catch {
      return "Admin";
    }
  })();

  const currentCategory = getCategoryFromPath();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 py-10 px-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome, {adminName}
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your products, stock, and details efficiently.
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h2 className="text-3xl font-bold text-gray-800">
            Product Management
          </h2>
          <div className="flex gap-4">
            <button
              onClick={fetchProducts}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
              title="Refresh"
            >
              <svg
                className="h-5 w-5 animate-spin-slow"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 00-8 8H0l3 3 3-3H4a6 6 0 111.757 4.243l1.414 1.414A8 8 0 1010 2z" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleAddProduct}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
              title="Add Product"
            >
              Add New Product
            </button>
          </div>
        </div>

        <section className="bg-white shadow-xl rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">
            {currentCategory === "All"
              ? "All Products"
              : `${currentCategory} Products`}
          </h3>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-indigo-500 h-12 w-12"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredProducts.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  className="bg-white rounded-xl shadow hover:shadow-2xl border transition-transform transform hover:-translate-y-1"
                >
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
                    className="w-full h-44 object-cover rounded-t-xl"
                  />
                  <div className="p-4 space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600"><strong>Category:</strong> {product.category}</p>
                    <p className="text-sm text-gray-600"><strong>Material:</strong> {product.material}</p>
                    <p className="text-sm text-gray-600"><strong>Price:</strong> ${product.price}</p>
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={() => handleView(product._id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Product"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="text-yellow-500 hover:text-yellow-700"
                        title="Edit Product"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No products found in this category.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
