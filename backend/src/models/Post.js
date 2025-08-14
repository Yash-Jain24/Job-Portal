import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
