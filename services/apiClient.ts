
/**
 * API Client Utility
 * Handles:
 * - Exponential backoff retries
 * - Cold start detection
 * - Timeouts using AbortController
 * - Standardized error handling
 */

const DEFAULT_RETRIES = 5;
const INITIAL_DELAY = 1000; // 1 second
const TIMEOUT = 15000; // 15 seconds per request

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  onRetry?: (count: number, delay: number) => void;
}

class ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;

  constructor(message: string, status?: number, statusText?: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiClient {
  async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const {
      timeout = TIMEOUT,
      retries = DEFAULT_RETRIES,
      onRetry,
      ...fetchOptions
    } = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(id);

        if (!response.ok) {
          if ([502, 503, 504].includes(response.status) && attempt < retries) {
            throw new ApiError('Server is waking up...', response.status, response.statusText);
          }
          
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: response.statusText };
          }
          
          throw new ApiError(
            errorData.message || `Request failed with status ${response.status}`,
            response.status,
            response.statusText,
            errorData
          );
        }

        return await response.json() as T;
      } catch (err: any) {
        clearTimeout(id);
        lastError = err;

        const isTimeout = err.name === 'AbortError';
        const isNetworkError = err.name === 'TypeError';
        const isServerWaking = err instanceof ApiError && [502, 503, 504].includes(err.status || 0);

        if ((isTimeout || isNetworkError || isServerWaking) && attempt < retries) {
          const delay = INITIAL_DELAY * Math.pow(2, attempt);
          
          if (onRetry) {
            onRetry(attempt + 1, delay);
          } else {
            console.warn(`[API] Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, err.message);
          }

          await wait(delay);
          continue;
        }

        throw err;
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
