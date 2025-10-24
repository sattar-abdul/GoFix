import Chat from "../models/Chat.js";

export const getChat = async (req, res) => {
  try {
    const { taskId } = req.params;
    const chat = await Chat.findOne({ taskId })
      .populate("userId", "name")
      .populate("providerId", "name");
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { taskId, sender, message } = req.body;
    let chat = await Chat.findOne({ taskId });
    
    if (!chat) {
      chat = await Chat.create({ 
        taskId, 
        userId: req.user.id,
        providerId: req.body.providerId,
        messages: [] 
      });
    }

    chat.messages.push({ sender, message });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
