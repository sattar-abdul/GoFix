import Task from "../models/Task.js";
import cloudinary from "../config/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";

export const postTask = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "tasks" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const task = await Task.create({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      image: imageUrl,
    });

    // Async email to owner of the post
    (async () => {
      try {
        const taskOwner = await User.findById(req.user.id);
        if (taskOwner?.email) {
          await sendEmail(
            taskOwner.email,
            "Task Posted Successfully ✅",
            `<p>Hello ${taskOwner.name}, your task "${task.title}" has been posted successfully.</p>`
          );
        }
      } catch (err) {
        console.error("Email error (postTask):", err);
      }
    })();

    res.status(201).json(task);
  } catch (error) {
    console.error("postTask error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "open" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .populate({
        path: "selectedProviderId",
        select: "name email averageRating",
      })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.selectedProviderId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the assigned provider can complete this task" });
    }

    if (task.status !== "assigned") {
      return res
        .status(400)
        .json({ message: "Task is not in assigned status" });
    }

    task.status = "completed";
    task.completedAt = new Date();
    await task.save();

    await User.findByIdAndUpdate(req.user.id, { $inc: { completedTasks: 1 } });

    // Send email to provider
    const provider = await User.findById(req.user.id);
    if (provider?.email) {
      sendEmail(
        provider.email,
        "Task Completed",
        `Hello ${provider.name}, you have successfully completed the task "${task.title}".`
      );
    }

    // Send email to user
    const user = await User.findById(task.userId);
    if (user?.email) {
      sendEmail(
        user.email,
        "Task Completed",
        `Hello ${user.name}, your task "${task.title}" has been marked as completed by the provider.`
      );
    }

    res.json({ message: "Task completed successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rateProvider = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { score, review } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the task owner can rate the provider" });
    }

    if (task.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Task must be completed before rating" });
    }

    if (task.rating && task.rating.score) {
      return res.status(400).json({ message: "Task has already been rated" });
    }

    task.rating = { score, review, ratedAt: new Date() };
    await task.save();

    const provider = await User.findById(task.selectedProviderId);
    if (provider) {
      const newTotalRatings = provider.totalRatings + 1;
      const newAverageRating =
        (provider.averageRating * provider.totalRatings + score) /
        newTotalRatings;

      await User.findByIdAndUpdate(task.selectedProviderId, {
        averageRating: Math.round(newAverageRating * 10) / 10,
        totalRatings: newTotalRatings,
      });

      // Send email to provider about new rating
      if (provider.email) {
        sendEmail(
          provider.email,
          "New Rating Received",
          `Hello ${provider.name}, you received a rating of ${score} for task "${task.title}". Review: ${review}`
        );
      }
    }

    res.json({ message: "Rating submitted successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProviderAssignedTasks = async (req, res) => {
  try {
    const providerId = req.user.id;

    const tasks = await Task.find({
      selectedProviderId: providerId,
      status: { $in: ["assigned", "completed"] },
    }).populate("userId");

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching provider tasks:", error);
    res.status(500).json({ message: "Failed to fetch provider tasks" });
  }
};

export const selectBid = async (req, res) => {
  try {
    const { taskId, bidId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const bid = task.bids.id(bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    bid.status = "accepted";
    task.selectedProviderId = bid.providerId;

    task.bids.forEach((b) => {
      if (b._id.toString() !== bidId) b.status = "rejected";
    });

    task.status = "assigned";
    await task.save();

    // Send email to provider about selection
    const provider = await User.findById(bid.providerId);
    if (provider?.email) {
      sendEmail(
        provider.email,
        "Bid Accepted",
        `Hello ${provider.name}, your bid for task "${task.title}" has been accepted.`
      );
    }

    // Send email to task owner
    const user = await User.findById(task.userId);
    if (user?.email) {
      sendEmail(
        user.email,
        "Provider Selected",
        `Hello ${user.name}, you have selected a provider for your task "${task.title}".`
      );
    }

    res.json({ message: "Provider selected successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
