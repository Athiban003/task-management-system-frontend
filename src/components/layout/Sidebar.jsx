import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { showSuccess } from "../../utils/toast";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", path: "/projects", icon: FolderKanban },
];

/**
 * Sidebar - Navigation menu
 * Shows on desktop (always visible)
 * Shows on mobile (opens/closes with toggle)
 */
export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { logout } = useAuth();
  const user = useCurrentUser();

  const handleLogout = () => {
    onMobileClose();
    logout();
    showSuccess("Logged out successfully");
  };

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div className="px-6 py-8 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-blue-600">TaskStream</h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
          Pro
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/dashboard"}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200 p-4 space-y-3">
        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 px-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Settings & Logout */}
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Always visible */}
      <aside className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar - Opens/closes */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            onClick={onMobileClose}
            className="absolute inset-0 bg-black/50"
            aria-label="Close sidebar"
          />

          {/* Sidebar */}
          <aside className="relative flex flex-col w-64 h-full bg-white shadow-lg">
            {/* Close button */}
            <button
              type="button"
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>

            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

/**
 * Mobile Menu Toggle Button
 * Shows only on mobile, triggers sidebar open
 */
export function SidebarToggle({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
