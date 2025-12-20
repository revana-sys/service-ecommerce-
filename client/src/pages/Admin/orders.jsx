import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const navigate = useNavigate();

  const apiUrl = "http://localhost:3002";

  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${apiUrl}/orders`);

      // Handle different response formats
      let ordersData = [];
      if (Array.isArray(res.data)) {
        ordersData = res.data;
      } else if (Array.isArray(res.data.data)) {
        ordersData = res.data.data;
      } else if (Array.isArray(res.data.orders)) {
        ordersData = res.data.orders;
      }

      // Sort orders by date in descending order (latest first)
      const sortedOrders = ordersData.sort((a, b) =>
        new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || err.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await axios.put(`${apiUrl}/orders/${orderId}/status`, { status: newStatus });
      // Refresh orders after status update
      await fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      <span className="ml-3 text-lg font-semibold text-gray-600">Loading orders...</span>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-semibold">Error: {error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Group orders by customer email
  const groupedByCustomer = orders.reduce((acc, order) => {
    const key = order.customerInfo?.email || "Unknown";
    if (!acc[key]) {
      acc[key] = {
        customerInfo: order.customerInfo,
        orders: [],
      };
    }
    acc[key].orders.push(order);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Order Management</h1>
          <p className="text-gray-500 mt-1">View and manage all customer orders</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchOrders}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 00-8 8H0l3 3 3-3H4a6 6 0 111.757 4.243l1.414 1.414A8 8 0 1010 2z" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
          >
            Back
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statusOptions.map(status => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <div key={status} className={`p-4 rounded-lg ${statusColors[status]} text-center`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm capitalize">{status}</p>
            </div>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-xl">No orders found.</p>
          <p className="text-gray-400 mt-2">Orders will appear here once customers place them.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.values(groupedByCustomer).map(({ customerInfo, orders: customerOrders }) => (
            <div
              key={customerInfo?.email || "unknown"}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Customer Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{customerInfo?.name || "Unknown Customer"}</h2>
                    <p className="text-indigo-100">{customerInfo?.email || "No Email"}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm text-indigo-100">Total Orders</p>
                    <p className="text-2xl font-bold">{customerOrders.length}</p>
                  </div>
                </div>
              </div>

              {/* Customer Orders */}
              <div className="p-6 space-y-6">
                {customerOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono text-gray-800">#{order._id?.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="text-gray-800">{formatDate(order.createdAt || order.orderDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-indigo-600">${order.totalAmount?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <select
                          value={order.status || "pending"}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingOrderId === order._id}
                          className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer border-0 ${statusColors[order.status || "pending"]} ${updatingOrderId === order._id ? "opacity-50 cursor-wait" : ""
                            }`}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status} className="bg-white text-gray-800">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Order Items</p>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-2 px-3">Product</th>
                            <th className="text-center py-2 px-3">Qty</th>
                            <th className="text-right py-2 px-3">Price</th>
                            <th className="text-right py-2 px-3">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.orderItems?.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-2 px-3">{item.name || item.productId?.name || "Product"}</td>
                              <td className="text-center py-2 px-3">{item.quantity}</td>
                              <td className="text-right py-2 px-3">${item.price?.toFixed(2)}</td>
                              <td className="text-right py-2 px-3 font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Shipping Info */}
                    {customerInfo?.address && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm font-medium text-gray-700">Shipping Address</p>
                        <p className="text-gray-600">{customerInfo.address}</p>
                        {customerInfo.phone && <p className="text-gray-600">Phone: {customerInfo.phone}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

