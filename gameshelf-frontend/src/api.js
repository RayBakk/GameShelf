// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001',
});

// Add request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;