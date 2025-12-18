import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiUrl = "http://localhost:3002/feedback";

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(apiUrl);
        setFeedbacks(res.data || []);
      } catch (err) {
        setError(err.message || "Error fetching feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading feedbacks...</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-semibold">Error: {error}</div>;
  if (feedbacks.length === 0) return <p className="text-center py-10 text-gray-600 text-lg">No feedbacks found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 tracking-wide">Customer Feedback</h1>

      {feedbacks.map((feedback, index) => (
        <div
          key={index}
          className="mb-6 p-6 border border-indigo-200 rounded-xl shadow bg-gradient-to-r from-white to-indigo-50"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-semibold text-indigo-800">
              {feedback.customerName || feedback.userId || "Anonymous"}
            </h2>
            <p className="text-sm text-gray-500">
              Created:{" "}
              <time dateTime={feedback.createdAt}>{new Date(feedback.createdAt).toLocaleString()}</time>
            </p>
          </div>
          <div className="mb-3">
            <p className="text-sm text-indigo-600 font-medium">
              Rating: <span className="text-yellow-500">{'⭐'.repeat(feedback.rating || 0)}</span> ({feedback.rating || 0}/5)
            </p>
            {feedback.email && (
              <p className="text-sm text-gray-600">Email: {feedback.email}</p>
            )}
            {feedback.productId && (
              <p className="text-sm text-gray-600">Product: {feedback.productName || feedback.productId}</p>
            )}
          </div>
          <p className="text-gray-700 text-lg whitespace-pre-line">{feedback.comment || feedback.message}</p>
          <div className="mt-4">
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this feedback?')) {
                  try {
                    await axios.delete(`http://localhost:3002/feedback/${feedback._id}`);
                    window.location.reload(); // Refresh the page
                  } catch (error) {
                    alert('Failed to delete feedback');
                  }
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Delete Feedback
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feedbacks;
