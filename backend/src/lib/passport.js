import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/user.model.js";

// Fallback absolute URLs for Render if relative paths give you trouble
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Absolute URLs are safer, but keeping it relative works IF proxy is true
      callbackURL: process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/auth/google/callback`
        : "/api/auth/google/callback",
      proxy: true, // 👈 CRITICAL FOR RENDER HOSTING
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const existingUser = await User.findOne({ email });

          if (existingUser) {
            return done(null, false, {
              message: "email_exists_other_provider",
            });
          }

          user = await User.create({
            fullName: profile.displayName,
            email: email,
            googleId: profile.id,
            isVerified: true,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

// FACEBOOK STRATEGY
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/auth/facebook/callback`
        : "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
      proxy: true, // 👈 CRITICAL FOR RENDER HOSTING
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ facebookId: profile.id });

        if (!user && email) {
          const existingUser = await User.findOne({ email });

          if (existingUser) {
            return done(null, false, {
              message: "email_exists_other_provider",
            });
          }

          user = await User.create({
            fullName: profile.displayName,
            email: email,
            facebookId: profile.id,
            isVerified: true,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
