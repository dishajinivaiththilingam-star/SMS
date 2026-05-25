import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setSent(true);

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "Password reset link has been sent to your email. Check your inbox.",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to send reset email. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[420px]">

        {/* ICON */}
        <div className="flex justify-center mb-5">
          <div className="bg-blue-100 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Forgot Password
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Enter your email address and we will send you a password reset link.
        </p>

        {sent ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
              <p className="text-green-700 font-semibold text-lg mb-1">
                ✓ Reset link sent!
              </p>
              <p className="text-green-600 text-sm">
                Check your inbox at <strong>{email}</strong>
              </p>
              <p className="text-green-500 text-xs mt-2">
                The link will expire in 15 minutes.
              </p>
            </div>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="text-blue-600 hover:underline text-sm"
            >
              Send again
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-blue-600 text-sm"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;