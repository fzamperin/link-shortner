import axios from 'axios';
import { ShortUrl } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use((config) => {
  if(config.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return config;
});

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const shortenUrl = async (data: { url: string; slug?: string }) => {
  const response = await api.post<ShortUrl>('/urls', data);
  return response.data;
};

export const updateSlug = async (id: string, slug: string) => {
  const response = await api.patch(`/urls/${id}`, { slug });
  return response.data;
};

export const getUserUrls = async () => {
  const response = await api.get<ShortUrl[]>('/urls');
  return response.data;
};