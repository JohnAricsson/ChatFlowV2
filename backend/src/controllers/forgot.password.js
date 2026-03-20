import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.googleId || user.facebookId) {
      return res.status(400).json({
        message:
          "This account uses Social Login. Please log in with Google/Facebook.",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: `"ChatFlow Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your ChatFlow password",
      html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
      <p style="color: #555; line-height: 1.5;">We received a request to reset the password for your ChatFlow account. Click the button below to proceed:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #5865F2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           Reset Password
        </a>
      </div>

      <p style="color: #888; font-size: 12px; text-align: center;">
        This link will expire in <strong>15 minutes</strong> for your security.<br/>
        If you didn't request this, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #aaa; font-size: 10px; text-align: center;">
        Trouble with the button? Copy and paste this link: <br/>
        ${resetUrl}
      </p>
    </div>
  `,
    });

    res.json({ message: "Reset link sent to your email!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Invalid link" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Password updated! You can now log in." });
  } catch (err) {
    res.status(400).json({ message: "Link expired or invalid" });
  }
};
