import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Blocks browser-back access: if user is logged in but goes back to /login or /register,
// redirect them to home. If not logged in, redirect to login.
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  if (!user) {
    // Not logged in — send to login, remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Only allows ADMIN role. Customers are redirected to home, not-logged-in go to admin login.
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  if (!user) return <Navigate to="/admin/login" replace />;

  // Customer or any non-admin trying to access admin pages — send to home
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;

  return children;
};

// Redirect already-logged-in users away from auth pages (login/register)
// Admin goes to /admin, customer goes to /
export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/'} replace />;
  }

  return children;
};

export default PrivateRoute;