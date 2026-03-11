import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('🔧 API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token attached to request:', config.url);
    } else {
      console.log('⚠️ No token found for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url || '';
    const status = error.response?.status;
    
    console.error('❌ API Error:', {
      url: requestUrl,
      status: status,
      message: error.message,
      data: error.response?.data
    });

    // Handle 401 Unauthorized
    if (status === 401) {
      const isAuthRequest = requestUrl.includes('/auth/');
      if (!isAuthRequest) {
        console.log('🔄 Redirecting to login due to 401');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const isAdminPage = window.location.pathname.startsWith('/admin');
        window.location.href = isAdminPage ? '/admin/login' : '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (status === 403) {
      console.error('🚫 Access Forbidden');
    }
    
    // Handle 500 Server Error
    if (status === 500) {
      console.error('🔥 Server Error');
    }

    return Promise.reject(error);
  }
);

export default api;