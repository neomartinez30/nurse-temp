import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Error types for better handling
export enum ErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  SERVER = 'server',
  AUTH = 'authentication',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

export interface ApiError {
  type: ErrorType;
  status?: number;
  message: string;
  originalError?: any;
  data?: any;
}

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15 seconds timeout
});

// Request tracking for cancelling outdated requests
const pendingRequests = new Map<string, AbortController>();

const getRequestKey = (config: AxiosRequestConfig): string => {
  const { url, method, params } = config;
  return `${method}:${url}:${JSON.stringify(params || {})}`;
};

// Request interceptor for tracking and cancellation
apiClient.interceptors.request.use(
  (config) => {
    // Cancel previous identical requests
    const requestKey = getRequestKey(config);
    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey)?.abort();
    }
    
    // Create new abort controller
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestKey, controller);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with enhanced error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Clean up request tracking
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);
    
    // Validate response data
    if (!response.data) {
      throw createApiError({
        type: ErrorType.VALIDATION,
        message: 'Response data is empty',
        status: response.status,
        data: response
      });
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Clean up request tracking if possible
    if (error.config) {
      const requestKey = getRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }
    
    // Transform error to structured ApiError
    const apiError = createApiErrorFromAxios(error);
    console.error('API Error:', apiError);
    
    return Promise.reject(apiError);
  }
);

// Helper to create ApiError from AxiosError
const createApiErrorFromAxios = (error: AxiosError): ApiError => {
  if (error.code === 'ECONNABORTED') {
    return createApiError({
      type: ErrorType.TIMEOUT,
      message: 'Request timed out',
      originalError: error
    });
  }
  
  if (error.code === 'ERR_NETWORK') {
    return createApiError({
      type: ErrorType.NETWORK,
      message: 'Network error occurred',
      originalError: error
    });
  }
  
  if (error.response) {
    const status = error.response.status;
    
    if (status === 401 || status === 403) {
      return createApiError({
        type: ErrorType.AUTH,
        status,
        message: 'Authentication error',
        data: error.response.data,
        originalError: error
      });
    }
    
    if (status === 400 || status === 422) {
      return createApiError({
        type: ErrorType.VALIDATION, 
        status,
        message: 'Validation error',
        data: error.response.data,
        originalError: error
      });
    }
    
    if (status >= 500) {
      return createApiError({
        type: ErrorType.SERVER,
        status,
        message: 'Server error',
        data: error.response.data,
        originalError: error
      });
    }
  }
  
  return createApiError({
    type: ErrorType.UNKNOWN,
    message: error.message || 'Unknown error',
    originalError: error
  });
};

// Helper to create ApiError
const createApiError = (params: Partial<ApiError> & { message: string }): ApiError => {
  return {
    type: params.type || ErrorType.UNKNOWN,
    message: params.message,
    status: params.status,
    data: params.data,
    originalError: params.originalError
  };
};

// Simple in-memory cache with expiration
const cache = new Map<string, { data: any, expiry: number }>();
const DEFAULT_CACHE_TIME = 60 * 1000; // 1 minute

const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
};

const setCached = <T>(key: string, data: T, ttl = DEFAULT_CACHE_TIME): void => {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl
  });
};

export const api = {
  async getCallerInfo(phoneNumber: string, useCache = true): Promise<any> {
    try {
      const cacheKey = `caller:${phoneNumber}`;
      
      // Try to get from cache first if useCache is true
      if (useCache) {
        const cachedData = getCached(cacheKey);
        if (cachedData) return cachedData;
      }
      
      const response = await apiClient.get(`/caller/${phoneNumber}`);
      
      // Validate response data structure
      if (!response.data) {
        throw createApiError({
          type: ErrorType.VALIDATION,
          message: 'Invalid caller data response'
        });
      }
      
      // Cache response
      setCached(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      if ((error as ApiError).type) {
        throw error;
      }
      
      throw createApiError({
        type: ErrorType.UNKNOWN,
        message: 'Failed to fetch caller info',
        originalError: error
      });
    }
  },

  async updateCallerInfo(tableId: string, key: string, data: any): Promise<any> {
    try {
      const cacheKey = `caller:${key}`;
      
      // Invalidate cache for this caller
      cache.delete(cacheKey);
      
      const response = await apiClient.put(`/datatable/${tableId}/${key}`, data);
      
      if (!response.data) {
        throw createApiError({
          type: ErrorType.VALIDATION,
          message: 'Invalid update response'
        });
      }
      
      // Update cache with new data
      setCached(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      if ((error as ApiError).type) {
        throw error;
      }
      
      throw createApiError({
        type: ErrorType.UNKNOWN,
        message: 'Failed to update caller info',
        originalError: error
      });
    }
  },

  async getDataTableValue(tableId: string, key: string, useCache = true): Promise<any> {
    try {
      const cacheKey = `datatable:${tableId}:${key}`;
      
      // Try to get from cache first if useCache is true
      if (useCache) {
        const cachedData = getCached(cacheKey);
        if (cachedData) return cachedData;
      }
      
      const response = await apiClient.get(`/datatable/${tableId}/${key}`);
      
      if (!response.data) {
        throw createApiError({
          type: ErrorType.VALIDATION,
          message: 'Invalid data table response'
        });
      }
      
      // Cache response
      setCached(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      if ((error as ApiError).type) {
        throw error;
      }
      
      throw createApiError({
        type: ErrorType.UNKNOWN,
        message: 'Failed to fetch data table value',
        originalError: error
      });
    }
  },
  
  // Helper to clear cache
  clearCache() {
    cache.clear();
  },
  
  // Helper to clear specific cache entry
  clearCacheEntry(key: string) {
    cache.delete(key);
  }
};