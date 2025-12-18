import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewFeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
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
            fetchUserFeedbacks(parsedUser);
        } catch (error) {
            console.error('Error parsing user:', error);
            navigate('/customer/login');
        }
    }, [navigate]);

    const fetchUserFeedbacks = async (currentUser) => {
        try {
            const userId = currentUser.id || currentUser.email || currentUser.name;
            console.log('Fetching feedbacks for user:', userId);

            const response = await axios.get(`http://localhost:3002/feedback/user/${userId}`);
            console.log('User feedbacks:', response.data);

            setFeedbacks(response.data || []);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (feedbackId) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3002/feedback/${feedbackId}`);
            alert('Feedback deleted successfully!');
            // Refresh the list
            if (user) {
                fetchUserFeedbacks(user);
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
            alert('Failed to delete feedback');
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
                    <p>Loading your feedbacks...</p>
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
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    color: '#4f46e5'
                }}>
                    My Feedbacks
                </h1>

                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/feedback/write')}
                        style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Write New Feedback
                    </button>
                    <button
                        onClick={() => navigate('/customer/dashboard')}
                        style={{
                            backgroundColor: '#6b7280',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>

                {feedbacks.length === 0 ? (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '10px' }}>No Feedback Yet</h3>
                        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                            You haven't written any feedback yet. Click "Write New Feedback" to get started!
                        </p>
                        <button
                            onClick={() => navigate('/feedback/write')}
                            style={{
                                backgroundColor: '#4f46e5',
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Write Your First Feedback
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {feedbacks.map((feedback) => (
                            <div
                                key={feedback._id}
                                style={{
                                    backgroundColor: 'white',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{ marginBottom: '10px' }}>
                                    <strong>Product:</strong> {feedback.productName || feedback.productId || 'General Feedback'}
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <strong>Rating:</strong> {'⭐'.repeat(feedback.rating || 0)} ({feedback.rating || 0}/5)
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <strong>Comment:</strong>
                                    <p style={{ marginTop: '5px', lineHeight: '1.5' }}>
                                        {feedback.comment || feedback.message || 'No comment'}
                                    </p>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTop: '1px solid #e5e7eb',
                                    paddingTop: '15px'
                                }}>
                                    <small style={{ color: '#6b7280' }}>
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                    </small>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => navigate(`/feedback/edit/${feedback._id}`)}
                                            style={{
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                padding: '6px 12px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(feedback._id)}
                                            style={{
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                padding: '6px 12px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewFeedbackList;