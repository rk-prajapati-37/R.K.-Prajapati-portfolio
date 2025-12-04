import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  name: String,
  role: String,
  message: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
