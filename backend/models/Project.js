import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  github: { type: String },
  demo: { type: String },
  techStack: [{ type: String }],
});

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
