// imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import { Plus, X } from "lucide-react"; // Icons
import { toast } from "react-hot-toast";

// constants
const PRODUCT_UPDATED_EVENT = 'productUpdated';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [productData, setProductData] = useState({
    name: "",
    material: "",
    price: "",
    stock: "",
    colors: [{ name: "", available: true }],
    sizes: [{ name: "", available: true }],
    category: "Summer Collection",
    images: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/product/getproduct/${id}`);
        console.log('Fetched product:', res.data);

        if (res.data) {
          const prod = res.data;
          setProductData({
            name: prod.name || "",
            material: prod.material || "",
            price: prod.price || "",
            stock: prod.stock || "",
            colors: Array.isArray(prod.colors) ? prod.colors : [{ name: "", available: true }],
            sizes: Array.isArray(prod.sizes) ? prod.sizes : [{ name: "", available: true }],
            category: prod.category || "Summer Collection",
            images: prod.images || []
          });
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (index, field, value) => {
    const updated = [...productData.colors];
    updated[index][field] = field === "available" ? value === "true" : value;
    setProductData({ ...productData, colors: updated });
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...productData.sizes];
    updated[index][field] = field === "available" ? value === "true" : value;
    setProductData({ ...productData, sizes: updated });
  };

  const addColor = () => {
    setProductData((prev) => ({ ...prev, colors: [...prev.colors, { name: "", available: true }] }));
  };

  const removeColor = (index) => {
    const updated = [...productData.colors];
    updated.splice(index, 1);
    setProductData((prev) => ({ ...prev, colors: updated }));
  };

  const addSize = () => {
    setProductData((prev) => ({ ...prev, sizes: [...prev.sizes, { name: "", available: true }] }));
  };

  const removeSize = (index) => {
    const updated = [...productData.sizes];
    updated.splice(index, 1);
    setProductData((prev) => ({ ...prev, sizes: updated }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productData.name?.trim()) newErrors.name = "Product name is required";
    if (!productData.material?.trim()) newErrors.material = "Material is required";
    if (!productData.price || isNaN(productData.price)) newErrors.price = "Valid price required";
    if (!productData.stock || isNaN(productData.stock)) newErrors.stock = "Valid stock required";

    productData.colors.forEach((color, idx) => {
      if (!color.name?.trim()) newErrors[`color_${idx}`] = "Color name is required";
    });

    productData.sizes.forEach((size, idx) => {
      if (!size.name?.trim()) newErrors[`size_${idx}`] = "Size name is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Fix validation errors first");

    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("material", productData.material);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category);

      // Handle colors
      formData.append("colors", JSON.stringify(productData.colors));

      // Handle sizes
      formData.append("sizes", JSON.stringify(productData.sizes));

      const res = await axios.put(`http://localhost:3002/product/updateproduct/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Product updated successfully!");
        window.dispatchEvent(new CustomEvent(PRODUCT_UPDATED_EVENT));
        navigate("/admin/dashboard");
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error(err.response?.data?.message || "Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10 border border-gray-200">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="Summer Collection">Summer Collection</option>
              <option value="Winter Collection">Winter Collection</option>
              <option value="Turban Collection">Turban Collection</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Material *</label>
            <input
              type="text"
              name="material"
              value={productData.material}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Price *</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Stock *</label>
            <input
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
        </div>



        {/* Colors */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">Colors</label>
          {productData.colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={color.name}
                onChange={(e) => handleColorChange(index, "name", e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                placeholder="Color name"
              />
              <select
                value={color.available ? "true" : "false"}
                onChange={(e) => handleColorChange(index, "available", e.target.value)}
                className="border border-gray-300 p-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
              <button type="button" onClick={() => removeColor(index)} className="text-red-500 hover:text-red-700">
                <X size={20} />
              </button>
              {errors[`color_${index}`] && (
                <p className="text-red-500 text-sm">{errors[`color_${index}`]}</p>
              )}
            </div>
          ))}
          <button type="button" onClick={addColor} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 mt-2 font-medium">
            <Plus size={16} /> Add Color
          </button>
        </div>

        {/* Sizes */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">Sizes</label>
          {productData.sizes.map((size, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={size.name}
                onChange={(e) => handleSizeChange(index, "name", e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                placeholder="Size name"
              />
              <select
                value={size.available ? "true" : "false"}
                onChange={(e) => handleSizeChange(index, "available", e.target.value)}
                className="border border-gray-300 p-2 rounded-md text-gray-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
              <button type="button" onClick={() => removeSize(index)} className="text-red-500 hover:text-red-700">
                <X size={20} />
              </button>
              {errors[`size_${index}`] && (
                <p className="text-red-500 text-sm">{errors[`size_${index}`]}</p>
              )}
            </div>
          ))}
          <button type="button" onClick={addSize} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 mt-2 font-medium">
            <Plus size={16} /> Add Size
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
