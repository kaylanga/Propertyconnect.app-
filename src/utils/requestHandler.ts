import axios, { AxiosRequestConfig } from 'axios';
import { supabase } from '../lib/supabase';
import { flushManager } from './utils/flushManager';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 305) {
      // Handle proxy error
      console.error('Proxy error detected:', error);
      // Retry the request
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

// When you need to flush the system
try {
  await flushManager.flushAll();
  console.log('System successfully flushed');
} catch (error) {
  console.error('Error during system flush:', error);
} 