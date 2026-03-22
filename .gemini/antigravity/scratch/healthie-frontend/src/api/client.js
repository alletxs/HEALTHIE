import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000';

const client = axios.create({ baseURL: API_BASE });

client.interceptors.request.use(config => {
  const token = localStorage.getItem('healthie_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => client.post('/api/auth/register', data),
  login: (data) => client.post('/api/auth/login', data),
  me: () => client.get('/api/auth/me'),
};

export const analyzeAPI = {
  analyzeImage: (imageDataUrl) => client.post('/api/analyze', { image_data: imageDataUrl }),
};

export const mealsAPI = {
  save: (data) => client.post('/api/meals/save', data),
  history: () => client.get('/api/meals/history'),
  delete: (id) => client.delete(`/api/meals/delete/${id}`),
  analytics: (days = 30) => client.get(`/api/meals/analytics?days=${days}`),
};

export const insightsAPI = {
  get: () => client.get('/api/insights'),
};

export default client;
