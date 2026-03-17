import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  User,
  Calendar,
  Sparkles,
  Check,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
const ProfilePage = () => {
  const {
    authUser,
    checkAuth,
    isUpdatingProfile,
    updateProfile,
    deleteAccount,
    isDeletingAccount,
  } = useAuthStore();

  useEffect(() => {
    // If user is logged in but createdAt hasn't arrived yet
    if (authUser && !authUser.createdAt) {
      checkAuth(); // This re-fetches the user data from /api/auth/check
    }
  }, [authUser, checkAuth]);

  const [selectedImg, setSelectedImg] = useState(null);
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size too large. Keep it under 5MB");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    };
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const isNameChanged = fullName !== authUser.fullName;
    const isImageChanged = selectedImg !== null;
    const isPasswordChanged = password.length > 0;

    if (!isNameChanged && !isImageChanged && !isPasswordChanged) return;

    const updateData = {};

    if (isNameChanged) updateData.fullName = fullName.trim();
    if (isImageChanged) updateData.profilePic = selectedImg;
    if (isPasswordChanged) {
      if (password.length < 6)
        return toast.error("Password must be at least 6 characters");
      updateData.password = password;
    }

    await updateProfile(updateData);
    setPassword("");
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await deleteAccount();
  };

  const isChanged =
    fullName !== authUser?.fullName ||
    selectedImg !== null ||
    password.length > 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-base-300 relative overflow-hidden transition-all duration-500">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] animate-pulse" />

      <div className="max-w-2xl mx-auto p-4 py-24 relative z-10 space-y-6">
        <form
          onSubmit={handleUpdateProfile}
          className="bg-base-100/60 backdrop-blur-2xl rounded-3xl p-8 space-y-8 border border-white/5 shadow-2xl"
        >
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="size-3" /> Account Settings
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Personal Workspace
            </h1>
            <p className="text-base-content/60 mt-1 font-medium">
              Update your identity and security settings
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="size-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary shadow-xl">
                <div className="size-full rounded-full border-4 border-base-100 overflow-hidden bg-base-100 flex items-center justify-center">
                  {selectedImg || authUser.profilePic ? (
                    <img
                      src={selectedImg || authUser.profilePic}
                      className="size-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <span className="text-xs font-bold text-base-content/50 text-center px-2">
                      No Image
                    </span>
                  )}
                </div>
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary p-2.5 rounded-2xl cursor-pointer shadow-lg border-4 border-base-100 hover:scale-110 active:scale-95 transition-all"
              >
                <Camera className="size-5 text-primary-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-base-content/50 uppercase tracking-widest flex items-center gap-2 ml-1">
                <User className="size-3" /> Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3.5 bg-base-200/50 rounded-2xl border border-white/5 outline-none focus:ring-2 focus:ring-primary/20"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isUpdatingProfile}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-base-content/50 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Mail className="size-3" /> Email
              </label>
              <div className="px-4 py-3.5 bg-base-200/50 rounded-2xl border border-white/5 opacity-60 flex justify-between items-center cursor-not-allowed">
                {authUser?.email} <Check className="size-4 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-base-content/50 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Lock className="size-3" /> New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3.5 bg-base-200/50 rounded-2xl border border-white/5 outline-none focus:ring-2 focus:ring-primary/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isUpdatingProfile}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-base-200/50 rounded-3xl p-6 border border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-primary" />
              <span className="text-sm font-medium">Member Since</span>
            </div>
            <span className="text-sm font-bold text-base-content/70">
              {authUser.createdAt?.split("T")[0]}
            </span>
          </div>

          <button
            type="submit"
            disabled={!isChanged || isUpdatingProfile}
            className={`cursor-pointer w-full py-4 rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isChanged ? "bg-primary text-primary-content shadow-lg hover:scale-[1.01]" : "bg-base-content/5 text-base-content/20"}`}
          >
            {isUpdatingProfile ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>

        <div className="bg-error/5 backdrop-blur-2xl rounded-3xl p-6 border border-error/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-error uppercase tracking-wider text-xs flex items-center gap-2">
              <AlertCircle size={14} /> WARNING!
            </h3>
            <p className="text-xs text-base-content/50">
              Permanently remove your account and all data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer px-6 py-3 bg-error/10 text-error hover:bg-error/20 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
          >
            Delete Account <Trash2 size={16} />
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-base-300/80 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => !isDeletingAccount && setIsModalOpen(false)}
            />

            <div className="bg-base-100 border border-white/5 w-full max-w-sm rounded-3xl p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
              <div className="size-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>

              <h2 className="text-xl font-black text-center mb-2">
                Are you sure?
              </h2>
              <p className="text-sm text-base-content/60 text-center mb-8">
                This action is irreversible. All your messages, profile data,
                and settings will be deleted forever.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="cursor-pointer w-full py-4 bg-error text-error-content rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {isDeletingAccount ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Yes, Delete My Account"
                  )}
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeletingAccount}
                  className="cursor-pointer w-full py-4 bg-base-200 text-base-content rounded-2xl font-bold uppercase tracking-widest hover:bg-base-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
