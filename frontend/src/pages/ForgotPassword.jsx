import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, ArrowLeft, Loader2, Sparkles, Send } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isSendingResetLink, sendPasswordResetEmail } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address");

    const success = await sendPasswordResetEmail(email.toLowerCase());
    if (success) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-base-300 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-base-100/60 backdrop-blur-2xl rounded-3xl p-8 space-y-8 border border-white/5 shadow-2xl">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="size-3" /> Security
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-base-content/60 mt-1 font-medium">
              {isSubmitted
                ? "Check your inbox for reset instructions"
                : "Enter your email to receive a reset link"}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-base-content/50 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40">
                    <Mail className="size-5" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3.5 bg-base-200/50 rounded-2xl border border-white/5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSendingResetLink}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingResetLink}
                className="cursor-pointer w-full py-4 bg-primary text-primary-content rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSendingResetLink ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <Send className="size-4" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center space-y-4">
              <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="size-6 text-primary" />
              </div>
              <p className="text-sm text-base-content/70 leading-relaxed">
                If an account exists for{" "}
                <span className="font-bold text-base-content">{email}</span>,
                you will receive an email shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-bold text-primary uppercase hover:underline"
              >
                Didn't get it? Try again
              </button>
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-base-content/40 hover:text-primary transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
