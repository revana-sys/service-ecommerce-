import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiUrl = "http://localhost:4008/orders";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${apiUrl}/get`);
        // Sort orders by date in descending order (latest first)
        const sortedOrders = res.data.orders.sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      } catch (err) {
        setError(err.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading orders...</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-semibold">Error: {error}</div>;
  if (orders.length === 0) return <p className="text-center py-10 text-gray-600 text-lg">No orders found.</p>;

  // Group orders by customer email (better than name for uniqueness)
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
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 tracking-wide">Orders by Customer</h1>

      {Object.values(groupedByCustomer).map(({ customerInfo, orders }) => (
        <div
          key={customerInfo?.email || "unknown"}
          className="mb-14 p-8 border-2 border-indigo-300 rounded-2xl shadow-lg bg-gradient-to-r from-indigo-50 to-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-indigo-900 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
            </svg>
            Customer: {customerInfo?.name || "Unknown"}{" "}
            <span className="text-indigo-500 text-lg font-medium">({customerInfo?.email || "No Email"})</span>
          </h2>

          {orders.map((order) => (
            <div
              key={order._id}
              className="mb-8 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <p className="mb-3 font-semibold text-indigo-700">
                Order Date:{" "}
                <time dateTime={order.orderDate}>{new Date(order.orderDate).toLocaleString()}</time>
              </p>
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="border border-gray-300 px-5 py-3 text-left text-indigo-700 font-semibold">Product</th>
                    <th className="border border-gray-300 px-5 py-3 text-right text-indigo-700 font-semibold">Quantity</th>
                    <th className="border border-gray-300 px-5 py-3 text-right text-indigo-700 font-semibold">Price ($)</th>
                    <th className="border border-gray-300 px-5 py-3 text-right text-indigo-700 font-semibold">Subtotal ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50 transition-colors">
                      <td className="border border-gray-300 px-5 py-3">{item.productId?.name || "Product"}</td>
                      <td className="border border-gray-300 px-5 py-3 text-right">{item.quantity}</td>
                      <td className="border border-gray-300 px-5 py-3 text-right">{item.price.toFixed(2)}</td>
                      <td className="border border-gray-300 px-5 py-3 text-right">
                        {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-right text-xl font-extrabold text-indigo-800">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;
