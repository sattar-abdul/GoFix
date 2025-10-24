import express from "express";
import {
  postTask,
  getTasks,
  getUserTasks,
  completeTask,
  rateProvider,
} from "../controllers/taskController.js";
import upload from "../middleware/upload.js";
import auth from "../middleware/authMiddleware.js";
import { getProviderAssignedTasks } from "../controllers/taskController.js";

const router = express.Router();

// Get all open tasks (for providers to browse)
router.get("/", getTasks);

// Get user's own tasks
router.get("/my-tasks", auth, getUserTasks);

// Upload single image with field name "image"
router.post("/", auth, upload.single("image"), postTask);

// Complete task (provider only)
router.put("/:taskId/complete", auth, completeTask);

// Rate provider (user only)
router.post("/:taskId/rate", auth, rateProvider);

// Get tasks assigned to the logged-in provider
router.get("/assigned/me", auth, getProviderAssignedTasks);

export default router;
