// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "provider"],
      default: "user",
    },

    // Extra fields for service providers only
    phone: { type: String },
    city: { type: String },
    category: { type: String },
    
    // Provider rating fields
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
