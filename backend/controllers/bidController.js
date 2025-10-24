import Task from "../models/Task.js";

// POST: service provider places bid
export const placeBid = async (req, res) => {
  try {
    const { taskId, proposedCost, proposedTime } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const newBid = {
      providerId: req.user.id, // from JWT
      proposedCost,
      proposedTime,
    };

    task.bids.push(newBid);
    await task.save();

    res.status(201).json({ message: "Bid placed successfully", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT: User selects a bid
export const selectBid = async (req, res) => {
  try {
    const { taskId, bidId } = req.body;
    console.log('Backend - Selecting bid:', { taskId, bidId });
    
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    console.log('Backend - Found task:', task.title);
    console.log('Backend - Task bids:', task.bids);

    // Update all bids
    task.bids.forEach((bid) => {
      bid.status = bid._id.toString() === bidId ? "accepted" : "rejected";
    });

    const selectedBid = task.bids.find((bid) => bid._id.toString() === bidId);
    console.log('Backend - Selected bid:', selectedBid);
    
    task.selectedProviderId = selectedBid.providerId;
    task.status = "assigned";

    console.log('Backend - Updated task:', {
      selectedProviderId: task.selectedProviderId,
      status: task.status
    });

    await task.save();
    res.status(200).json({ message: "Provider selected", task });
  } catch (err) {
    console.error('Backend - Error selecting bid:', err);
    res.status(500).json({ message: err.message });
  }
};
