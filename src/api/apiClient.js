/**
 * Unified API Client for TaskFlow
 * Provides centralized fetch configuration, timeouts, header management, and error handling.
 */

export const DEFAULT_API_BASE_URL = 'https://task-manager-api-dplt.onrender.com/api';
export const DEFAULT_API_BASE = DEFAULT_API_BASE_URL;
export const STORAGE_KEY_API_URL = 'taskflow_custom_api_url';


export function getApiBaseUrl() {
  const customUrl = localStorage.getItem(STORAGE_KEY_API_URL);
  if (customUrl && customUrl.trim() !== '') {
    return customUrl.trim().replace(/\/+$/, '');
  }
  return DEFAULT_API_BASE_URL;
}

export function setApiBaseUrl(url) {
  if (!url || url.trim() === '' || url.trim() === DEFAULT_API_BASE_URL) {
    localStorage.removeItem(STORAGE_KEY_API_URL);
  } else {
    localStorage.setItem(STORAGE_KEY_API_URL, url.trim().replace(/\/+$/, ''));
  }
}

/**
 * Universal request wrapper with 15-second timeout and structured error extraction.
 */
export async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 15000);

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        `HTTP Request Failed with status ${response.status} (${response.statusText})`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      const timeoutErr = new Error(`Request timed out. The server at ${baseUrl} is taking too long to respond.`);
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }

    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      const networkErr = new Error(`Unable to connect to the TaskFlow REST API at ${baseUrl}. Please check your connection or CORS settings.`);
      networkErr.isNetworkError = true;
      throw networkErr;
    }

    throw error;
  }
}
