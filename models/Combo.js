// models/Combo.js
import mongoose from "mongoose";

const ComboSchema = new mongoose.Schema(
  {
    nameBn: { type: String, required: true },
    nameEn: { type: String, required: true },
    productIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
    priceRegular: { type: Number },
    priceCombo: { type: Number, required: true },
    image: { type: String, default: "" }, // Cloudinary URL
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Combo || mongoose.model("Combo", ComboSchema);
