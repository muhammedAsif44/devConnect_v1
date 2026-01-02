import React from "react";

const PostHashtags = ({ hashtags }) => {
  if (!hashtags || hashtags.length === 0) return null;

  return (
    <div className="px-4 md:px-6 py-2 flex flex-wrap gap-2">
      {hashtags.map((tag, idx) => (
        <span
          key={idx}
          className="text-xs text-sky-600 hover:text-sky-700 hover:underline cursor-pointer font-medium"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default PostHashtags;
