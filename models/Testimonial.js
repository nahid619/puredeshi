// models/Testimonial.js
//
// Real customer reviews shown in the homepage "What customers say" section.
// Previously these were hardcoded placeholder examples in
// components/site/Testimonials.js — this collection replaces that so they
// can be added/edited/removed from the admin panel without a code change.

import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    avatar: { type: String, default: "" }, // 1-2 letter initials, e.g. "রবে"
    nameBn: { type: String, required: true },
    nameEn: { type: String, required: true },
    roleBn: { type: String, default: "" },
    roleEn: { type: String, default: "" },
    textBn: { type: String, required: true },
    textEn: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);