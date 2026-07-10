import { useState } from "react";
import { X } from "lucide-react";
import { deleteProjectRequest } from "../../api/projectsApi";
import { showSuccess, showError } from "../../utils/toast";

/**
 * DeleteProjectModal - Confirmation modal for deleting project
 */
export default function DeleteProjectModal({
  open,
  project,
  onClose,
  onProjectDeleted,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!project) return;

    setIsLoading(true);

    try {
      await deleteProjectRequest(project.id);
      showSuccess("Project deleted successfully");
      onClose();
      onProjectDeleted(); // Refresh projects list
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to delete project";
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Delete Project
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-slate-600">
            Are you sure you want to delete <strong>{project.name}</strong>?
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isLoading ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
