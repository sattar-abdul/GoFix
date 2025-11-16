import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  proposedCost: Number,
  proposedTime: Date,
  status: { type: String, default: "pending" }, // pending/accepted/rejected
}, { timestamps: true });

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    image: { type: String, default: "" }, // stores image URL
    bids: [bidSchema],
    selectedProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: { type: String, default: "open" }, // open/assigned/completed
    completedAt: { type: Date },
    rating: {
      score: { type: Number, min: 1, max: 5 },
      review: { type: String },
      ratedAt: { type: Date }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
