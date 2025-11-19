import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

// Helper to get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Products CRUD
export const getProducts = () => api.get('/products', { headers: getAuthHeader() });
export const getProduct = (id) => api.get(`/products/${id}`, { headers: getAuthHeader() });
export const createProduct = (payload) => api.post('/products', payload, { headers: getAuthHeader() });
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload, { headers: getAuthHeader() });
export const deleteProduct = (id) => api.delete(`/products/${id}`, { headers: getAuthHeader() });

export const uploadImages = (files) => {
  const formData = new FormData();
  files.forEach(f => formData.append('images', f));
  return api.post('/upload/images', formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
  });
};

export const uploadHover = (file) => {
  const formData = new FormData();
  formData.append('hover', file);
  return api.post('/upload/hover', formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
  });
};

