import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"], default: "Intermediate" },
  percent: { type: Number, min: 0, max: 100, default: 60 },
});

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
