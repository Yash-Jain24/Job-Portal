import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    location: { type: String, default: "" },
    tags: { type: [String], default: [] },
    budget: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
