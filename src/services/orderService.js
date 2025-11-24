import axios from 'axios';
import { json2csv } from 'json-2-csv'; // optional CSV helper
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getOrders = (status) => api.get(`/orders?status=${status}`, { headers: getAuthHeader() });
export const getOrder = (id) => api.get(`/orders/${id}`, { headers: getAuthHeader() });
export const updateOrderStatus = (id, payload) => api.put(`/orders/${id}/status`, payload, { headers: getAuthHeader() });

export const exportOrdersCSV = async () => {
  const res = await getOrders();
  const orders = res.data.orders || res.data;
  return new Promise((resolve, reject) => {
    json2csv(orders, (err, csv) => {
      if (err) reject(err);
      else resolve(csv);
    });
  });
};