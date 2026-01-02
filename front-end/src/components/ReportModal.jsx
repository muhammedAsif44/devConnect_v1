import React, { useState } from "react";
import { X, Flag, AlertTriangle } from "lucide-react";

const REPORT_REASONS = [
  { value: "Spam/Promotional", label: "Spam/Promotional", icon: "📢" },
  { value: "Inappropriate Content", label: "Inappropriate Content", icon: "⚠️" },
  { value: "Harassment", label: "Harassment", icon: "🚫" },
  { value: "Misinformation", label: "Misinformation", icon: "❌" },
  { value: "Off-topic Content", label: "Off-topic Content", icon: "📋" },
  { value: "Other", label: "Other", icon: "📝" },
];

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("Please select a reason for reporting");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(selectedReason, description);
      // Reset form
      setSelectedReason("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Flag size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Report Post</h2>
                <p className="text-sm text-white/90">Help us keep the community safe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Banner */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-amber-800 font-medium">
                False reports may result in action against your account
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Please only report content that violates our community guidelines
              </p>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Why are you reporting this post? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  type="button"
                  onClick={() => setSelectedReason(reason.value)}
                  disabled={submitting}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                    selectedReason === reason.value
                      ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="text-2xl">{reason.icon}</span>
                  <span className="font-medium text-gray-900">{reason.label}</span>
                  {selectedReason === reason.value && (
                    <div className="ml-auto w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              placeholder="Provide more context about why you're reporting this post..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              rows="4"
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedReason || submitting}
            className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              !selectedReason || submitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg"
            }`}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Flag size={16} />
                Submit Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
