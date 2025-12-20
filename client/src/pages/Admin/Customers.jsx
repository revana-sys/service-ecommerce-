import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const apiUrl = "http://localhost:3002";

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${apiUrl}/auth/users`);

                // Handle different response formats
                let usersData = [];
                if (Array.isArray(res.data)) {
                    usersData = res.data;
                } else if (Array.isArray(res.data.data)) {
                    usersData = res.data.data;
                }

                // Filter only customers (not admins)
                const customersList = usersData.filter(user => user.role === 'customer');
                setCustomers(customersList);
            } catch (err) {
                console.error("Error fetching customers:", err);
                setError(err.response?.data?.message || err.message || "Error fetching customers");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg font-semibold text-gray-600">Loading customers...</span>
        </div>
    );

    if (error) return (
        <div className="max-w-4xl mx-auto p-8 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="font-semibold">Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Customer Management</h1>
                    <p className="text-gray-500 mt-1">View all registered customers</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                >
                    Back
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg">
                    <p className="text-3xl font-bold">{customers.length}</p>
                    <p className="text-indigo-100">Total Customers</p>
                </div>
            </div>

            {customers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-xl">No customers found.</p>
                    <p className="text-gray-400 mt-2">Customers will appear here once they register.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">#</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => (
                                <tr key={customer._id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-600">{index + 1}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-600 font-semibold">
                                                    {customer.name?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-800">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{customer.email}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 capitalize">
                                            {customer.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Customers;
