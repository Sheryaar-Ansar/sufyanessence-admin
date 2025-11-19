import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCategories = () => api.get('/categories', { headers: getAuthHeader() });
export const createCategory = (payload) => api.post('/categories', payload, { headers: getAuthHeader() });
export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload, { headers: getAuthHeader() });
export const deleteCategory = (id) => api.delete(`/categories/${id}`, { headers: getAuthHeader() });