import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserEmailFromToken,
  getUserIdFromToken,
  getUserRoleFromToken,
  getDisplayNameFromEmail,
  getInitialsFromEmail,
} from "../utils/jwtUtils";

/**
 * Get current logged-in user info
 * Decodes JWT and returns user details
 *
 * @returns {{
 *   email: string,
 *   userId: number | null,
 *   role: string | null,
 *   displayName: string,
 *   initials: string,
 * } | null}
 */
export function useCurrentUser() {
  const { tokens } = useAuth();

  return useMemo(() => {
    if (!tokens?.accessToken) return null;

    const email = getUserEmailFromToken(tokens.accessToken);
    if (!email) return null;

    return {
      email,
      userId: getUserIdFromToken(tokens.accessToken),
      role: getUserRoleFromToken(tokens.accessToken),
      displayName: getDisplayNameFromEmail(email),
      initials: getInitialsFromEmail(email),
    };
  }, [tokens?.accessToken]);
}
