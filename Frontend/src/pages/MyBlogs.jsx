import React, { useState, useEffect } from "react";
import { Trash2, User, Calendar, Loader, Plus, Eye } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("https://my-complete-blog-app.onrender.com/api/blogs/me", {
        headers: { Authorization: token },
      });
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(blogId);
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://my-complete-blog-app.onrender.com/api/blogs/deleteblogs/${blogId}`,
        {
          headers: { Authorization: token },
        },
      );
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.log(err);
      setError("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading your blogs...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  My Blogs
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage and track your published posts
                </p>
              </div>
              <button
                onClick={() => navigate("/create")}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Create New Blog
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {blogs.length > 0 && (
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-blue-100 text-blue-700 text-sm px-4 py-1.5 rounded-full font-medium">
                📝 {blogs.length} {blogs.length === 1 ? "Blog" : "Blogs"}
              </div>
              <div className="bg-gray-100 text-gray-600 text-sm px-4 py-1.5 rounded-full">
                ✍️ Total Posts
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Empty State */}
          {blogs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Blogs Yet
              </h2>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Start your blogging journey today and share your thoughts with
                the world.
              </p>
              <button
                onClick={() => navigate("/create")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition shadow-sm hover:shadow-md"
              >
                Create Your First Blog
              </button>
            </div>
          ) : (
            // Blog Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Image Section - Conditional */}
                  {blog.blogimg && blog.blogimg.trim() !== "" ? (
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      <img
                        src={blog.blogimg}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.classList.add(
                            "bg-gradient-to-br",
                            "from-blue-500",
                            "to-indigo-600",
                          );
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-3xl">📝</span>
                        </div>
                        <p className="text-white/80 text-sm">No Image</p>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {/* Title and Delete Button */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h2
                        onClick={() => navigate(`/blog/${blog._id}`)}
                        className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition flex-1"
                      >
                        {blog.title}
                      </h2>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                        className="text-gray-400 hover:text-red-600 transition p-1"
                        aria-label="Delete blog"
                      >
                        {deletingId === blog._id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Description Preview */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {blog.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <User className="w-3.5 h-3.5" />
                          <span>{blog.user?.name || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/blog/${blog._id}`)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition group cursor-pointer"
                      >
                        <span c>Read More</span>
                        <Eye className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBlogs;
