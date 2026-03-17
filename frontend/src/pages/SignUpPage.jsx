import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import signUpAnimation from "../assets/animations/Profile.json";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() !== true) return;

    const success = await signup(formData);
    if (success) navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-300 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] animate-pulse" />

      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-base-100/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10">
        <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
          <div className="flex lg:hidden justify-center mb-6">
            <div className="w-64 h-64">
              <Lottie
                animationData={signUpAnimation}
                loop={true}
                className="w-full h-full drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-left">
              <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 mb-4">
                <div className="bg-base-100 size-full rounded-[14px] flex items-center justify-center">
                  <MessageSquare className="size-6 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                Join the flow.
              </h1>
              <p className="text-base-content/60 mt-2">
                Create an account to start chatting with the world.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-control">
                <label className="label-text font-semibold ml-1 mb-2 block">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-200 transition-all border-white/5 focus:border-primary/50"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label-text font-semibold ml-1 mb-2 block">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-200 border-white/5 focus:border-primary/50"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label-text font-semibold ml-1 mb-2 block">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-200 border-white/5 focus:border-primary/50"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border-none"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Creating
                    Account...
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    Get Started <Sparkles className="size-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="mx-4 text-sm text-gray-500">
                or continue with
              </span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:5001/api/auth/facebook")
                }
                className="flex items-center justify-center py-3 cursor-pointer bg-blue-600 border border-blue-700 rounded-xl hover:bg-blue-700 text-white"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.3 3h-1.9v7A10 10 0 0 0 22 12z" />
                </svg>
                Facebook
              </button>

              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:5001/api/auth/google")
                }
                className="flex items-center justify-center py-3 cursor-pointer bg-white border border-gray-300 rounded-xl hover:bg-gray-300 text-gray-800"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3">
                  <path
                    d="M533.5 278.4c0-17.9-1.6-35.2-4.6-52H272v98.9h146.9c-6.4 34.7-25.7 64.1-54.9 83.9v69.7h88.7c51.9-47.9 81.8-118.3 81.8-200.5z"
                    fill="#4285F4"
                  />
                  <path
                    d="M272 544.3c73.6 0 135.4-24.3 180.5-65.9l-88.7-69.7c-24.7 16.6-56.3 26.5-91.8 26.5-70.8 0-130.7-47.7-152.1-111.8H28.2v70.5C73.3 473.7 165 544.3 272 544.3z"
                    fill="#34A853"
                  />
                  <path
                    d="M119.9 325.9c-8.2-24.7-8.2-51.4 0-76.1V179.3H28.2c-18.7 37.6-29.5 79.9-29.5 124.5s10.8 86.9 29.5 124.5l91.7-70.4z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M272 107.1c38.8 0 73.6 13.3 101 39.4l75.8-75.8C407.4 24.3 345.6 0 272 0 165 0 73.3 70.6 28.2 179.3l91.7 70.5C141.3 154.8 201.2 107.1 272 107.1z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </div>

            <p className="text-center text-base-content/60">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex bg-gradient-to-br from-primary/10 to-secondary/10 items-center justify-center p-12 relative order-1 lg:order-2">
          <div className="max-w-md text-center space-y-4">
            <Lottie
              animationData={signUpAnimation}
              loop={true}
              className="w-full drop-shadow-2xl"
            />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Step into the future of chat.
            </h2>
            <p className="text-base-content/70">
              Experience seamless real-time communication with encrypted privacy
              and stunning media sharing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
