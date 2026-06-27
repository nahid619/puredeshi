// models/Settings.js
//
// This collection is meant to hold exactly ONE document — site-wide settings
// like the WhatsApp number, order message templates, branding (tagline/logo),
// the homepage "Our Story" section, and the trust-badge strip. The API route
// (app/api/settings/route.js) enforces the singleton behavior: it creates
// the one document if it doesn't exist yet, and always updates that same
// document rather than creating new ones.
//
// Anything with sensible launch-ready defaults below will appear correctly
// the moment Settings.create({}) runs (see scripts/seed.mjs) — no separate
// seeding step needed for these fields.

import mongoose from "mongoose";

// Small reusable shape for any bilingual text field.
const LocalizedTextSchema = new mongoose.Schema(
  { bn: { type: String, default: "" }, en: { type: String, default: "" } },
  { _id: false }
);

// The homepage trust strip is always exactly 4 short badges (icon + label),
// so this stays a fixed-size array inside Settings rather than its own
// collection — simpler to edit as a group from the admin Settings page.
const TrustBadgeSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "ti-shield-check" }, // Tabler icon class, e.g. "ti-leaf"
    bn: { type: String, default: "" },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const SettingsSchema = new mongoose.Schema(
  {
    whatsappNumber: { type: String, default: "+8801XXXXXXXXX" },
    // Separate from whatsappNumber on purpose — this is the plain phone
    // number shown in the topbar as a tap-to-call (tel:) link. It can be a
    // landline or a different number entirely from the WhatsApp one; they
    // were two separate elements in the original mockup and shouldn't have
    // been collapsed into one.
    phoneNumber: { type: String, default: "+8801XXXXXXXXX" },
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

    // ── Branding ────────────────────────────────────────────────────────
    tagline: {
      type: LocalizedTextSchema,
      default: () => ({ bn: "বিশুদ্ধতার পরিচয়", en: "The mark of purity" }),
    },
    // Falls back to the bundled local image until an admin uploads a real
    // logo via Cloudinary (same upload flow as banners/products).
    logoUrl: { type: String, default: "/images/logo-emblem.png" },

    // ── Homepage "Our Story" section ───────────────────────────────────
    // Corrected from an earlier draft that mistakenly said Pabna — the
    // brand actually started in Rajshahi.
    storyTitle: {
      type: LocalizedTextSchema,
      default: () => ({
        bn: "রাজশাহীর মাটি থেকে শুরু",
        en: "Where it all began, in Rajshahi",
      }),
    },
    storyBody: {
      type: LocalizedTextSchema,
      default: () => ({
        bn: "ঘানি ভাঙা সরিষার তেল, ঢেঁকিতে ছাটা লাল চাল, আর সাত রকমের ফুলের মধু — আমরা পুরনো নিয়ম ধরে রেখেছি, যাতে প্রতিটি পণ্যে থাকে আসল স্বাদ আর বিশুদ্ধতা। কোনো শর্টকাট নেই, কোনো রাসায়নিক নেই — অনেক বছর ধরে চলে আসা পদ্ধতিতেই তৈরি হয় সব।",
        en: "Ghani-pressed mustard oil, hand-pounded red rice, and seven kinds of pure honey — we've kept the old methods alive, so every product keeps its real taste and purity. No shortcuts, no chemicals — just methods passed down for years.",
      }),
    },

    // ── Trust strip (the 4 badges under the hero) ──────────────────────
    trustBadges: {
      type: [TrustBadgeSchema],
      default: () => [
        { icon: "ti-shield-check", bn: "ফরমালিনমুক্ত", en: "No formalin" },
        { icon: "ti-leaf", bn: "পুরনো নিয়মে তৈরি", en: "Made the old way" },
        { icon: "ti-cash", bn: "ক্যাশ অন ডেলিভারি", en: "Cash on delivery" },
        { icon: "ti-truck-delivery", bn: "সারাদেশে ডেলিভারি", en: "Delivery nationwide" },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);