// models/Banner.js
import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Cloudinary URL
    link: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Banner ||
  mongoose.model("Banner", BannerSchema);
