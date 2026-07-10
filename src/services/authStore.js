/**
 * In-memory token storage (cleared on page refresh)
 * This is the source of truth during runtime
 */
let tokens = null;

/**
 * Session expired callback
 */
let sessionExpiredCallback = null;

/**
 * Get current tokens from memory
 * @returns {{accessToken: string, refreshToken: string} | null}
 */
export function getTokens() {
  return tokens;
}

/**
 * Store tokens in memory AND localStorage
 * @param {{accessToken: string, refreshToken: string}} newTokens
 */
export function setTokens(newTokens) {
  tokens = newTokens;
  if (newTokens) {
    localStorage.setItem("auth_tokens", JSON.stringify(newTokens));
  }
}

/**
 * Clear tokens from memory AND localStorage
 */
export function clearTokens() {
  tokens = null;
  localStorage.removeItem("auth_tokens");
}

/**
 * Restore tokens from localStorage on app startup
 * @returns {{accessToken: string, refreshToken: string} | null}
 */
export function restoreTokens() {
  const stored = localStorage.getItem("auth_tokens");
  if (stored) {
    try {
      tokens = JSON.parse(stored);
      return tokens;
    } catch {
      localStorage.removeItem("auth_tokens");
      return null;
    }
  }
  return null;
}

/**
 * Register callback for when session expires
 * @param {() => void} callback
 */
export function onSessionExpired(callback) {
  sessionExpiredCallback = callback;
}

/**
 * Notify that session has expired (token refresh failed)
 * Clears tokens and calls the callback
 */
export function notifySessionExpired() {
  clearTokens();
  sessionExpiredCallback?.();
}
