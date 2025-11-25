import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// ✅ GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
