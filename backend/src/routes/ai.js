
import { Router } from "express";
import { SKILLS } from "../utils/skillsList.js";
import { z } from "zod";

const router = Router();

const schema = z.object({ text: z.string().min(1) });

router.post("/extract-skills", (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const text = parsed.data.text.toLowerCase();
  const found = [];
  for (const s of SKILLS) {
    const re = new RegExp(`\\b${s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(text)) found.push(s);
  }
  const uniq = Array.from(new Set(found));
  res.json({ skills: uniq });
});

export default router;
