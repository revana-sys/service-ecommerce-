import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewWriteFeedback = () => {
    const [formData, setFormData] = useState({
        comment: '',
        rating: 5,
        productId: ''
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const loggedUser = localStorage.getItem('user');
        if (!loggedUser) {
            alert('Please login first');
            navigate('/customer/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(loggedUser);
            setUser(parsedUser);
            console.log('User found:', parsedUser);
        } catch (error) {
            console.error('Error parsing user:', error);
            navigate('/customer/login');
            return;
        }

        // Fetch products
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            console.log('Fetching products...');
            const response = await axios.get('http://localhost:3002/product/getallproducts');
            console.log('Products fetched:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.warn('Products data is not an array:', response.data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Please login first');
            return;
        }

        if (!formData.comment.trim()) {
            alert('Please write your feedback');
            return;
        }

        setSubmitting(true);

        try {
            const feedbackData = {
                userId: user.id || user.email || user.name,
                productId: formData.productId || null,
                comment: formData.comment.trim(),
                rating: parseInt(formData.rating)
            };

            console.log('Submitting feedback:', feedbackData);

            const response = await axios.post('http://localhost:3002/feedback', feedbackData);
            console.log('Feedback submitted successfully:', response.data);

            alert('Feedback submitted successfully!');
            navigate('/feedback/list');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Loading...</h2>
                    <p>Please wait while we load the form</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    color: '#4f46e5'
                }}>
                    Write New Feedback
                </h1>

                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => navigate('/feedback/list')}
                        style={{
                            backgroundColor: '#6b7280',
                            color: 'black',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ← Back to My Feedbacks
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: 'black'
                        }}>
                            Product (Optional)
                        </label>
                        <select
                            name="productId"
                            value={formData.productId}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        >
                            <option value="" style={{ color: 'black' }}>General Feedback (No specific product)</option>
                            {products.map((product) => (
                                <option key={product._id} value={product._id}>
                                    {product.name} - ${product.price}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: 'black'
                        }}>
                            Rating: {formData.rating}/5
                        </label>
                        <input
                            type="range"
                            name="rating"
                            min="1"
                            max="5"
                            value={formData.rating}
                            onChange={handleInputChange}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <div style={{ fontSize: '24px', color: 'black' }}>
                            {'⭐'.repeat(parseInt(formData.rating))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: 'black'
                        }}>
                            Your Feedback *
                        </label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleInputChange}
                            placeholder="Write your feedback here... Tell us about your experience!"
                            required
                            rows="6"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '16px',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                flex: 1,
                                backgroundColor: submitting ? '#9ca3af' : '#4f46e5',
                                color: 'black',
                                padding: '12px',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                cursor: submitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {submitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/feedback/list')}
                            style={{
                                flex: 1,
                                backgroundColor: '#6b7280',
                                color: 'black',
                                padding: '12px',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewWriteFeedback;