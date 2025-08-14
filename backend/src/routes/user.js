import { Router } from "express";
import { z } from "zod";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/me", authRequired, async (req, res) => {
  const user = await User.findById(req.userId).lean();
  res.json({ user });
});

const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(1000).optional().default(""),
  linkedin: z.string().optional().default(""),
  skills: z.array(z.string()).optional().default([]),
  walletAddress: z.string().optional().default("")
});

router.put("/me", authRequired, async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const update = parsed.data;
  const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).lean();
  res.json({ user });
});

export default router;
