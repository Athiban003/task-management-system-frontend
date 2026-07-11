import { useState } from "react";
import { X } from "lucide-react";
import { addMemberRequest } from "../../api/membersApi";
import { ROLES, ROLE_LABELS } from "../../utils/roles";
import { showSuccess, showError } from "../../utils/toast";

/**
 * AddMemberModal - Add new member to project
 */
export default function AddMemberModal({
  open,
  projectId,
  onClose,
  onMemberAdded,
}) {
  const [formData, setFormData] = useState({
    userId: "",
    role: ROLES.VIEWER,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId.trim()) {
      newErrors.userId = "User ID is required";
    } else if (Number(formData.userId) <= 0) {
      newErrors.userId = "User ID must be a positive number";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      await addMemberRequest(projectId, {
        userId: Number(formData.userId),
        role: formData.role,
      });

      showSuccess("Member added successfully");
      setFormData({ userId: "", role: ROLES.VIEWER });
      onClose();
      onMemberAdded();
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to add member";
      setFormError({ detail: message });
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

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
          <h2 className="text-lg font-semibold text-slate-900">Add Member</h2>
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
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 space-y-4"
          noValidate
        >
          {/* Error alert */}
          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {formError.detail}
            </div>
          )}

          {/* User ID field */}
          <div className="space-y-2">
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-slate-700"
            >
              User ID
            </label>
            <input
              id="userId"
              name="userId"
              type="number"
              min="1"
              placeholder="e.g., 2"
              value={formData.userId}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition ${
                errors.userId
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              } disabled:opacity-60`}
            />
            {errors.userId && (
              <p className="text-xs text-red-600">{errors.userId}</p>
            )}
          </div>

          {/* Role field */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            >
              {Object.entries(ROLES).map(([key, value]) => (
                <option key={key} value={value}>
                  {ROLE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </form>

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
            onClick={(e) => {
              const form = e.currentTarget
                .closest(".relative")
                .querySelector("form");
              if (form)
                form.dispatchEvent(new Event("submit", { bubbles: true }));
            }}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isLoading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
