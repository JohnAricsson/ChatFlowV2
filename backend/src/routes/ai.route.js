import express from "express";
import { chatWithGemini } from "../controllers/ai.controller.js";
import { protectRoute } from "../middleware/middleware.js";

const router = express.Router();

router.post("/gemini", protectRoute, chatWithGemini);

export default router;
