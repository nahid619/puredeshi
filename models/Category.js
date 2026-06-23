// models/Category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    nameBn: { type: String, required: true },
    nameEn: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: "ti-category" }, // Tabler icon name
    sortOrder: { type: Number, default: 0 },
    // Short descriptive line shown above the category name on the public
    // homepage (e.g. "Kitchen essentials" above "Ghee & Oil"). Optional —
    // falls back to the category name itself if left blank.
    taglineBn: { type: String, default: "" },
    taglineEn: { type: String, default: "" },
  },
  { timestamps: true }
);

// Reuse the existing compiled model on hot-reload instead of recompiling it.
export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
