import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
// All original imports remain the same
import {
  toggleLikePost,
  reportPost,
  deletePost as apiDeletePost,
  updatePost,
  addComment,
  deleteComment as apiDeleteComment
} from "../../../../api/postsApi";
import EditPostModal from "../postcard/EditPostModal";
import PostHeader from "../postcard/PostHeader";
import PostSkills from "../postcard/PostSkills";
import PostContent from "../postcard/PostContent";
import PostImage from "../postcard/PostImage";
import PostHashtags from "../postcard/PostHashtags";
import PostInteractions from "../postcard/PostInteractions";
import PostComments from "../postcard/PostComments";
import PostCommentInput from "../postcard/PostCommentInput";
import ReportModal from "../../../../components/ReportModal";

dayjs.extend(relativeTime);

const PostCard = ({ post, currentUserId, onDelete, onUpdate }) => {
  const {
    _id,
    userId,
    content,
    mediaUrls,
    likes,
    comments: initialComments,
    createdAt,
    hashtags,
    reportCount: initialReportCount,
  } = post;

  // --- State Management ---
  const [liked, setLiked] = useState(likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [, setReportCount] = useState(initialReportCount || 0);
  const [comments, setComments] = useState(initialComments || []);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [postContent, setPostContent] = useState(content);
  const [postImage, setPostImage] = useState(mediaUrls?.[0] || null);

  const timeAgo = createdAt ? dayjs(createdAt).fromNow() : "";
  const isOwner = currentUserId === userId?._id;

  // --- Handlers (Unchanged) ---
  const handleLike = async () => {
    try {
      const res = await toggleLikePost(_id);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleReport = async (reason, description) => {
    try {
      await reportPost(_id, reason, description);
      toast.success("Post reported successfully. Our team will review it.", {
        style: {
          background: '#032f60',
          color: '#fff',
        },
      });
      setReportCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error reporting post:", err);
      toast.error(err.response?.data?.message || "Failed to report post", {
        style: {
          background: '#dc2626',
          color: '#fff',
        },
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await apiDeletePost(_id);
      if (onDelete) onDelete(_id);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleUpdatePost = async (updatedContent, updatedImage) => {
    try {
      const res = await updatePost(_id, updatedContent, updatedImage);
      setPostContent(res.data.content);
      setPostImage(res.data.mediaUrls?.[0] || null);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Error updating post:", err);
      throw err;
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await addComment(_id, commentText);
      setComments((prev) => [...prev, res.data]); 
      setCommentText("");
      setShowCommentInput(true);
      setShowAllComments(true);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await apiDeleteComment(_id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // --- UI RENDER with Increased Width ---

  return (
    <>
      {/* Post Card Container: Removed max-w-4xl to increase size */}
      <div 
        className="
          bg-white 
          rounded-xl 
          shadow-lg 
          border border-gray-100 
          w-full 
          p-6 
          mx-auto 
          transition-all duration-300 ease-in-out
          hover:shadow-xl hover:border-blue-100 
          md:p-8
        "
      >
        {/* Post Header (Profile, Name, Time, and Options Dropdown) */}
        <PostHeader
          userId={userId}
          timeAgo={timeAgo}
          isOwner={isOwner}
          onEdit={() => setShowEditModal(true)}
          onDelete={handleDelete}
          onReport={() => setShowReportModal(true)}
        />
        
        {/* Skills/Tags (Slightly separated) */}
        <div className="mt-2 mb-3">
          <PostSkills skills={userId?.skills} />
        </div>

        {/* Post Content */}
        <PostContent content={postContent} />
        
        {/* Post Image */}
        <PostImage
          imageUrl={postImage}
          showFullImage={showFullImage}
          setShowFullImage={setShowFullImage}
        />
        
        {/* Hashtags */}
        <PostHashtags hashtags={hashtags} />

        {/* --- Interaction Bar (Modern Separator) --- */}
        <div className="py-2 mt-3 border-y border-gray-100">
          <PostInteractions
            likeCount={likeCount}
            liked={liked}
            commentsCount={comments.length}
            isOwner={isOwner}
            onLike={handleLike}
            onComment={() => setShowCommentInput(!showCommentInput)}
            onReport={() => setShowReportModal(true)}
            showCommentInput={showCommentInput}
            showAllComments={showAllComments}
            setShowAllComments={setShowAllComments}
          />
        </div>
        
        {/* Comments Section */}
        <PostComments
          comments={comments}
          currentUserId={currentUserId}
          showAllComments={showAllComments}
          setShowAllComments={setShowAllComments}
          onDeleteComment={handleDeleteComment}
        />

        {/* Comment Input */}
        {(showCommentInput || comments.length > 0) && (
          <PostCommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            onAddComment={handleAddComment}
          />
        )}
      </div>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialContent={postContent}
        initialImage={postImage}
        onUpdate={handleUpdatePost}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
      />
    </>
  );
};

export default PostCard;