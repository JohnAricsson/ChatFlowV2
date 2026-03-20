import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { sendVerificationEmail } from "../lib/mail.js";

export const signup = async (req, res) => {
  const { fullName, password } = req.body;
  const email = req.body.email?.toLowerCase();

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationOTP: otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await newUser.save();

    try {
      await sendVerificationEmail(email, otp);

      res.status(201).json({
        message:
          "Registration successful. Please check your email for the verification code.",
        email: newUser.email,
      });
    } catch (mailError) {
      console.log("Mail Error:", mailError);
      res
        .status(500)
        .json({ message: "User created but failed to send email." });
    }
  } catch (error) {
    console.log("Error in sign up controller", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isSocialUser = user.googleId || user.facebookId;

    if (!user.isVerified && !isSocialUser) {
      return res.status(401).json({
        message: "Please verify your email to continue.",
        unverified: true,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, password } = req.body;
    const userId = req.user._id;

    const updateData = {};

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    if (fullName) {
      updateData.fullName = fullName;
    }

    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("DETAILED CLOUDINARY/DB ERROR:", error);

    // Send the actual error message to the frontend temporarily so you can see it
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePic) {
      try {
        const publicId = user.profilePic.split("/").pop().split(".")[0];

        await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary asset deleted:", publicId);
      } catch (cloudinaryErr) {
        console.error("Cloudinary Cleanup Failed:", cloudinaryErr);
      }
    }

    await User.findByIdAndDelete(userId);

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Account Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({
      email,
      verificationOTP: code,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("Error in verifyEmail:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
