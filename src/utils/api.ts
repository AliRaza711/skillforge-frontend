import axios from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track token refreshing process
let isRefreshing = false;
// Queue to hold failed requests while refreshing the token
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// Helper to process the queue of failed requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach the JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Custom interface to extend AxiosRequestConfig to include _retry
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Response Interceptor: Handle 401 and attempt token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Guard to ensure originalRequest exists and has a response status
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // If we are already refreshing, push the request configuration to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to call the refresh endpoint
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;

        if (newAccessToken) {
          // Update store
          useAuthStore.getState().setAccessToken(newAccessToken);

          // Retry the original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // Process the rest of the queue
          processQueue(null, newAccessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed -> Force logout user
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
