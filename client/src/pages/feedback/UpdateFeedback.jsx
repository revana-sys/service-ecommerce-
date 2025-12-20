// src/pages/UpdateFeedback.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [feedback, setFeedback] = useState({
    customerName: '',
    email: '',
    message: '',
    rating: 5,
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/customer/login");
        return;
      }

      const res = await axios.get(`http://localhost:3002/feedback/${id}`);

      // Check if the feedback belongs to the current user
      const userId = user.id || user.email;
      if (res.data.userId !== userId && res.data.email !== user.email) {
        setError("You can only edit your own feedbacks");
        return;
      }

      // Convert new format to old format for the form
      setFeedback({
        customerName: res.data.customerName || user.name || '',
        email: res.data.email || user.email || '',
        message: res.data.comment || res.data.message || '',
        rating: res.data.rating || 5,
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to fetch feedback.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/customer/login");
        return;
      }

      // Verify the feedback still belongs to the current user
      if (feedback.email !== user.email) {
        setError("You can only edit your own feedbacks");
        return;
      }

      // Convert form data to new API format
      const updateData = {
        userId: user.id || user.email,
        comment: feedback.message,
        rating: feedback.rating
      };

      await axios.put(`http://localhost:3002/feedback/${id}`, updateData);
      navigate('/feedback/list');
    } catch (error) {
      console.error("Error updating feedback:", error);
      setError("Failed to update feedback");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading feedback...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={() => navigate('/feedback/list')}
          className="mt-4 bg-indigo-600 text-black px-4 py-2 rounded hover:bg-indigo-700"
        >
          Back to Feedback List
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4 text-center text-black">Edit Feedback</h2>
      <form onSubmit={handleUpdate} className="space-y-3">
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={feedback.customerName}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={feedback.email}
          onChange={handleChange}
          className="border p-2 w-full"
          required
          disabled
        />
        <textarea
          name="message"
          placeholder="Message"
          value={feedback.message}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="rating"
          min="1"
          max="5"
          value={feedback.rating}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700">
            Update Feedback
          </button>
          <button
            type="button"
            onClick={() => navigate('/feedback/list')}
            className="flex-1 bg-gray-600 text-black px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFeedback;
