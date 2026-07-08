import toast from "react-hot-toast";

/**
 * Show success toast
 * @param {string} message
 */
export function showSuccess(message) {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
  });
}

/**
 * Show error toast
 * @param {string} message
 */
export function showError(message) {
  toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
}

/**
 * Show loading toast (for long operations)
 * @param {string} message
 * @returns {string} - Toast ID to dismiss later
 */
export function showLoading(message) {
  return toast.loading(message, {
    position: "top-right",
  });
}

/**
 * Dismiss a specific toast
 * @param {string} toastId
 */
export function dismissToast(toastId) {
  toast.dismiss(toastId);
}
