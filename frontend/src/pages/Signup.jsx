import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserPlus, FaGoogle, FaArrowLeft } from "react-icons/fa";
import GoogleLogin from "../components/GoogleLogin";

const API = import.meta.env.VITE_API_URL;

const Signup = ({ setToken }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Signup failed");
        setIsLoading(false);
        return;
      }

      alert("Signup successful 🎉 Now login");
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/tasks");
    } catch (err) {
      console.log(err);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };


  return (
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

      {/* Signup Card */}
       <div className="z-10 w-full max-w-md p-4 ">
        {/* Back to Login Link */}
        {/* <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors mb-4 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link> */}

        <div className="bg-stone-500/20 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-200/50">
          {/* Header */}
          <div className="text-center mb-2 ">
              <div className="flex items-center gap-2">
                {" "}
                <div className="text-5xl mb-4 animate-bounce-slow">📚</div>
                <h2 className="text-2xl font-bold text-stone-800 mb-2">
                 Create Account
                </h2>
              </div>
            
            <p className="text-stone-500 text-sm">Join us and start your learning journey</p>
            <div className="w-20 h-1 bg-linear-to-r from-amber-400 to-stone-400 mx-auto rounded-full mt-3"></div>
          </div>

          {/* Signup Form */}
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-stone-400 text-sm" />
                </div>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/50 text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-stone-400 text-sm" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 text-sm"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <p className="mt-1 text-xs text-stone-500">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-stone-400 text-sm" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Confirm your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/50 text-sm"
                />
              </div>
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-amber-600/90 to-orange-600/90 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <FaUserPlus size={14} />
                  Sign Up
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300/90"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4  text-stone-500">or sign up with</span>
              </div>
            </div>

          {/* Google Login Button */}
          
               <GoogleLogin setToken={setToken} />
            

          {/* Login Link */}
          <p className="text-center text-xs text-stone-600 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              Sign in
            </Link>
          </p>
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
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Signup;