import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute, { AdminRoute, GuestRoute } from './components/common/PrivateRoute';

import Home          from './pages/customer/Home';
import Login         from './pages/customer/Login';
import Register      from './pages/customer/Register';
import Products      from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import Cart          from './pages/customer/Cart';
import Checkout      from './pages/customer/Checkout';
import OrderSuccess  from './pages/customer/OrderSuccess';
import OrderHistory  from './pages/customer/OrderHistory';
import Profile       from './pages/customer/Profile';
import About         from './pages/customer/About';
import Contact       from './pages/customer/Contact';

import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts  from './pages/admin/AdminProducts';
import AdminOrders    from './pages/admin/AdminOrders';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminMessages  from './pages/admin/AdminMessages';

import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public pages */}
            <Route path="/"             element={<Home />} />
            <Route path="/products"     element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about"        element={<About />} />
            <Route path="/contact"      element={<Contact />} />
            <Route path="/cart"         element={<Cart />} />

            {/* Auth pages — redirect away if already logged in */}
            <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* Customer-only pages — must be logged in */}
            <Route path="/checkout"      element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/order-success" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
            <Route path="/orders"        element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
            <Route path="/profile"       element={<PrivateRoute><Profile /></PrivateRoute>} />

            {/* Admin login — redirect away if already logged in as admin */}
            <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

            {/* Admin pages — must be logged in AND be ADMIN role */}
            <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders"   element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/users"    element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;