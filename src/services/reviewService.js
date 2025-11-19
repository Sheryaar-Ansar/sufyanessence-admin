import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

// Helper to get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPendingReviews = () => api.get('/reviews/pending', { headers: getAuthHeader() });
export const approveReview = (id) => api.put(`/reviews/${id}/approve`, {}, { headers: getAuthHeader() });

export const rejectReview = (id) => api.delete(`/reviews/${id}`, { headers: getAuthHeader() });
