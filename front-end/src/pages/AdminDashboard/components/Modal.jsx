 import React from "react";
function Modal({ isOpen, onClose, title, children, onConfirm, confirmText = "Save", isDanger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        {children}
        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onClose && typeof onClose === 'function') {
                onClose();
              }
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onConfirm && typeof onConfirm === 'function') {
                onConfirm();
              }
            }}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              isDanger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal
