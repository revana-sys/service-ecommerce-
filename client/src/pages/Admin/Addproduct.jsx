import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { Plus, X } from "lucide-react"; // Icons for adding/removing items
import { toast } from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const API_URL = "http://localhost:3002/product"; // Point to API Gateway

  const [formData, setFormData] = useState({
    name: "",
    category: "Summer Collection",
    material: "",
    price: "",
    stock: "",
    colors: [{ name: "", available: true }],
    sizes: [{ name: "", available: true }],
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (index, field, value) => {
    setFormData(prev => {
      const newColors = [...prev.colors];
      newColors[index] = { ...newColors[index], [field]: value };
      return { ...prev, colors: newColors };
    });
  };

  const handleSizeChange = (index, field, value) => {
    setFormData(prev => {
      const newSizes = [...prev.sizes];
      newSizes[index] = { ...newSizes[index], [field]: value };
      return { ...prev, sizes: newSizes };
    });
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: "", available: true }]
    }));
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: "", available: true }]
    }));
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate number of files
    if (files.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: "Maximum 5 images allowed"
      }));
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          images: "Only image files are allowed"
        }));
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors(prev => ({
          ...prev,
          images: "Each image must be less than 5MB"
        }));
        return false;
      }
      return true;
    });

    setImages(validFiles);

    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Clear any existing image errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.images;
      return newErrors;
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]); // Clean up the URL
      return newUrls.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    console.log("Starting form validation...");
    const newErrors = {};

    // Validate name
    if (!formData.name?.trim()) {
      console.log("Name validation failed: empty name");
      newErrors.name = "Product name is required";
    }

    // Validate material
    if (!formData.material?.trim()) {
      console.log("Material validation failed: empty material");
      newErrors.material = "Material is required";
    }

    // Validate price
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      console.log("Price validation failed:", {
        value: formData.price,
        isNaN: isNaN(formData.price),
        isNegative: Number(formData.price) < 0
      });
      newErrors.price = "Valid price is required";
    }

    // Validate stock
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) {
      console.log("Stock validation failed:", {
        value: formData.stock,
        isNaN: isNaN(formData.stock),
        isNegative: Number(formData.stock) < 0
      });
      newErrors.stock = "Valid stock quantity is required";
    }

    // Validate category
    if (!formData.category) {
      console.log("Category validation failed: empty category");
      newErrors.category = "Category is required";
    }

    // Validate colors
    if (!Array.isArray(formData.colors) || formData.colors.length === 0) {
      console.log("Colors validation failed: no colors");
      newErrors.colors = "At least one color is required";
    } else {
      formData.colors.forEach((color, index) => {
        if (!color.name?.trim()) {
          console.log(`Color ${index} validation failed: empty name`);
          newErrors[`color_${index}`] = "Color name is required";
        }
      });
    }

    // Validate sizes
    if (!Array.isArray(formData.sizes) || formData.sizes.length === 0) {
      console.log("Sizes validation failed: no sizes");
      newErrors.sizes = "At least one size is required";
    } else {
      formData.sizes.forEach((size, index) => {
        if (!size.name?.trim()) {
          console.log(`Size ${index} validation failed: empty name`);
          newErrors[`size_${index}`] = "Size name is required";
        }
      });
    }

    // Validate images
    if (images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked");
    setLoading(true);
    setErrors({});

    try {
      if (!validateForm()) {
        throw new Error("Please fix the errors in the form");
      }

      const submitFormData = new FormData();

      // Append basic fields
      submitFormData.append("name", formData.name.trim());
      submitFormData.append("category", formData.category);
      submitFormData.append("material", formData.material.trim());
      submitFormData.append("price", formData.price);
      submitFormData.append("stock", formData.stock);

      // Format colors and sizes as JSON strings
      const colorsJson = JSON.stringify(formData.colors.filter(color => color.name.trim()));
      const sizesJson = JSON.stringify(formData.sizes.filter(size => size.name.trim()));

      submitFormData.append("colors", colorsJson);
      submitFormData.append("sizes", sizesJson);

      // Append all images
      images.forEach((image, index) => {
        submitFormData.append("images", image);
      });

      const response = await axios.post(`${API_URL}/createproduct`, submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 201) {
        toast.success("Product added successfully!");
        // Clear form
        setFormData({
          name: "",
          category: "Summer Collection",
          material: "",
          price: "",
          stock: "",
          colors: [{ name: "", available: true }],
          sizes: [{ name: "", available: true }],
        });
        setImages([]);
        setPreviewUrls([]);
        setErrors({});
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setErrors(serverErrors);
        toast.error(
          <div>
            <p className="font-bold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside">
              {Object.values(serverErrors).map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        toast.error(error.message || "Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Add New Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-black`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-black`}
            >
              <option value="Summer Collection">Summer Collection</option>
              <option value="Winter Collection">Winter Collection</option>
              <option value="Turban Collection">Turban Collection</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material *
            </label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className={`w-full border ${errors.material ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-black`}
            />
            {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-black`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full border ${errors.stock ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-black`}
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Colors Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Colors *
            </label>
            <button
              type="button"
              onClick={addColor}
              className="flex items-center text-sm text-purple-600 hover:text-purple-700 text-black"
            >
              <Plus size={16} className="mr-1" />
              Add Color
            </button>
          </div>
          {errors.colors && <p className="text-red-500 text-sm">{errors.colors}</p>}
          {formData.colors.map((color, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={color.name}
                onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                placeholder="Color name"
                className={`flex-1 border ${errors[`color_${index}`] ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-black`}
              />
              {errors[`color_${index}`] && <p className="text-red-500 text-sm">{errors[`color_${index}`]}</p>}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={color.available}
                  onChange={(e) => handleColorChange(index, 'available', e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-400"
                />
                <span className="text-sm text-gray-600">Available</span>
              </label>
              {formData.colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Sizes Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Sizes *
            </label>
            <button
              type="button"
              onClick={addSize}
              className="flex items-center text-sm text-purple-600 hover:text-purple-700"
            >
              <Plus size={16} className="mr-1" />
              Add Size
            </button>
          </div>
          {errors.sizes && <p className="text-red-500 text-sm">{errors.sizes}</p>}
          {formData.sizes.map((size, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={size.name}
                onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                placeholder="Size name"
                className={`flex-1 border ${errors[`size_${index}`] ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-black`}
              />
              {errors[`size_${index}`] && <p className="text-red-500 text-sm">{errors[`size_${index}`]}</p>}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={size.available}
                  onChange={(e) => handleSizeChange(index, 'available', e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-400"
                />
                <span className="text-sm text-gray-600">Available</span>
              </label>
              {formData.sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload images</span>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB each (max 5 images)
              </p>
            </div>
          </div>
          {errors.images && (
            <p className="mt-2 text-sm text-red-600">{errors.images}</p>
          )}

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-4 rounded-md font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
