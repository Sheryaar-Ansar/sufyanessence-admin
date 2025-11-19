import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL})


const getAuthHeader = () => {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getStats = () => api.get('/dashboard/stats', { headers: getAuthHeader()})