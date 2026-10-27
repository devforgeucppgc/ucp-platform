import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, Save, ArrowLeft, Key, CheckCircle } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { authService } from "../../services";

export default function ChangePassword() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("New password must be different from the current one");
      return;
    }

    try {
      setLoading(true);
      // Calls PUT /api/v1/auth/change-password with the Bearer token
      await authService.changePassword({ currentPassword, newPassword });

      toast.success("Password changed successfully! Please log in again.");
      logout();
      navigate("/admin/login", { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      toast.error(
        data?.errors?.[0]?.message ||
          data?.message ||
          err?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100/60">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 md:p-12 transition-all duration-200 hover:border-indigo-200/80">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 mb-5 shadow-sm shadow-indigo-200">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Change Password
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Keep your account secure with a strong new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showCurrent ? "text" : "password"}
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-12 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none transition"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-12 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none transition"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none transition"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition duration-150 hover:shadow-md hover:shadow-indigo-300/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Password
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-150 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}