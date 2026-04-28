import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Signup from "./Signup";
import PropTypes from "prop-types";
import GoogleLogin from "../components/GoogleLogin";

const API = import.meta.env.VITE_API_URL;

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      navigate("/"); //  redirect if already logged in
    }
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text(); 
      

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Not JSON:", text);
        throw new Error("Server error");
      }
      if (!res.ok) {
        alert(data.msg || "Login failed");
        setLoading(false);
        return;
      }

      // store token
      localStorage.setItem("token", data.token);

      //  update state (VERY IMPORTANT)
      setToken(data.token);

      console.log("Login success");

      // navigate properly
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-full bg-linear-to-br flex items-center justify-center ">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-stone-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-stone-300/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(245, 158, 11, 0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        </div>
        {/* Login Card */}
        <div className="z-10 w-full max-w-md p-4 ">
          <div className="bg-stone-500/20 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-200/50">
            {/* Header */}
            <div className="text-center mb-2 ">
              <div className="flex items-center gap-2">
                {" "}
                <div className="text-6xl mb-4 animate-bounce-slow">📚</div>
                <h2 className="text-2xl font-bold text-stone-800 mb-2">
                  Welcome Back!
                </h2>
              </div>

              <p className="text-stone-500">
                Sign in to continue your learning journey
              </p>
              <div className="w-20 h-1 bg-linear-to-r from-amber-400 to-orange-500 mx-auto rounded-full mt-4"></div>
            </div>

            {/* Login Form */}
            <div className="space-y-1.5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/50"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/50"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  href="#"
                  className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                disabled={loading}
                onClick={handleLogin}
                className="disabled:opacity-50 disabled:cursor-not-allowed w-full bg-linear-to-r from-amber-600/80 to-orange-600/80 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:cursor-pointer shadow-lg"
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300/90"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4  text-stone-500">or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <GoogleLogin setToken={setToken} />

            {/* Sign Up Link */}
            <p className="text-center text-sm text-stone-600 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Decorative Element */}
          <div className="text-center mt-6">
            <p className="text-xs text-stone-400">
              ✨ Books out, brains on — let's make study fun! ✨
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Login;
Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
