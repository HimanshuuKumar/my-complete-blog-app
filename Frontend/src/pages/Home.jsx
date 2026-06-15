import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import BlogDescription from "../components/BlogDescription";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.get("https://my-complete-blog-app.onrender.com/api/blogs/getblogs", {
        headers: { Authorization: token },
      });

      setBlogs(res.data.blogs || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Header />

      {/* Feed Container */}
      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-2xl mx-auto space-y-4 px-4">
          {/* Page Title (LinkedIn style removed heavy heading) */}
          <div className="text-sm text-gray-500">Home • Feed</div>

          {/* Posts */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No blogs available.
            </div>
          ) : (
            blogs.map((blog) => (
              // Blog Card
              <div
                key={blog._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
              >
                {/* Post Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500 via-pink-500 to-orange-400 blur-[2px] opacity-80"></div>

                      <img
                        loading="lazy"
                        src={blog.user?.profilePic?.replace(
                          "/upload/",
                          "/upload/w_100,h_100,c_fill,q_auto,f_auto/",
                        )}
                        alt=""
                        className="relative w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg bg-gray-200"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 text-[15px] tracking-wide">
                        {blog.user?.name}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {(() => {
                          const now = new Date();
                          const created = new Date(blog.createdAt);

                          const diffMs = now - created;

                          const diffMinutes = Math.floor(diffMs / (1000 * 60));
                          const diffHours = Math.floor(
                            diffMs / (1000 * 60 * 60),
                          );
                          const diffDays = Math.floor(
                            diffMs / (1000 * 60 * 60 * 24),
                          );

                          if (diffMinutes < 1) return "Just now";
                          if (diffMinutes < 60) return `${diffMinutes} min ago`;
                          if (diffHours < 24) return `${diffHours} hr ago`;
                          if (diffDays === 1) return "1 day ago";
                          if (diffDays < 7) return `${diffDays} days ago`;

                          return created.toLocaleDateString();
                        })()}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    ⋯
                  </button>
                </div>

                {/* Content */}
                <div className="px-4 pb-3">
                  <h2 className="text-[18px] font-semibold text-gray-900 leading-snug">
                    {blog.title}
                  </h2>

                  <BlogDescription text={blog.description} />
                </div>

                {/* Image (LinkedIn style full width but subtle) */}
                {blog.blogimg && (
                  <div className="border-t border-b border-gray-100">
                    <img
                      src={blog.blogimg}
                      className="w-full max-h-[420px] object-cover"
                      alt="post"
                    />
                  </div>
                )}

                {/* Reactions Bar (LinkedIn feel) */}
                <div className="flex justify-between px-4 py-2 text-xs text-gray-500">
                  <div className="flex gap-4">
                    <button className="hover:text-blue-600">👍 Like</button>
                    <button className="hover:text-blue-600">💬 Comment</button>
                    <button className="hover:text-blue-600">🔁 Repost</button>
                  </div>

                  <button className="hover:text-gray-700">🔖 Save</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
