// frontend/src/services/productService.js
// Dedicated product API service — import this directly in any component.
// Usage: import productService from '../services/productService';

import api from './api';

const productService = {
  // GET /api/products?search=&category=&sort=price,asc&page=0&size=12
  getAll: (params = {}) => api.get('/products', { params }).then(r => r.data),

  // GET /api/products/{id}
  getById: (id) => api.get(`/products/${id}`).then(r => r.data),

  // GET /api/products/featured
  getFeatured: () => api.get('/products/featured').then(r => r.data),

  // POST /api/products  (admin)
  create: (data) => api.post('/products', data).then(r => r.data),

  // PUT /api/products/{id}  (admin)
  update: (id, data) => api.put(`/products/${id}`, data).then(r => r.data),

  // DELETE /api/products/{id}  (admin)
  delete: (id) => api.delete(`/products/${id}`).then(r => r.data),
};

export default productService;