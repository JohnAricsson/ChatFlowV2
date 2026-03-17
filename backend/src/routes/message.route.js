import express from "express";
import { protectRoute } from "../middleware/middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import {
  searchUsers,
  togglePinChat,
  hideChat,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/search", protectRoute, searchUsers);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/pin/:id", protectRoute, togglePinChat);
router.post("/hide/:id", protectRoute, hideChat);

export default router;
