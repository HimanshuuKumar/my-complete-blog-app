import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { User, Mail, LogOut, Loader } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      console.log("Fetching profile with token:", token);

      const res = await axios.get("https://my-complete-blog-app.onrender.com/api/users/profile", {
        headers: {
          Authorization: token, // Changed from 'authorization' to 'Authorization'
        },
      });

      console.log("Profile response:", res.data);

      const userData = res.data.user || res.data;
      setUser(userData);
      setError(null);
    } catch (error) {
      console.log("Profile fetch error:", error);
      console.log("Error response:", error.response);

      // DON'T remove token on error - just show error message
      setError(error.response?.data?.message || "Failed to load profile");

      // ONLY remove token if it's really invalid (optional)
      // For now, comment this out
      // if (error.response?.status === 401) {
      //   localStorage.removeItem("token");
      //   navigate("/login");
      // }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  // Show error but don't remove token
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Unable to Load Profile
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <p className="text-sm text-gray-500 mb-4">
                Your blogs will still work normally
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

            <div className="px-6 pb-8">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="relative">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name || "Profile"}
                      className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                      }}
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.name || "Anonymous User"}
                </h1>
                <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm">
                    {user?.email || "No email provided"}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Member since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : "2024"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {user?.blogsCount || 0}
                  </p>
                  <p className="text-xs text-gray-600">Total Blogs</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {user?.likesReceived || 0}
                  </p>
                  <p className="text-xs text-gray-600">Likes Received</p>
                </div>
              </div>

              {user?.bio && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 italic">"{user.bio}"</p>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
