import React from "react";

const PostContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="px-4 md:px-6 pb-3">
      <p className="text-gray-800 text-sm md:text-[15px] leading-relaxed break-words whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
};

export default PostContent;
