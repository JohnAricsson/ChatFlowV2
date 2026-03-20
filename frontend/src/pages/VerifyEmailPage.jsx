import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const VerifyEmailPage = ({ email }) => {
  const [code, setCode] = useState("");
  const { verifyEmail, isVerifying } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyEmail({ email, code });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Verify Email</h2>
        <p className="text-sm text-center text-base-content/60 mb-6">
          Enter the 6-digit code sent to <b>{email}</b>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="000000"
            className="input input-bordered w-full text-center text-2xl tracking-widest"
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            className="btn btn-primary w-full"
            disabled={isVerifying || code.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default VerifyEmailPage;
