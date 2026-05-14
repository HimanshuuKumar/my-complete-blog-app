import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("profilePic", profilePic);

      const res = await axios.post(
        "http://localhost:4000/api/v1/signup",
        formData,
      );

      alert(res.data.message);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-lg w-[350px]"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Signup</h1>

        <input
          type="text"
          placeholder="Enter Name"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />
        {/*password*/}
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full border p-3 rounded pr-20"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {/*password end*/}
        <input
          type="file"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />

        <button className="w-full bg-black text-white p-3 rounded">
          Signup
        </button>

        <p className="text-center mt-4">
          Already have account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
