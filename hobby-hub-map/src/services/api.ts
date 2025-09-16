// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5256/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.client.post('/auth/refresh', refreshToken);
              const newToken = response.data.data;
              localStorage.setItem('accessToken', newToken);
              
              // Retry the original request
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return this.client.request(error.config);
            } catch (refreshError) {
              // Refresh failed, redirect to login
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          } else {
            // No refresh token, redirect to login
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Request failed');
    }
    return response.data.data!;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Request failed');
    }
    return response.data.data!;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Request failed');
    }
    return response.data.data!;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Request failed');
    }
    return response.data.data!;
  }

  // Method to make raw requests when you need the full response
  async raw<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.request({
      method,
      url,
      data,
    });
  }
}

export const apiClient = new ApiClient();

















// import { config } from '@/config/environment';

// const API_BASE_URL = config.apiBaseUrl;

// export interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   errors?: Record<string, string[]>;
// }

// class ApiClient {
//   private baseURL: string;

//   constructor(baseURL: string) {
//     this.baseURL = baseURL;
//   }

//   private async request<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<ApiResponse<T>> {
//     const url = `${this.baseURL}${endpoint}`;
    
//     const token = localStorage.getItem('token');
    
//     const config: RequestInit = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { Authorization: `Bearer ${token}` }),
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);
//       const data = await response.json();

//       if (!response.ok) {
//         return {
//           success: false,
//           message: data.message || 'An error occurred',
//           errors: data.errors,
//         };
//       }

//       return {
//         success: true,
//         data: data.data || data,
//         message: data.message,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Network error occurred',
//       };
//     }
//   }

//   async get<T>(endpoint: string): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, { method: 'GET' });
//   }

//   async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, {
//       method: 'POST',
//       body: data ? JSON.stringify(data) : undefined,
//     });
//   }

//   async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, {
//       method: 'PUT',
//       body: data ? JSON.stringify(data) : undefined,
//     });
//   }

//   async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, { method: 'DELETE' });
//   }
// }

// export const apiClient = new ApiClient(API_BASE_URL);
