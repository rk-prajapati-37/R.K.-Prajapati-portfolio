import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import projectsRouter from "./routes/projects.js";
import skillsRouter from "./routes/skills.js";
import testimonialsRouter from "./routes/testimonials.js";
import contactRouter from "./routes/contact.js";
import seedRouter from "./routes/seed.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// 🧩 Add these 4 lines 👇 (right after express.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "public/images")));
// Now backend can serve images from /backend/public/images

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => res.send("Server is running successfully!"));

// Mount routes
app.use("/api/projects", projectsRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/seed", seedRouter);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
