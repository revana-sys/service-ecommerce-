// client/src/pages/Feedback/WriteFeedback.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WriteFeedback = () => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [product, setProduct] = useState('');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      navigate("/customer/login");
      return;
    }
    setUser(loggedInUser);
    setCustomerName(loggedInUser.name);
    setEmail(loggedInUser.email);
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:4008/products');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit feedback");
      return;
    }

    try {
      await axios.post('http://localhost:4008/feedback/create', {
        customerName,
        email,
        message,
        rating,
        product
      });
      navigate('/feedback/list');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert("Failed to submit feedback");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
        <div className="text-center py-10 text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Write Feedback
      </h2>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate('/feedback/list')}
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-white px-6 py-2 rounded shadow-md"
        >
          Back to Feedbacks
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text" 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)} 
            className="border p-2 w-full rounded bg-gray-50" 
            required 
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="border p-2 w-full rounded bg-gray-50" 
            required 
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          >
            <option value="">Select a product</option>
            {(products || []).map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea 
            placeholder="Write your feedback here..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none" 
            required 
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))} 
              className="w-full"
            />
            <span className="text-yellow-500 text-lg">{'⭐'.repeat(rating)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            type="submit" 
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Submit Feedback
          </button>
          <button 
            type="button"
            onClick={() => navigate('/feedback/list')}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteFeedback;
