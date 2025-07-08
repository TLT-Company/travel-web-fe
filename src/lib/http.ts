import { redirect } from 'next/navigation';
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

const injectToken = (
  headers: HeadersInit = {},
  withAuth: boolean = true
): HeadersInit => {
  const token = localStorage.getItem("accessTokenTravel");

  if (withAuth) {
    if (!token) {
      throw new ApiError("Bạn chưa đăng nhập", 401);
    }

    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return headers;
};


// HTTP methods
class Http {
  async get<T = any>(endpoint: string, options: RequestInit & { withAuth?: boolean } = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    const withAuth = options.withAuth !== false; 
    const headers = injectToken({
      ...API_CONFIG.HEADERS,
      ...options.headers,
    }, withAuth);
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response.json();
  }

  async post<T = any>(endpoint: string, data: any,  options: RequestInit & { withAuth?: boolean } = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    const withAuth = options.withAuth !== false;
    const headers = injectToken({
      ...API_CONFIG.HEADERS,
      ...options.headers,
    }, withAuth);
    const response = await fetch(url, {
      method: 'POST',
      headers,
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
  }

  async put<T = any>(endpoint: string, data: any, options: RequestInit & { withAuth?: boolean } = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    const withAuth = options.withAuth !== false;
    const headers = injectToken({
      ...API_CONFIG.HEADERS,
      ...options.headers,
    }, withAuth);
    const response = await fetch(url, {
      method: 'PUT',
      headers,
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
  }

  async patch<T = any>(endpoint: string, data: any, options: RequestInit & { withAuth?: boolean } = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    const withAuth = options.withAuth !== false;
    const headers = injectToken({
      ...API_CONFIG.HEADERS,
      ...options.headers,
    }, withAuth);
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
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
  }

  async delete<T = any>(endpoint: string, options: RequestInit & { withAuth?: boolean } = {}): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    const withAuth = options.withAuth !== false;
    const headers = injectToken({
      ...API_CONFIG.HEADERS,
      ...options.headers,
    }, withAuth);
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response.json();
  }
}

export const http = new Http();

