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

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.delete("/delete-profile", protectRoute, deleteProfile);
router.get("/check", protectRoute, checkAuth);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//redirect uri - http://localhost:5001/api/auth/google/callback
//Facebook doesnt need localhost uri
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err)
      return res.redirect("http://localhost:5173/login?error=server_error");

    if (!user && info?.message === "email_exists_other_provider") {
      return res.redirect("http://localhost:5173/login?error=duplicate_email");
    }

    if (!user)
      return res.redirect("http://localhost:5173/login?error=google_failed");

    try {
      generateToken(user._id, res);
      res.redirect("http://localhost:5173/");
    } catch (error) {
      res.redirect("http://localhost:5173/login?error=server_error");
    }
  })(req, res, next);
});

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  }),
);

router.get("/facebook/callback", (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user, info) => {
    if (err)
      return res.redirect("http://localhost:5173/login?error=server_error");

    if (!user && info?.message === "email_exists_other_provider") {
      return res.redirect("http://localhost:5173/login?error=duplicate_email");
    }

    if (!user)
      return res.redirect("http://localhost:5173/login?error=facebook_failed");

    try {
      generateToken(user._id, res);
      res.redirect("http://localhost:5173/");
    } catch (error) {
      res.redirect("http://localhost:5173/login?error=server_error");
    }
  })(req, res, next);
});

export default router;
