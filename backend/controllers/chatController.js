import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import Task from "../models/Task.js";

export const getChat = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Let Mongoose cast string to ObjectId automatically
    const chat = await Chat.findOne({ taskId })
      .populate("userId", "name")
      .populate("providerId", "name");

    if (!chat) return res.status(200).json({ messages: [] });

    res.status(200).json(chat);
  } catch (error) {
    console.error("getChat error:", error);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
};

export const saveMessage = async (req, res) => {
  try {
    console.log("saveMessage body:", req.body);
    console.log("req.user:", req.user);

    const { taskId, message } = req.body;
    if (!taskId || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const userRole = req.user.role; // 'user' or 'provider'
    const userId = req.user.id;

    // Find chat
    let chat = await Chat.findOne({ taskId });

    // If no chat exists, create it
    if (!chat) {
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: "Task not found" });

      chat = await Chat.create({
        taskId,
        userId: task.userId,
        providerId: task.selectedProviderId,
        messages: [],
      });
    }

    // Push new message
    chat.messages.push({ sender: userRole, message });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error("saveMessage error:", error);
    res.status(500).json({ message: error.message });
  }
};
