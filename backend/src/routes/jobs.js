import { Router } from "express";
import { z } from "zod";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  skills: z.array(z.string()).default([]),
  location: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  budget: z.string().optional().default("")
});

function hoursDiff(a, b) {
  return Math.abs(a.getTime() - b.getTime()) / 36e5;
}

router.post("/", authRequired, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const user = await User.findById(req.userId);
  const validHours = Number(process.env.PAYMENT_VALID_FOR_HOURS || 12);
  if (!user.lastPaidAt || hoursDiff(new Date(), user.lastPaidAt) > validHours) {
    return res.status(402).json({ error: "Payment required before posting a job" });
  }

  const job = await Job.create({ ...parsed.data, owner: req.userId });
  res.json({ job });
});

router.get("/", async (req, res) => {
  const { skill, location, tag, q, owner } = req.query;
  const filter = {};
  if (skill) filter.skills = skill;
  if (location) filter.location = new RegExp(location, "i");
  if (tag) filter.tags = tag;
  if (owner) filter.owner = owner;
  if (q) {
    filter.$or = [
      { title: new RegExp(q, "i") },
      { description: new RegExp(q, "i") }
    ];
  }
  const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ jobs });
});

export default router;
