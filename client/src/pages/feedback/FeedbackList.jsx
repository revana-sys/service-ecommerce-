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
      console.log('Fetching feedbacks...');
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      // Get only user's own feedback
      const userId = user.id || user.email;
      const res = await axios.get(`http://localhost:3002/feedback/user/${userId}`);
      console.log('User feedbacks response:', res.data);
      setFeedbacks(res.data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      alert("Failed to load feedbacks: " + error.message);
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
      if (feedback && (feedback.userId === (user.id || user.email) || feedback.email === user.email)) {
        await axios.delete(`http://localhost:3002/feedback/${id}`);
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
    if (feedback.userId === (user.id || user.email) || feedback.email === user.email) {
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-10 text-lg font-semibold">Loading feedbacks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          My Feedbacks
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
          <p className="text-gray-600 italic">You haven't written any feedback yet. Click "Write New Feedback" to get started!</p>
        ) : (
          <ul className="space-y-6">
            {feedbacks.map((fb) => {
              const isLong = (fb.comment || fb.message || '').length > MESSAGE_LIMIT;
              const isExpanded = expanded.includes(fb._id);
              return (
                <li key={fb._id} className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="mb-1"><strong>User:</strong> <span className="text-indigo-600">{fb.customerName || fb.userId || 'Anonymous'}</span></p>
                  {fb.email && <p className="mb-1"><strong>Email:</strong> <span className="text-gray-700">{fb.email}</span></p>}
                  <p className="mb-1"><strong>Product:</strong> <span className="text-gray-700">{fb.productName || fb.productId || 'General Feedback'}</span></p>
                  <p className="mb-1"><strong>Comment:</strong> <span className="text-gray-800">
                    {isLong && !isExpanded
                      ? (fb.comment || fb.message || '').slice(0, MESSAGE_LIMIT) + '...'
                      : (fb.comment || fb.message || '')}
                    {isLong && (
                      <button
                        onClick={() => toggleExpand(fb._id)}
                        className="ml-2 text-indigo-600 hover:underline text-sm"
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </span></p>
                  <p className="mb-3"><strong>Rating:</strong> <span className="text-yellow-500">{'⭐'.repeat(fb.rating || 0)}</span> ({fb.rating || 0}/5)</p>
                  <p className="mb-1"><strong>Created:</strong> <span className="text-gray-600">{new Date(fb.createdAt).toLocaleDateString()}</span></p>
                  {currentUser && (fb.userId === (currentUser.id || currentUser.email) || fb.email === currentUser.email) && (
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
    </div>
  );
};

export default FeedbackList;
