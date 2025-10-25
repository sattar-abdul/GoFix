import Chat from "../models/Chat.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const getChat = async (req, res) => {
  try {
    const { taskId } = req.params;

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
    const { taskId, message } = req.body;
    if (!taskId || !message)
      return res.status(400).json({ message: "Missing fields" });

    const userRole = req.user.role;
    const userId = req.user.id;

    let chat = await Chat.findOne({ taskId });

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

    chat.messages.push({ sender: userRole, message });
    await chat.save();

    // Async email to other participant
    (async () => {
      try {
        let recipient;
        if (userRole === "user")
          recipient = await User.findById(chat.providerId);
        else recipient = await User.findById(chat.userId);

        if (recipient?.email) {
          await sendEmail(
            recipient.email,
            "New Message Received 💬",
            `<p>Hello ${recipient.name}, you have a new message regarding task ID: ${taskId}.</p>
             <p>Message: "${message}"</p>`
          );
        }
      } catch (err) {
        console.error("Email error (chat message):", err);
      }
    })();

    res.status(201).json(chat);
  } catch (error) {
    console.error("saveMessage error:", error);
    res.status(500).json({ message: error.message });
  }
};
