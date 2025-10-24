import express from "express";
import { getChat, saveMessage } from "../controllers/chatController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:taskId", auth, getChat);
router.post("/", auth, saveMessage);

export default router;
