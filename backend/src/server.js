import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import jobRoutes from "./routes/jobs.js";
import feedRoutes from "./routes/feed.js";
import chainRoutes from "./routes/blockchain.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

const PORT = process.env.PORT || 4000;

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in env");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI, { dbName: "rize_portal" });

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Rize Portal API" });
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/jobs", jobRoutes);
app.use("/feed", feedRoutes);
app.use("/blockchain", chainRoutes);
app.use("/ai", aiRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
