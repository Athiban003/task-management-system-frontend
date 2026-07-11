import apiClient from "./client";

/**
 * Fetch members of a project
 * @param {number} projectId
 * @param {number} [page=0]
 * @param {number} [size=100]
 * @returns {Promise<{content: Array, totalElements: number}>}
 */
export async function getMembersRequest(projectId, page = 0, size = 100) {
  const response = await apiClient.get(`/api/projects/${projectId}/members`, {
    params: { page, size },
  });
  return response.data;
}

/**
 * Add member to project
 * @param {number} projectId
 * @param {{userId: number, role: string}} data
 * @returns {Promise<void>}
 */
export async function addMemberRequest(projectId, data) {
  const response = await apiClient.post(
    `/api/projects/${projectId}/members`,
    data,
  );
  return response.data;
}

/**
 * Remove member from project
 * @param {number} projectId
 * @param {number} userId
 * @returns {Promise<void>}
 */
export async function removeMemberRequest(projectId, userId) {
  const response = await apiClient.delete(
    `/api/projects/${projectId}/members/${userId}`,
  );
  return response.data;
}

/**
 * Update member role
 * @param {number} projectId
 * @param {number} userId
 * @param {string} role - 'VIEWER', 'EDITOR', 'OWNER'
 * @returns {Promise<void>}
 */
export async function updateMemberRoleRequest(projectId, userId, role) {
  const response = await apiClient.patch(
    `/api/projects/${projectId}/members/${userId}/role`,
    { role },
  );
  return response.data;
}
