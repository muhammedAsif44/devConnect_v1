const PostsSection = ({ posts }) => (
  <section className="bg-white rounded-xl p-5 shadow-sm border">
    <h3 className="text-lg font-bold mb-3">Recent Posts</h3>
    {posts.length ? (
      posts.map((post, idx) => (
        <div
          key={idx}
          className="mb-5 pb-4 border-b last:border-b-0 last:pb-0"
        >
          {/* Post content or fallback */}
          <p className="text-gray-800">
            {post.content?.trim() || "Untitled Post"}
          </p>

          {/* Post image preview if exists */}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <img
              src={post.mediaUrls[0]}
              alt="Post media"
              className="mt-2 rounded-lg max-h-60 object-cover w-full"
            />
          )}

          {/* Likes and comments */}
          <div className="flex gap-6 text-sm text-gray-500 mt-2">
            <span>{post.likesCount || 0} ✩</span>
            <span>{post.commentsCount || 0} 💬</span>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No posts yet.</p>
    )}
  </section>
);

export default PostsSection;
