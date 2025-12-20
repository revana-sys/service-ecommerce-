import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString) => {
  try {
    if (!dateString) return 'Date not available';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    if (diffDays === 0) {
      return `Today at ${timeString}`;
    }
    if (diffDays === 1) {
      return `Yesterday at ${timeString}`;
    }
    if (diffDays < 7) {
      return `${date.toLocaleDateString('en-US', { weekday: 'long' })} at ${timeString}`;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date not available';
  }
};

const Myorders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/customer/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3002/orders/customer/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("Orders response:", res.data); // Debug log

        let ordersData = [];
        if (Array.isArray(res.data)) {
          ordersData = res.data;
        } else if (Array.isArray(res.data.orders)) {
          ordersData = res.data.orders;
        }

        const sortedOrders = ordersData.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.orderDate);
          const dateB = new Date(b.createdAt || b.orderDate);
          return dateB - dateA;
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/customer/login");
        } else {
          setError("Failed to fetch orders. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleFeedbackClick = (orderId) => {
    navigate(`/feedback/create?orderId=${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 text-lg mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Showing your most recent orders first</p>
          </div>
          <button
            onClick={() => navigate("/customer/dashboard")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No orders found.</p>
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Ordered {formatDate(order.createdAt || order.orderDate)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                      {order.status
                        ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                        : 'Processing'}
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={item.image ? `http://localhost:4008/uploads/${item.image.replace(/^\/?uploads\//, '')}` : "https://via.placeholder.com/150?text=No+Image"}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              console.error("Image failed to load:", e.target.src);
                              e.target.src = "https://via.placeholder.com/150?text=No+Image";
                              e.target.onerror = null;
                            }}
                            onClick={() => navigate(`/product/${item.productId}`)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-500">Price: {item.price}</p>
                          {item.selectedColor && (
                            <p className="text-sm text-gray-500">Color: {item.selectedColor.name}</p>
                          )}
                          {item.selectedSize && (
                            <p className="text-sm text-gray-500">Size: {item.selectedSize.name}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <p className="text-lg font-medium text-gray-900">{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium text-gray-900">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">{order.totalAmount}</p>
                    </div>
                  </div>

                  {order.status === "delivered" && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleFeedbackClick(order._id)}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Leave Feedback
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Myorders;
