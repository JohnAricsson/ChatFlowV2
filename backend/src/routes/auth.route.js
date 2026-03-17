import express from "express";
import passport from "passport";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  deleteProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/middleware.js";
import { generateToken } from "../lib/utils.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.delete("/delete-profile", protectRoute, deleteProfile);
router.get("/check", protectRoute, checkAuth);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);
//redirect uri - http://localhost:5001/api/auth/google/callback
//Facebook doesnt need localhost uri
http: router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    try {
      generateToken(req.user._id, res);

      res.redirect("http://localhost:5173/");
    } catch (error) {
      console.error("Google Auth Callback Error:", error);
      res.redirect("http://localhost:5173/login?error=auth_failed");
    }
  },
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  }),
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    try {
      generateToken(req.user._id, res);

      res.redirect("http://localhost:5173/");
    } catch (error) {
      console.error("Facebook Auth Callback Error:", error);
      res.redirect("http://localhost:5173/login?error=auth_failed");
    }
  },
);

export default router;
