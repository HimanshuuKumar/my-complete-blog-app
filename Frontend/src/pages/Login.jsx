import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/api/v1/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      alert(res.data.message);

      navigate("/profile");
      s;
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");

      localStorage.removeItem("token");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-[350px]"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

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
        <button className="w-full bg-black text-white p-3 rounded">
          Login
        </button>

        <p className="text-center mt-4">
          Don't have account?{" "}
          <Link to="/" className="text-blue-500">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
