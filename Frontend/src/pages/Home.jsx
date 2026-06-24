import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Header from "../components/Header";
import BlogDescription from "../components/BlogDescription";
import { useNavigate } from "react-router-dom";

// ============================================
// 1. CACHE LAYER
// ============================================
const CACHE_KEY = "home_blogs_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedBlogs = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCachedBlogs = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {}
};

// ============================================
// 2. MAIN COMPONENT
// ============================================
const Home = () => {
  const [blogs, setBlogs] = useState(() => getCachedBlogs() || []);
  const [loading, setLoading] = useState(!getCachedBlogs());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  // ============================================
  // 3. OPTIMIZED FETCH WITH ABORT & PAGINATION
  // ============================================
  const fetchBlogs = useCallback(async (pageNum = 1, signal) => {
    // Check cache for first page only
    if (pageNum === 1) {
      const cached = getCachedBlogs();
      if (cached) {
        setBlogs(cached);
        setLoading(false);
        return;
      }
    }

    try {
      if (pageNum === 1) setLoading(true);
      
      const token = localStorage.getItem("token");
      
      const res = await axios.get(
        `https://my-complete-blog-app.onrender.com/api/blogs/getblogs?page=${pageNum}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: { Authorization: token },
          signal,
        }
      );

      const newBlogs = res.data.blogs || [];
      const total = res.data.total || newBlogs.length;

      setTotalBlogs(total);
      setHasMore(pageNum * ITEMS_PER_PAGE < total);

      if (pageNum === 1) {
        setBlogs(newBlogs);
        setCachedBlogs(newBlogs);
      } else {
        setBlogs(prev => [...prev, ...newBlogs]);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching blogs:", error);
      }
    } finally {
      if (pageNum === 1) setLoading(false);
    }
  }, []);

  // ============================================
  // 4. LOAD MORE HANDLER
  // ============================================
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    const abortController = new AbortController();
    fetchBlogs(nextPage, abortController.signal);
    return () => abortController.abort();
  }, [page, fetchBlogs]);

  // ============================================
  // 5. INITIAL FETCH
  // ============================================
  useEffect(() => {
    const abortController = new AbortController();
    fetchBlogs(1, abortController.signal);
    return () => abortController.abort();
  }, [fetchBlogs]);

  // ============================================
  // 6. MEMOIZED TIME FORMATTER
  // ============================================
  const formatTime = useCallback((createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return created.toLocaleDateString();
  }, []);

  // ============================================
  // 7. MEMOIZED BLOG CARD COMPONENT
  // ============================================
  const BlogCard = useMemo(() => {
    return ({ blog }) => (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
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
                  "/upload/w_100,h_100,c_fill,q_auto,f_auto/"
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
                {formatTime(blog.createdAt)}
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">⋯</button>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <h2 className="text-[18px] font-semibold text-gray-900 leading-snug">
            {blog.title}
          </h2>
          <BlogDescription text={blog.description} />
        </div>

        {/* Image */}
        {blog.blogimg && (
          <div className="border-t border-b border-gray-100">
            <img
              src={blog.blogimg}
              className="w-full max-h-[420px] object-cover"
              alt="post"
              loading="lazy"
            />
          </div>
        )}

        {/* Reactions Bar */}
        <div className="flex justify-between px-4 py-2 text-xs text-gray-500">
          <div className="flex gap-4">
            <button className="hover:text-blue-600">👍 Like</button>
            <button className="hover:text-blue-600">💬 Comment</button>
            <button className="hover:text-blue-600">🔁 Repost</button>
          </div>
          <button className="hover:text-gray-700">🔖 Save</button>
        </div>
      </div>
    );
  }, [navigate, formatTime]);

  // ============================================
  // 8. RENDER
  // ============================================
  return (
    <>
      <Header />

      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-2xl mx-auto space-y-4 px-4">
          <div className="text-sm text-gray-500">Home • Feed</div>

          {/* Loading State */}
          {loading && blogs.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No blogs available.
            </div>
          ) : (
            <>
              {/* Blog Cards */}
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center py-4">
                  <button
                    onClick={loadMore}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-md"
                  >
                    Load More
                  </button>
                </div>
              )}

              {/* Loading More Indicator */}
              {loading && blogs.length > 0 && (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}

              {/* End of Feed */}
              {!hasMore && blogs.length > 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  — You've seen all posts —
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
