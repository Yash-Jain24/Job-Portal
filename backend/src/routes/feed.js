import { Router } from "express";
import { z } from "zod";
import Post from "../models/Post.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

const createSchema = z.object({
  content: z.string().min(1),
  tags: z.array(z.string()).default([])
});

router.post("/", authRequired, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const post = await Post.create({ ...parsed.data, owner: req.userId });
  res.json({ post });
});

router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json({ posts });
});

export default router;
