// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    nameBn: { type: String, required: true },
    nameEn: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: { type: [String], default: [] }, // Cloudinary URLs
    priceRegular: { type: Number }, // optional — only set when on sale
    priceCurrent: { type: Number, required: true },
    badge: {
      type: String,
      enum: ["none", "new", "bestseller", "preorder"],
      default: "none",
    },
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }, // homepage featured sections
    isTrending: { type: Boolean, default: false }, // hero spotlight card
    sortOrder: { type: Number, default: 0 },
    content: {
      intro: { type: String, default: "" },
      benefits: { type: [String], default: [] },
      ingredients: { type: [String], default: [] },
      usage: { type: [String], default: [] },
      whyUs: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
