import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// ✅ Seed route to insert sample projects
router.get("/", async (req, res) => {
  try {
    const sampleProjects = [
      {
        title: "Portfolio Website",
        description: "A modern personal portfolio built with React, Tailwind CSS, and Node.js backend.",
       image: "http://localhost:5000/images/project1.jpg",
        github: "https://github.com/yourname/portfolio",
        demo: "https://yourportfolio.com",
        techStack: ["React", "Tailwind", "Node.js", "MongoDB"]
      },
      {
        title: "E-Commerce App",
        description: "Full-stack MERN application with product listings and payments integration.",
        image: "http://localhost:5000/images/project2.png",
        github: "https://github.com/yourname/ecommerce",
        demo: "https://myecommerceapp.com",
        techStack: ["MongoDB", "Express", "React", "Node.js"]
      }
    ];

    await Project.deleteMany({});
    const createdProjects = await Project.insertMany(sampleProjects);

    res.status(201).json({
      message: "✅ Projects seeded successfully!",
      count: createdProjects.length,
      data: createdProjects
    });
  } catch (error) {
    console.error("Error in /api/seed:", error);
    res.status(500).send("Server Error");
  }
});

export default router;
