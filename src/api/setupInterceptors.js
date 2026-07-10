import apiClient from "./client";
import { getTokens, setTokens } from "../services/authStore";
import { notifySessionExpired } from "../services/authStore";

/**
 * Setup interceptors for:
 * 1. Adding auth token to every request
 * 2. Refreshing token when expired
 * 3. Redirecting to login on 401
 */

let isRefreshing = false;
let refreshQueue = [];

/**
 * Process queued requests after token refresh
 */
function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  refreshQueue = [];
}

/**
 * Request Interceptor - Add token to every request
 */
export function setupInterceptors() {
  const requestInterceptor = apiClient.interceptors.request.use(
    (config) => {
      if (config.url === "/auth/refresh") {
        return config;
      }

      const tokens = getTokens();
      if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  /**
   * Response Interceptor - Handle errors and refresh token
   */
  const responseInterceptor = apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If not a 401, reject immediately
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // If already retried this request, don't try again
      if (originalRequest._retry) {
        notifySessionExpired();
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      // Start refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = getTokens();
        if (!tokens?.refreshToken) {
          notifySessionExpired();
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const response = await apiClient.post("/auth/refresh", {
          refreshToken: tokens.refreshToken,
        });

        const newTokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };

        // Store new tokens
        setTokens(newTokens);

        // Process queued requests
        processQueue(null, newTokens.accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        processQueue(refreshError, null);
        notifySessionExpired();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );

  return () => {
    apiClient.interceptors.request.eject(requestInterceptor);

    apiClient.interceptors.response.eject(responseInterceptor);
  };
}

export default apiClient;
