import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// Save contact form
router.post("/", async (req, res) => {
  try {
    const c = new Contact(req.body);
    const saved = await c.save();
    res.status(201).json({ message: "Message received", data: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all contacts (for admin)
router.get("/", async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a contact
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
