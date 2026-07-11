import { useState } from "react";
import { X } from "lucide-react";

export default function DeleteMemberModal({
  open,
  member,
  onClose,
  onConfirm,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  if (!open || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Remove Member</h2>

          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-slate-600">
            Remove <strong>{member.name}</strong> from this project?
          </p>

          <p className="text-sm text-slate-500 mt-2">
            They will lose access to this project immediately.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {isLoading ? "Removing..." : "Remove Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
