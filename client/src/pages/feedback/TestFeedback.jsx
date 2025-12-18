import React from 'react';

const TestFeedback = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-3xl font-extrabold mb-6 text-black">
                    Test Feedback Page
                </h2>
                <p className="text-black">
                    This is a test page to check if the feedback routing is working.
                </p>
                <div className="mt-4">
                    <button
                        onClick={() => window.location.href = '/feedback/list'}
                        className="bg-indigo-600 text-black px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Go to Feedback List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestFeedback;