import { API_CONFIG, buildApiUrl } from '../config/api';

// Common API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP methods
export const api = {
  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response.json();
  },

  async post<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response.json();
  },

  async put<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response.json();
  },

  async patch<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response.json();
  },

  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response.json();
  },
};

// Specific API services
export const documentExportService = {
  getAll: () => api.get('/document-export/'),
  getById: (id: number) => api.get(`/document-export/${id}/`),
  create: (data: any) => api.post('/document-export/', data),
  update: (id: number, data: any) => api.put(`/document-export/${id}/`, data),
  delete: (id: number) => api.delete(`/document-export/${id}/`),
  download: (id: number) => {
    const url = buildApiUrl(`/document-export/download/${id}/`);
    return fetch(url, {
      method: 'GET',
      headers: {
        ...API_CONFIG.HEADERS,
      },
    });
  },
};

// Add more services as needed
export const userService = {
  getAll: () => api.get('/users/'),
  getById: (id: number) => api.get(`/users/${id}/`),
  create: (data: any) => api.post('/users/', data),
  update: (id: number, data: any) => api.put(`/users/${id}/`, data),
  delete: (id: number) => api.delete(`/users/${id}/`),
}; 