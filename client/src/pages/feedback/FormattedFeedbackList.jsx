import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormattedFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  const fetchAllFeedbacks = async () => {
    try {
      // Fetch all feedbacks (admin view)
      const res = await axios.get("http://localhost:3002/feedback");
      setFeedbacks(res.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError("Failed to load feedbacks: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <span className="text-yellow-500">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
        <span className="text-gray-600 ml-1">({rating}/5)</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-10 text-lg font-semibold">Loading feedbacks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-10 text-lg font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Customer Feedback
        </h2>

        {feedbacks.length === 0 ? (
          <p className="text-gray-600 italic text-center">No feedback available yet.</p>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                {/* Header with date and rating */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-gray-500">
                    Created: {new Date(fb.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                  <div className="font-medium">
                    Rating: {renderStars(fb.rating || 0)}
                  </div>
                </div>

                {/* Email */}
                {(fb.email || fb.customerName) && (
                  <div className="mb-3">
                    <span className="font-medium text-gray-700">Email:</span>{' '}
                    <span className="text-gray-900">{fb.email || "N/A"}</span>
                  </div>
                )}

                {/* Product */}
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Product:</span>{' '}
                  <span className="text-gray-900">{fb.productName || fb.productId || 'General Feedback'}</span>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <span className="font-medium text-gray-700">Comment:</span>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-gray-800">
                    {fb.comment || fb.message || 'No comment provided'}
                  </div>
                </div>

                {/* Status */}
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormattedFeedbackList;