import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute - Wrapper for routes that require authentication
 *
 * Usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 *
 * If user is not logged in, redirects to /login
 * If user is loading (restoring tokens), shows nothing
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // While checking if user is logged in, show nothing
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
}
