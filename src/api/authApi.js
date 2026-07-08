import apiClient from "./client";

/**
 * Send registration request to backend
 * @param {Object} data - { name, email, password }
 * @returns {Promise<string>} - Success message
 */
export async function registerRequest(data) {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
}

/**
 * Send login request to backend
 * @param {Object} data - { email, password }
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
export async function loginRequest(data) {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
}
