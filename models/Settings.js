// models/Settings.js
//
// This collection is meant to hold exactly ONE document — site-wide settings
// like the WhatsApp number and order message templates. The API route
// (app/api/settings/route.js) enforces the singleton behavior: it creates
// the one document if it doesn't exist yet, and always updates that same
// document rather than creating new ones.

import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    whatsappNumber: { type: String, default: "+8801XXXXXXXXX" },
    orderMessageTemplateBn: {
      type: String,
      default: "আমি {প্রোডাক্ট} ({দাম}) অর্ডার করতে চাই।",
    },
    orderMessageTemplateEn: {
      type: String,
      default: "I would like to order {product} ({price}).",
    },
    facebookUrl: {
      type: String,
      default: "https://www.facebook.com/puredeshi0",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
