import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

/**
 * AppLayout - Main layout for authenticated pages
 * Contains: Sidebar + Topbar + page content
 *
 * Usage:
 * <Route element={<AppLayout />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 *   <Route path="/projects" element={<ProjectsPage />} />
 * </Route>
 */
export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-60">
        {/* Topbar */}
        <Topbar onMenuOpen={() => setMobileOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-auto pt-16">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
