import axios from 'axios';

// Configure the base URL for API requests
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Funding API functions
export const fundingAPI = {
  // Get all funding entries
  getAll: () => api.get('/fundings'),
  
  // Get funding by ID
  getById: (id) => api.get(`/fundings/${id}`),
  
  // Create new funding entry
  create: (data) => api.post('/fundings', data),
  
  // Update funding entry
  update: (id, data) => api.put(`/fundings/${id}`, data),
  
  // Delete funding entry
  delete: (id) => api.delete(`/fundings/${id}`)
};

// Auth API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
  }
};

export default api;
