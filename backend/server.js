import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"; // ✅ add this line
import projectsRouter from "./routes/projects.js";
import skillsRouter from "./routes/skills.js";
import testimonialsRouter from "./routes/testimonials.js";
import contactRouter from "./routes/contact.js";
import seedRouter from "./routes/seed.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ enable CORS before routes
app.use(cors({ origin: "http://localhost:3000" }));

// ✅ parse JSON
app.use(express.json());

// ✅ Serve static images
app.use("/images", express.static(path.join(__dirname, "images")));

const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => res.send("Server is running successfully!"));

app.use("/api/projects", projectsRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/seed", seedRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
