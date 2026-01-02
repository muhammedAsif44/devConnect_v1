import React, { useState, useEffect } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Modal from "../Modal";
import Shimmer from "../../../../components/Shimmer";

const EditPostModal = ({ 
  isOpen, 
  onClose, 
  initialContent = "", 
  initialImage = null,
  onUpdate 
}) => {
  const [content, setContent] = useState(initialContent);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [removeImage, setRemoveImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Update state when modal opens with new values
  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setImagePreview(initialImage);
      setImageFile(null);
      setRemoveImage(false);
    }
  }, [isOpen, initialContent, initialImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imagePreview) {
      alert("Post must have either text or an image");
      return;
    }

    setSubmitting(true);
    try {
      await onUpdate(content, imageFile || (removeImage ? null : initialImage));
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post: " + (error.response?.data?.error || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post" size="md">
      <div className="p-6 bg-white">
        {/* Content Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none text-sm md:text-base text-gray-800 bg-white"
          rows="5"
          style={{ minHeight: "120px", maxHeight: "300px" }}
          onInput={(e) => {
            e.target.style.height = "120px";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4 relative inline-block w-full">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain rounded-xl border-2 border-gray-200 bg-gray-50"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all shadow-lg"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Upload Button */}
        {!imagePreview && (
          <div className="mt-4">
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-sky-400 transition-all bg-white">
              <ImagePlus className="w-5 h-5 text-sky-600" />
              <span className="text-sm font-medium text-gray-700">
                Add Photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || (!content.trim() && !imagePreview)}
          className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            submitting || (!content.trim() && !imagePreview)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-sky-600 text-white hover:bg-sky-700 shadow-md"
          }`}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Shimmer type="circle" className="w-4 h-4" />
              Updating...
            </span>
          ) : (
            "Update Post"
          )}
        </button>
      </div>
    </Modal>
  );
};

export default EditPostModal;
