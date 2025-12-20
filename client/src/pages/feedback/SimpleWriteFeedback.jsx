import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SimpleWriteFeedback = () => {
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [product, setProduct] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/customer/login");
            return;
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            console.log('Fetching products...');
            const res = await axios.get('http://localhost:3002/product/getallproducts');
            console.log('Products response:', res.data);
            setProducts(res.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert("Failed to load products: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Please log in to submit feedback");
            setSubmitting(false);
            return;
        }

        try {
            console.log('Submitting feedback...');
            const feedbackData = {
                userId: user.id || user.email,
                productId: product || null,
                comment: message,
                rating: parseInt(rating)
            };

            console.log('Feedback data:', feedbackData);

            await axios.post('http://localhost:3002/feedback', feedbackData);
            alert('Feedback submitted successfully!');
            navigate('/feedback/list');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert("Failed to submit feedback: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-6 text-black">Write New Feedback</h1>

                <div className="mb-6">
                    <button
                        onClick={() => navigate('/feedback/list')}
                        className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600"
                    >
                        ← Back to My Feedbacks
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Product (Optional)
                        </label>
                        <select
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
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
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="flex-1"
                            />
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">{'⭐'.repeat(parseInt(rating))}</span>
                                <span className="text-black">({rating}/5)</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Your Feedback
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your feedback here... Tell us about your experience!"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="6"
                            required
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-indigo-600 text-black py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            {submitting ? 'Submitting...' : 'Submit Feedback'}
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

export default SimpleWriteFeedback;