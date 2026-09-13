import axios from 'axios';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('amrutam_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

