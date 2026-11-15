import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retryCount?: number;
  _retryProxy?: boolean;
};

const MAX_GET_RETRIES = 2;
const INITIAL_RETRY_DELAY_MS = 500;

// Base API URL from environment variables, or empty string to utilize Vite's dev proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5121';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // AI triage can take 5-15 seconds for Gemini tool calling
});

// Automatic dev fallback to Vite dev proxy if direct CORS / self-signed certificate fails
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      import.meta.env.DEV &&
      originalRequest &&
      originalRequest.method?.toUpperCase() === 'GET' &&
      !originalRequest._retryProxy &&
      error.message === 'Network Error' &&
      originalRequest.baseURL &&
      originalRequest.baseURL.startsWith('http')
    ) {
      originalRequest._retryProxy = true;
      console.warn(
        `[SupportAI] Direct request to ${originalRequest.baseURL} failed (likely CORS or self-signed dev certificate). Retrying via Vite local dev proxy...`
      );
      originalRequest.baseURL = '';
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    if (
      !originalRequest ||
      originalRequest.method?.toUpperCase() !== 'GET' ||
      !isRetryableGetError(error)
    ) {
      throw error;
    }

    const retryCount = originalRequest._retryCount ?? 0;
    if (retryCount >= MAX_GET_RETRIES) {
      throw error;
    }

    originalRequest._retryCount = retryCount + 1;
    const delay = INITIAL_RETRY_DELAY_MS * 2 ** retryCount;
    await new Promise<void>((resolve) => setTimeout(resolve, delay));

    if (originalRequest.signal?.aborted) {
      throw error;
    }

    return apiClient(originalRequest);
  }
);

function isRetryableGetError(error: AxiosError): boolean {
  if (error.code === 'ERR_CANCELED') {
    return false;
  }

  if (!error.response) {
    return (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      error.message === 'Network Error'
    );
  }

  return [408, 425, 429, 500, 502, 503, 504].includes(error.response.status);
}

// Helper to extract a friendly error message from Axios errors
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string; title?: string }>;
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message;
    }
    if (axiosErr.response?.data?.title) {
      return axiosErr.response.data.title;
    }
    if (axiosErr.message === 'Network Error') {
      return (
        'Network Error: Unable to reach the backend API. Please verify the backend is running at ' +
        (API_BASE_URL || 'http://localhost:5121') +
        ' and that CORS or local certificates are configured.'
      );
    }
    return axiosErr.message || 'An unexpected API error occurred.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}
