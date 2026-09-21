import React, { useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore.js";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const HomePage = lazy(() => import("./pages/HomePage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPage = lazy(() => import("./pages/ResetPage"));

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-base-200 pt-16">
            <Loader className="size-10 animate-spin text-primary" />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPage />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
