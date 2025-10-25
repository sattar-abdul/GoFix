import Task from "../models/Task.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const placeBid = async (req, res) => {
  try {
    const { taskId, proposedCost, proposedTime } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const newBid = { providerId: req.user.id, proposedCost, proposedTime };
    task.bids.push(newBid);
    await task.save();

    // Async email
    (async () => {
      try {
        const user = await User.findById(task.userId);
        const provider = await User.findById(req.user.id);
        if (user?.email) {
          await sendEmail(
            user.email,
            "New Bid Placed ✅",
            `<p>Hello ${user.name}, ${provider.name} placed a bid for your task "${task.title}".</p>`
          );
        }
      } catch (err) {
        console.error("Email error (placeBid):", err);
      }
    })();

    res.status(201).json({ message: "Bid placed successfully", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const selectBid = async (req, res) => {
  try {
    const { taskId, bidId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.bids.forEach((bid) => {
      bid.status = bid._id.toString() === bidId ? "accepted" : "rejected";
    });

    const selectedBid = task.bids.find((bid) => bid._id.toString() === bidId);
    task.selectedProviderId = selectedBid.providerId;
    task.status = "assigned";
    await task.save();

    // Async emails
    (async () => {
      try {
        const provider = await User.findById(selectedBid.providerId);
        const user = await User.findById(task.userId);

        if (provider?.email) {
          await sendEmail(
            provider.email,
            "Bid Accepted ✅",
            `<p>Hello ${provider.name}, your bid for "${task.title}" has been accepted.</p>`
          );
        }

        if (user?.email) {
          await sendEmail(
            user.email,
            "Provider Selected ✅",
            `<p>Hello ${user.name}, a provider has been selected for your task "${task.title}".</p>`
          );
        }
      } catch (err) {
        console.error("Email error (selectBid):", err);
      }
    })();

    res.status(200).json({ message: "Provider selected", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
