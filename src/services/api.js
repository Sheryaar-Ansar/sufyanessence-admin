// // src/services/api.js
// import axios from 'axios';

// // Create a single Axios instance
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL,
// });

// // Optionally, add interceptors (auth, error handling, etc.)
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
