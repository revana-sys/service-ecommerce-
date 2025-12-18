import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const FeedbackCreate = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const productId = queryParams.get("productId");


  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post("http://localhost:3002/feedback", {
        userId: user.id || user.email,
        productId,
        rating: 5, // Default rating, you can add a rating input
        comment: feedback,
      });

      setSuccess(true);
      setFeedback("");

      // Redirect to feedback list page after successful submit:
      navigate('/feedback/list');
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Write Feedback for Order {orderId}</h2>
      {success && <p className="text-green-600 text-center mb-4">Feedback submitted!</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border border-gray-300 rounded"
          rows="5"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here..."
          required
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackCreate;
