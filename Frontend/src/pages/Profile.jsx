import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:4000/api/v1/profile", {
        headers: {
          authorization: token,
        },
      });

      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="shadow-xl bg-white p-8 rounded-xl text-center w-[350px]">
        <img
          src={user.profilePic}
          alt=""
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        />

        <h1 className="text-3xl font-bold">{user.name}</h1>

        <p className="text-gray-500 mt-2">{user.email}</p>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
