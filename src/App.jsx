import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PublicOnlyRoute from "./components/routing/PublicOnlyRoute";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./layouts/AppLayout";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ProjectMembersPage from "./components/members/ProjectMembersPage";

export default function App() {
  const { isLoading } = useAuth();

  // While restoring auth state, show nothing
  if (isLoading) {
    return null;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes - only accessible when NOT logged in */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes - only accessible when logged in */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route
                path="/projects/:projectId/members"
                element={<ProjectMembersPage />}
              />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-right" />
    </>
  );
}
