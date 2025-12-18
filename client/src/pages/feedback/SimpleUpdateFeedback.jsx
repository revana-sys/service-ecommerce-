import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SimpleUpdateFeedback = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [feedback, setFeedback] = useState({
        comment: '',
        rating: 5,
        productId: ''
    });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchFeedback();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3002/product/getallproducts');
            setProducts(res.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchFeedback = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                navigate("/customer/login");
                return;
            }

            console.log('Fetching feedback with ID:', id);
            const res = await axios.get(`http://localhost:3002/feedback/${id}`);
            console.log('Feedback response:', res.data);

            // Check if the feedback belongs to the current user
            const userId = user.id || user.email;
            if (res.data.userId !== userId && res.data.email !== user.email) {
                setError("You can only edit your own feedbacks");
                return;
            }

            setFeedback({
                comment: res.data.comment || res.data.message || '',
                rating: res.data.rating || 5,
                productId: res.data.productId || ''
            });
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setError('Failed to fetch feedback: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                navigate("/customer/login");
                return;
            }

            const updateData = {
                comment: feedback.comment,
                rating: parseInt(feedback.rating),
                productId: feedback.productId || null
            };

            console.log('Updating feedback with data:', updateData);
            await axios.put(`http://localhost:3002/feedback/${id}`, updateData);
            alert('Feedback updated successfully!');
            navigate('/feedback/list');
        } catch (error) {
            console.error("Error updating feedback:", error);
            alert("Failed to update feedback: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Loading feedback...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 font-semibold text-xl mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/feedback/list')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Back to Feedback List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-6 text-indigo-600">Edit Feedback</h1>

                <div className="mb-6">
                    <button
                        onClick={() => navigate('/feedback/list')}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        ← Back to My Feedbacks
                    </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Product (Optional)
                        </label>
                        <select
                            value={feedback.productId}
                            onChange={(e) => setFeedback({ ...feedback, productId: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">General Feedback (No specific product)</option>
                            {products.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name} - ${p.price}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Rating
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={feedback.rating}
                                onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })}
                                className="flex-1"
                            />
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">{'⭐'.repeat(parseInt(feedback.rating))}</span>
                                <span className="text-black">({feedback.rating}/5)</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Your Feedback
                        </label>
                        <textarea
                            value={feedback.comment}
                            onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                            placeholder="Write your feedback here..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="6"
                            required
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-green-600 text-black py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {submitting ? 'Updating...' : 'Update Feedback'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/feedback/list')}
                            className="flex-1 bg-gray-500 text-black py-2 px-4 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SimpleUpdateFeedback;