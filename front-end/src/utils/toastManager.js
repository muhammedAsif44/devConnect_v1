import toast from "react-hot-toast";

// Toast state management to prevent duplicates
const toastQueue = new Map(); // message -> timestamp
const DEBOUNCE_WINDOW = 2000; // 2 seconds

/**
 * Global toast manager that prevents identical messages from stacking
 * @param {string} message - Toast message
 * @param {string} type - 'success' | 'error' | 'loading' | 'custom'
 * @param {number} duration - Toast duration in ms (default: 5000)
 */
export const showToast = (message, type = 'success', duration = 5000) => {
  const key = `${type}:${message}`;
  const now = Date.now();
  const lastShownTime = toastQueue.get(key);

  // Check if identical toast was shown recently
  if (lastShownTime && now - lastShownTime < DEBOUNCE_WINDOW) {
    return; // Skip showing duplicate
  }

  // Update the timestamp
  toastQueue.set(key, now);

  // Clean up old entries to prevent memory leak
  if (toastQueue.size > 50) {
    const oldestKey = Array.from(toastQueue.entries())
      .sort((a, b) => a[1] - b[1])[0][0];
    toastQueue.delete(oldestKey);
  }

  // Show the toast based on type
  switch (type) {
    case 'error':
      toast.error(message, { duration });
      break;
    case 'success':
      toast.success(message, { duration });
      break;
    case 'loading':
      toast.loading(message);
      break;
    default:
      toast(message, { duration });
  }
};

/**
 * Show error toast with deduplication
 */
export const showError = (message, duration = 5000) => {
  showToast(message, 'error', duration);
};

/**
 * Show success toast with deduplication
 */
export const showSuccess = (message, duration = 3000) => {
  showToast(message, 'success', duration);
};

/**
 * Show loading toast (no auto-dismiss)
 */
export const showLoading = (message) => {
  return showToast(message, 'loading');
};

/**
 * Clear all toasts
 */
export const clearAllToasts = () => {
  toast.remove();
  toastQueue.clear();
};
