import axios from 'axios';
import { AuthService } from '../services/auth.service';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = AuthService.getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.clearSession();
      window.dispatchEvent(new CustomEvent('amrutam_session_expired', { detail: { reason: 'Session expired or invalid token.' } }));
    }
    return Promise.reject(error);
  }
);
