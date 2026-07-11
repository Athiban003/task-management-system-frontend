import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateMemberRoleRequest } from "../../api/membersApi";
import { ROLES, ROLE_LABELS } from "../../utils/roles";
import { showSuccess, showError } from "../../utils/toast";

/**
 * UpdateRoleModal - Change member role
 */
export default function UpdateRoleModal({
  open,
  projectId,
  member,
  onClose,
  onRoleUpdated,
}) {
  const [role, setRole] = useState(ROLES.VIEWER);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (member) {
      setRole(member.role);
      setFormError(null);
    }
  }, [member, open]);

  const handleSubmit = async () => {
    if (!member) return;

    setIsLoading(true);
    setFormError(null);

    try {
      await updateMemberRoleRequest(projectId, member.userId, role);
      showSuccess("Member role updated successfully");
      onClose();
      onRoleUpdated();
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to update role";
      setFormError({ detail: message });
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open || !member) return null;

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
            Update Role for {member.name || `User #${member.userId}`}
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
        <div className="px-6 py-4 space-y-4">
          {/* Error alert */}
          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {formError.detail}
            </div>
          )}

          {/* Role select */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isLoading ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
