import React, { useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";
import PostCard from "./components/postcard/PostCard";
import Button from "../../components/Button";
import useAuthStore from "../../ZustandStore/useAuthStore";
import toast from "react-hot-toast";
import { getPosts, createPost } from "../../api/postsApi";

export default function HomeFeed() {
  const { user } = useAuthStore();
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    getPosts()
      .then((res) => setPosts(res.data.posts || []))
      .catch(() => toast.error("Failed to fetch posts"));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handlePostSubmit = async () => {
    if ((!newPost.trim() && !imageFile) || submitting) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", newPost);
      if (imageFile) formData.append("image", imageFile);

      const res = await createPost(formData);
      setPosts((prev) => [res.data, ...prev]);

      setNewPost("");
      setImageFile(null);
      setImagePreview(null);
      toast.success("Post created successfully!");
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error(err.response?.data?.error || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    toast.success("Post deleted");
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
    toast.success("Post updated");
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="bg-[#032f60] text-white rounded-xl p-6 mb-6 w-full shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold">Community Feed</h2>
        <p className="text-sm md:text-base text-white/80 mt-1">
          Share your thoughts with developers and mentors
        </p>
      </div>

      {/* Create Post Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 w-full transition-all hover:shadow-md">
        <div className="p-4 md:p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-semibold text-white bg-gradient-to-br from-sky-400 to-blue-500 flex-shrink-0 overflow-hidden shadow-sm">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  e.target.parentElement.textContent = getUserInitials();
                }}
              />
            ) : (
              getUserInitials()
            )}
          </div>
          <button
            onClick={() => document.getElementById("post-textarea").focus()}
            className="flex-1 text-left px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm md:text-base text-gray-500"
          >
            What's on your mind, {user?.name?.split(" ")[0] || "there"}?
          </button>
        </div>

        <div className="px-4 md:px-6 pt-3">
          <textarea
            id="post-textarea"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your achievements, learnings, or ask for help..."
            className="w-full p-0 border-none focus:outline-none focus:ring-0 text-sm md:text-base text-gray-800 resize-none bg-transparent placeholder:text-gray-400"
            rows={3}
            style={{ minHeight: 60, maxHeight: 200 }}
            onInput={(e) => {
              e.target.style.height = "60px";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>

        {imagePreview && (
          <div className="px-4 md:px-6 pb-3">
            <div className="relative inline-block w-full max-w-md rounded-xl overflow-hidden border-2 border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto max-h-80 object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-1.5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="px-4 md:px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <label className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group">
            <ImagePlus className="w-4 h-4 md:w-5 md:h-5 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs md:text-sm font-medium text-gray-700 hidden sm:inline">
              Photo
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <Button
            variant="primary"
            className={`text-xs md:text-sm px-4 md:px-6 py-2 rounded-lg font-semibold transition-all ${
              !newPost.trim() && !imageFile
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-md"
            }`}
            onClick={handlePostSubmit}
            disabled={!newPost.trim() && !imageFile}
          >
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>

      {/* Posts List */}
      <div className="flex flex-col gap-4 md:gap-6 w-full pb-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={user?._id}
              onDelete={handleDeletePost}
              onUpdate={handleUpdatePost}
            />
          ))
        ) : (
          <div className="text-center mt-10 py-12 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImagePlus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-sm text-gray-600">
              Be the first to share something with the community!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
