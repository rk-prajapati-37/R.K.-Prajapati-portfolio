import express from "express";
import Skill from "../models/Skill.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ name: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const s = new Skill(req.body);
    const saved = await s.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
