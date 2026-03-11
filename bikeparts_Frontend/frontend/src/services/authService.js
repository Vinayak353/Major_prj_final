import api from './api';

// ─── Auth Service ───────────────────────────────────────────────
export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
  adminLogin: async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password });
    return data;
  },
};

// ─── Product Service ─────────────────────────────────────────────
export const productService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/products', { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  getFeatured: async () => {
    const { data } = await api.get('/products/featured');
    return data;
  },
  search: async (query) => {
    const { data } = await api.get('/products/search', { params: { q: query } });
    return data;
  },
  // Admin
  create: async (productData) => {
    const { data } = await api.post('/admin/products', productData);
    return data;
  },
  update: async (id, productData) => {
    const { data } = await api.put(`/admin/products/${id}`, productData);
    return data;
  },
  delete: async (id) => {
    await api.delete(`/admin/products/${id}`);
  },
};

// ─── Order Service ────────────────────────────────────────────────
export const orderService = {
  create: async (orderData) => {
    console.log('📤 Creating order with data:', orderData);
    const { data } = await api.post('/orders', orderData);
    console.log('✅ Order created:', data);
    return data;
  },
  getMyOrders: async () => {
    console.log('📥 Fetching my orders...');
    try {
      const { data } = await api.get('/orders/my');
      console.log('✅ My orders response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching my orders:', error);
      throw error;
    }
  },
  getById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  cancel: async (id) => {
    const { data } = await api.put(`/orders/${id}/cancel`);
    return data;
  },
  // Admin
  getAll: async (params = {}) => {
    console.log('📥 Admin fetching all orders with params:', params);
    try {
      const { data } = await api.get('/admin/orders', { params });
      console.log('✅ Admin orders response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching admin orders:', error);
      throw error;
    }
  },
  updateStatus: async (id, status) => {
    console.log('🔄 Updating order status:', id, status);
    const { data } = await api.put(`/admin/orders/${id}/status`, { status });
    console.log('✅ Status updated:', data);
    return data;
  },
};

// ─── Admin Service ─────────────────────────────────────────────────
export const adminService = {
  getDashboardStats: async () => {
    const { data } = await api.get('/admin/dashboard/stats');
    return data;
  },
  getUsers: async (params = {}) => {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },
  updateUserStatus: async (id, active) => {
    const { data } = await api.put(`/admin/users/${id}/status`, { active });
    return data;
  },
  deleteUser: async (id) => {
    await api.delete(`/admin/users/${id}`);
  },
};