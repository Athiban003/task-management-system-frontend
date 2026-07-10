import { Calendar, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const statusColors = {
  ACTIVE: "bg-green-100 text-green-700",
  ON_HOLD: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-slate-100 text-slate-700",
};

/**
 * ProjectCard - Display single project
 * @param {Object} props
 * @param {{id, name, description, deadline, status}} props.project
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 */
export default function ProjectCard({ project, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 truncate">
            {project.name}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Status badge + menu */}
        <div className="flex items-center gap-2 ml-4">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[project.status] || statusColors.ACTIVE}`}
          >
            {project.status}
          </span>

          {/* Menu button */}
          <div ref={menuRef} className="relative group">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-1 hover:bg-slate-100 rounded-lg"
              aria-label="Project actions"
            >
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                <button
                  type="button"
                  onClick={() => {
                    onEdit(project);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(project);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - deadline */}
      <div className="flex items-center gap-2 text-sm text-slate-600 pt-4 border-t border-slate-100">
        <Calendar className="h-4 w-4" />
        <span>Due {project.deadline}</span>
      </div>
    </div>
  );
}
