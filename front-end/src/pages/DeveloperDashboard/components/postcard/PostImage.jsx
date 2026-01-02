import React from "react";
import { X } from "lucide-react";

const PostImage = ({ imageUrl, showFullImage, setShowFullImage }) => {
  if (!imageUrl) return null;

  return (
    <>
      {/* Image Display */}
      <div className="w-full bg-gradient-to-b from-gray-900 to-black">
        <div
          className="relative w-full flex items-center justify-center cursor-pointer group"
          onClick={() => setShowFullImage(true)}
        >
          <img
            src={imageUrl}
            alt="Post media"
            className="max-w-full h-auto transition-opacity duration-200 group-hover:opacity-95"
            style={{
              display: "block",
              maxHeight: "700px",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400/e5e7eb/6b7280?text=Image+Not+Found";
            }}
          />
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={imageUrl}
            alt="Post media full"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullImage(false);
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default PostImage;
