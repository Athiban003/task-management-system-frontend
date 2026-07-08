import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * PublicOnlyRoute - Wrapper for auth pages that shouldn't be accessible when logged in
 *
 * Usage:
 * <Route element={<PublicOnlyRoute />}>
 *   <Route path="/login" element={<LoginPage />} />
 *   <Route path="/register" element={<RegisterPage />} />
 * </Route>
 *
 * If user is already logged in, redirects to /dashboard
 */
export default function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // While checking if user is logged in, show nothing
  if (isLoading) {
    return null;
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, allow access to login/register
  return <Outlet />;
}
