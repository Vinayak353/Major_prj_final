import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const saveUser = (data) => {
    const u = data.user || data;
    const userObj = {
      id:      u.id      || null,
      name:    u.name    || '',
      email:   u.email   || '',
      role:    u.role    || 'CUSTOMER',
      phone:   u.phone   || '',
      address: u.address || '',
      city:    u.city    || '',
      state:   u.state   || '',
      pincode: u.pincode || '',
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  };

  // Merges updated fields into current user — updates both React state and localStorage
  const updateUser = (updatedFields) => {
    const merged = { ...user, ...updatedFields };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return saveUser(data);
  };

  const adminLogin = async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password });
    return saveUser(data);
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    return saveUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.history.replaceState(null, '', '/');
  };

  const isAdmin = () => user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};