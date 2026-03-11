import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  // Read directly from localStorage — this is already set before navigate() fires
  // so it's always up to date even if React state hasn't re-rendered yet
  const token = localStorage.getItem('token');
  const stored = localStorage.getItem('user');

  if (!token || !stored) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const userObj = JSON.parse(stored);
    if (userObj.role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
    return children;
  } catch {
    return <Navigate to="/admin/login" replace />;
  }
};

export default PrivateRoute;
