import { Bell, Search } from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { SidebarToggle } from "./Sidebar";

/**
 * Topbar - Header with search and notifications
 * Shows at top of app, above sidebar on mobile
 */
export default function Topbar({ onMenuOpen }) {
  const user = useCurrentUser();

  return (
    <header className="fixed top-0 right-0 left-0 md:left-60 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-30">
      {/* Left: Menu toggle + search */}
      <div className="flex items-center gap-4 flex-1">
        <SidebarToggle onClick={onMenuOpen} />

        {/* Search bar - hidden on mobile */}
        <div className="hidden sm:block relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Right: Notifications + user avatar */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 hover:bg-slate-100 rounded-lg"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          {/* Notification badge */}
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        {user && (
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-blue-200 transition">
            {user.initials}
          </div>
        )}
      </div>
    </header>
  );
}
