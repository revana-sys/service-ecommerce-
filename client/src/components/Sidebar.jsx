import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Package,
  Users,
  MessageSquare,
  Tag,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isAdmin = false, onCategorySelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const user = JSON.parse(localStorage.getItem(isAdmin ? 'admin' : 'user'));

  useEffect(() => {
    if (isAdmin) {
      axios.get('http://localhost:4008/products')
        .then((res) => {
          const data = res.data?.data || [];
          const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        })
        .catch(err => {
          console.error("Failed to fetch categories", err);
        });
    }
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem(isAdmin ? 'admin' : 'user');
    navigate(isAdmin ? '/admin/login' : '/customer/login');
  };

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleCategoryExpand = () => setCategoriesExpanded(!categoriesExpanded);

  return (
    <div className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} bg-white shadow-lg z-40 h-screen fixed`}>
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          {!collapsed && (
            <div>
              <h3 className="font-semibold text-gray-800">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500">{isAdmin ? 'Admin' : 'Customer'}</p>
            </div>
          )}
        </div>
        <button onClick={toggleSidebar}>
          {collapsed ? <Menu /> : <X />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {isAdmin && (
            <>
              {/* All Products */}
              <li>
                <button
                  onClick={() => onCategorySelect("all")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${location.pathname === "/admin/products" ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                    }`}
                >
                  <Package className="w-5 h-5" />
                  {!collapsed && <span>All Products</span>}
                </button>
              </li>

              {/* Category dropdown */}
              {!collapsed && (
                <li>
                  <button
                    onClick={toggleCategoryExpand}
                    className="w-full flex items-center justify-between px-4 py-2 text-gray-600 hover:text-indigo-600"
                  >
                    <div className="flex items-center space-x-3">
                      <Tag className="w-5 h-5" />
                      <span>Categories</span>
                    </div>
                    {categoriesExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              )}

              {!collapsed && categoriesExpanded && categories.map((cat, i) => (
                <li key={i}>
                  <button
                    onClick={() => onCategorySelect(cat)}
                    className="ml-8 w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    <span>{cat} Collection</span>
                  </button>
                </li>
              ))}

              {/* Other Admin Sections */}
              <li>
                <button
                  onClick={() => navigate("/admin/orders")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${location.pathname === "/admin/orders" ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                    }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {!collapsed && <span>Orders</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/admin/customers")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50"
                >
                  <Users className="w-5 h-5" />
                  {!collapsed && <span>Customers</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/admin/feedbacks")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50"
                >
                  <MessageSquare className="w-5 h-5" />
                  {!collapsed && <span>Feedbacks</span>}
                </button>
              </li>
            </>
          )}

          {!isAdmin && (
            <>
              {/* Customer Dashboard */}
              <li>
                <button
                  onClick={() => navigate("/customer/dashboard")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${location.pathname === "/customer/dashboard" ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                    }`}
                >
                  <Package className="w-5 h-5" />
                  {!collapsed && <span>Products</span>}
                </button>
              </li>

              {/* Customer Cart */}
              <li>
                <button
                  onClick={() => navigate("/customer/CartPage")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${location.pathname === "/customer/CartPage" ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                    }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {!collapsed && <span>Cart</span>}
                </button>
              </li>

              {/* Customer Orders */}
              <li>
                <button
                  onClick={() => navigate("/customer/myorders")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${location.pathname === "/customer/myorders" ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                    }`}
                >
                  <Package className="w-5 h-5" />
                  {!collapsed && <span>My Orders</span>}
                </button>
              </li>

              {/* Customer Feedback */}
              <li>
                <button
                  onClick={() => navigate("/feedback/list")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${location.pathname.startsWith("/feedback") ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
                    }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  {!collapsed && <span>Feedback</span>}
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 w-full p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
