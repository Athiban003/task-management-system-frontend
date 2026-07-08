/**
 * Decode JWT payload without verification
 * Safe to do because JWT was already verified by backend
 *
 * @param {string} token
 * @returns {Record<string, unknown> | null}
 */
export function decodeJwt(token) {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Convert base64url to base64
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64
    const json = atob(
      base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Get user email from JWT
 * @param {string} token
 * @returns {string | null}
 */
export function getUserEmailFromToken(token) {
  const payload = decodeJwt(token);
  return payload?.sub || null; // 'sub' is the standard JWT subject claim (usually email)
}

/**
 * Get user ID from JWT
 * @param {string} token
 * @returns {number | null}
 */
export function getUserIdFromToken(token) {
  const payload = decodeJwt(token);
  return payload?.userId ? Number(payload.userId) : null;
}

/**
 * Get user role from JWT
 * @param {string} token
 * @returns {string | null}
 */
export function getUserRoleFromToken(token) {
  const payload = decodeJwt(token);
  return payload?.role || null;
}

/**
 * Extract name parts from email
 * Example: "alex.rivera@company.com" → "Alex Rivera"
 * @param {string} email
 * @returns {string}
 */
export function getDisplayNameFromEmail(email) {
  if (!email) return "User";
  const local = email.split("@")[0] || email;
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Get initials from email
 * Example: "alex.rivera@company.com" → "AR"
 * @param {string} email
 * @returns {string}
 */
export function getInitialsFromEmail(email) {
  const name = getDisplayNameFromEmail(email);
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
