import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    skills: { type: [String], default: [] },
    walletAddress: { type: String, default: "" },
    lastPaidAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
