import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ProjectForm from "./ProjectForm";
import { updateProjectRequest } from "../../api/projectsApi";
import { showSuccess, showError } from "../../utils/toast";

/**
 * UpdateProjectModal - Modal for editing existing project
 */
export default function UpdateProjectModal({
  open,
  project,
  onClose,
  onProjectUpdated,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values) => {
    if (!project) return;

    setIsLoading(true);
    setFormError(null);

    try {
      await updateProjectRequest(project.id, values);
      showSuccess("Project updated successfully");
      onClose();
      onProjectUpdated(); // Refresh projects list
    } catch (error) {
      const message =
        error.response?.data?.detail || "Failed to update project";
      setFormError(error.response?.data || { detail: message });
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
          <h2 className="text-lg font-semibold text-slate-900">Edit Project</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-4">
          <ProjectForm
            initialValues={{
              name: project.name,
              description: project.description,
              deadline: project.deadline,
            }}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            formError={formError}
          />
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
            onClick={() => {
              const form = document.querySelector("form");
              if (form)
                form.dispatchEvent(new Event("submit", { bubbles: true }));
            }}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isLoading ? "Updating..." : "Update Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
