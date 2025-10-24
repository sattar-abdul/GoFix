import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    skills: [String],
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceProvider", serviceProviderSchema);