import apiClient from "./client";

/**
 * Fetch paginated list of projects
 * @param {number} [page=0]
 * @param {number} [size=20]
 * @returns {Promise<{content: Array, totalElements: number, totalPages: number}>}
 */
export async function getProjectsRequest(page = 0, size = 20) {
  const response = await apiClient.get("/api/projects", {
    params: { page, size },
  });
  return response.data;
}

/**
 * Fetch single project by ID
 * @param {number} id
 * @returns {Promise<{id, name, description, deadline, status, createdAt}>}
 */
export async function getProjectRequest(id) {
  const response = await apiClient.get(`/api/projects/${id}`);
  return response.data;
}

/**
 * Create a new project
 * @param {Object} data - {name, description, deadline}
 * @returns {Promise<void>}
 */
export async function createProjectRequest(data) {
  const response = await apiClient.post("/api/projects", data);
  return response.data;
}

/**
 * Update existing project
 * @param {number} id
 * @param {Object} data - {name, description, deadline}
 * @returns {Promise<void>}
 */
export async function updateProjectRequest(id, data) {
  const response = await apiClient.put(`/api/projects/${id}`, data);
  return response.data;
}

/**
 * Update project status
 * @param {number} id
 * @param {string} status - 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'
 * @returns {Promise<void>}
 */
export async function updateProjectStatusRequest(id, status) {
  const response = await apiClient.patch(`/api/projects/${id}/status`, {
    status,
  });
  return response.data;
}

/**
 * Delete project
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteProjectRequest(id) {
  const response = await apiClient.delete(`/api/projects/${id}`);
  return response.data;
}
