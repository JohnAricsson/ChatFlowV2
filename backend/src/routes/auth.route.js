import express from "express";
import passport from "passport";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  deleteProfile,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/middleware.js";
import { generateToken } from "../lib/utils.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgot.password.js";

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";
const FRONTEND_URL = isProduction
  ? "https://chatflowv2.onrender.com"
  : "http://localhost:5173";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.delete("/delete-profile", protectRoute, deleteProfile);
router.get("/check", protectRoute, checkAuth);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Google Authentication Route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

// Google Callback Route
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) return res.redirect(`${FRONTEND_URL}/login?error=server_error`);

    if (!user && info?.message === "email_exists_other_provider") {
      return res.redirect(`${FRONTEND_URL}/login?error=duplicate_email`);
    }

    if (!user) return res.redirect(`${FRONTEND_URL}/login?error=google_failed`);

    try {
      generateToken(user._id, res);
      res.redirect(`${FRONTEND_URL}/`);
    } catch (error) {
      res.redirect(`${FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
});

// Facebook Authentication Route
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  }),
);

// Facebook Callback Route
router.get("/facebook/callback", (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user, info) => {
    if (err) return res.redirect(`${FRONTEND_URL}/login?error=server_error`);

    if (!user && info?.message === "email_exists_other_provider") {
      return res.redirect(`${FRONTEND_URL}/login?error=duplicate_email`);
    }

    if (!user)
      return res.redirect(`${FRONTEND_URL}/login?error=facebook_failed`);

    try {
      generateToken(user._id, res);
      res.redirect(`${FRONTEND_URL}/`);
    } catch (error) {
      res.redirect(`${FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
});

export default router;
