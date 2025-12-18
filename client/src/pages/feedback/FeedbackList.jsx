import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MESSAGE_LIMIT = 120;

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [expanded, setExpanded] = useState([]); // Track expanded feedbacks
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/customer/login");
      return;
    }
    setCurrentUser(user);
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`http://localhost:4008/Feedback/get`);
      setFeedbacks(res.data.feedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      alert("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/customer/login");
        return;
      }
      const feedback = feedbacks.find(fb => fb._id === id);
      if (feedback && feedback.email === user.email) {
        await axios.delete(`http://localhost:4008/Feedback/delete/${id}`);
        fetchFeedbacks();
      } else {
        alert("You can only delete your own feedbacks");
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert("Failed to delete feedback");
    }
  };

  const handleEdit = (feedback) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/customer/login");
      return;
    }
    if (feedback.email === user.email) {
      navigate(`/feedback/edit/${feedback._id}`);
    } else {
      alert("You can only edit your own feedbacks");
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading feedbacks...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Feedbacks
      </h2>

      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate('/feedback/write')}
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-white px-6 py-2 rounded shadow-md"
        >
          Write New Feedback
        </button>
        <button
          onClick={() => navigate('/customer/dashboard')}
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-white px-6 py-2 rounded shadow-md"
        >
          Back to Dashboard
        </button>
      </div>

      {feedbacks.length === 0 ? (
        <p className="text-gray-600 italic">No feedback found.</p>
      ) : (
        <ul className="space-y-6">
          {feedbacks.map((fb) => {
            const isLong = fb.message.length > MESSAGE_LIMIT;
            const isExpanded = expanded.includes(fb._id);
            return (
              <li key={fb._id} className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="mb-1"><strong>Name:</strong> <span className="text-indigo-600">{fb.customerName}</span></p>
                <p className="mb-1"><strong>Email:</strong> <span className="text-gray-700">{fb.email}</span></p>
                <p className="mb-1"><strong>Message:</strong> <span className="text-gray-800">
                  {isLong && !isExpanded
                    ? fb.message.slice(0, MESSAGE_LIMIT) + '...'
                    : fb.message}
                  {isLong && (
                    <button
                      onClick={() => toggleExpand(fb._id)}
                      className="ml-2 text-indigo-600 hover:underline text-sm"
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </span></p>
                <p className="mb-3"><strong>Rating:</strong> <span className="text-yellow-500">{'⭐'.repeat(fb.rating)}</span></p>
                <p><strong>Product:</strong> {fb.product?.name || "Unknown product"}</p>
                {currentUser && fb.email === currentUser.email && (
                  <div className="space-x-3">
                    <button
                      onClick={() => handleEdit(fb)}
                      className="mb-6 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-white px-6 py-2 rounded shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFeedback(fb._id)}
                      className="mb-6 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-white px-6 py-2 rounded shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FeedbackList;
