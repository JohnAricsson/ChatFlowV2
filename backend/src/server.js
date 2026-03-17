// npm init -y
// npm i express mongoose dotenv jsonwebtoken bcryptjs cookie-parser cloudarinary socket.io
// npm i nodemon -D
//npm i cors
//npm install socket.io
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

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
//use cors for frontend to communicate with backend because both are on different ports
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(5001, () => {
  console.log("server is running on port: " + PORT);
  connectDB();
});
