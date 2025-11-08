import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// Save contact form
router.post("/", async (req, res) => {
  try {
    const c = new Contact(req.body);
    const saved = await c.save();
    // Optionally: send email here using nodemailer
    res.status(201).json({ message: "Message received", data: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Optional: list contacts (for admin)
router.get("/", async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
