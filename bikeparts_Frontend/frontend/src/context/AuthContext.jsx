import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, restore user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Save user to state + localStorage from the API response { token, user: {...} }
  const saveUser = (data) => {
    const u = data.user || data; // support both nested { token, user } and flat responses
    const userObj = {
      id:    u.id    || null,
      name:  u.name  || '',
      email: u.email || '',
      role:  u.role  || 'CUSTOMER',
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const userObj = saveUser(data);
    return userObj;           // return the userObj directly so callers can read role immediately
  };

  const adminLogin = async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password });
    const userObj = saveUser(data);
    return userObj;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    const userObj = saveUser(data);
    return userObj;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
