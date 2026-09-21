// npm init -y
// npm i express mongoose dotenv jsonwebtoken bcryptjs cookie-parser cloudarinary socket.io
// npm i nodemon -D
//npm i cors
//npm install socket.io
//npm install nodemailer otp-generator
//npm install @google/genai
import dotenv from "dotenv";
dotenv.config();

import express from "express"; //type module in server.js
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import "./lib/passport.js";
import aiRoutes from "./routes/ai.route.js";
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "https://chatflowv2.onrender.com",
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);

server.listen(PORT, () => {
  console.log("server is running on port: " + PORT);
  connectDB();
});
