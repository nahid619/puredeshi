// scripts/seed.mjs
//
// Populates the database with the real Pure Deshi catalog: 4 categories,
// 13 products, 1 combo, default settings, and one admin login.
//
// Safe to run more than once — it upserts by slug/username instead of
// blindly inserting, so re-running this won't create duplicates.
//
// Run with:  npm run seed
// (this loads .env.local automatically via Node's --env-file flag)

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Combo from "../models/Combo.js";
import Settings from "../models/Settings.js";
import Admin from "../models/Admin.js";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  console.error(
    "\n❌ MONGODB_URI is not set.\n   Add it to .env.local first, then run: npm run seed\n"
  );
  process.exit(1);
}

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error(
    "\n❌ ADMIN_USERNAME and ADMIN_PASSWORD are not set.\n   Add both to .env.local first, then run: npm run seed\n"
  );
  process.exit(1);
}

// ── Categories (exact icon names + slugs used by the homepage mockup) ──────
const categories = [
  { nameBn: "মধু", nameEn: "Honey", slug: "honey", icon: "ti-droplet", sortOrder: 1, taglineBn: "আমাদের সিগনেচার", taglineEn: "Our signature" },
  { nameBn: "ঘি ও তেল", nameEn: "Ghee & Oil", slug: "ghee-oil", icon: "ti-flask", sortOrder: 2, taglineBn: "রান্নার মূল উপকরণ", taglineEn: "Kitchen essentials" },
  { nameBn: "চাল", nameEn: "Rice", slug: "rice", icon: "ti-package", sortOrder: 3, taglineBn: "ভাতের জন্য", taglineEn: "For your rice" },
  { nameBn: "সিজনাল ফল", nameEn: "Seasonal Fruit", slug: "seasonal", icon: "ti-calendar", sortOrder: 4, taglineBn: "সিজনাল", taglineEn: "Seasonal" },
];

async function upsertCategory(data) {
  return Category.findOneAndUpdate(
    { slug: data.slug },
    data,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

// ── Products (Section 4 of the project spec — real catalog, real prices) ───
function buildProducts(categoryIdsBySlug) {
  return [
    // Ghee & Oil
    {
      nameBn: "পাবনার খাঁটি ঘি",
      nameEn: "Pabna Pure Ghee",
      slug: "pabna-pure-ghee",
      category: categoryIdsBySlug["ghee-oil"],
      priceRegular: 1050,
      priceCurrent: 950,
      sortOrder: 1,
      // Real content from the admin mockup's worked example — note: "ঐতিহ্যবাহী"
      // intentionally avoided in the intro per the client's explicit brand-voice
      // correction (Section 3 of the spec), even though the original mockup
      // placeholder used it.
      content: {
        intro:
          "পাবনার খামার থেকে সংগ্রহ করা ১০০% খাঁটি ঘি, পুরনো নিয়মে তৈরি।",
        benefits: ["হজমে সহায়ক", "শরীরে শক্তি বাড়ায়", "রোগ প্রতিরোধ ক্ষমতা বাড়ায়"],
        ingredients: ["১০০% খাঁটি গরুর দুধ", "পাবনার স্থানীয় খামার"],
        usage: [
          "ভাত, রুটি বা পরোটার সাথে ব্যবহার করুন",
          "ঠান্ডা ও শুকনো জায়গায় সংরক্ষণ করুন",
        ],
        whyUs: ["কোনো ভেজাল বা প্রিজারভেটিভ নেই", "সরাসরি খামার থেকে সংগ্রহ"],
      },
    },
    {
      nameBn: "ঘানি ভাঙা সরিষার তেল",
      nameEn: "Ghani-pressed Mustard Oil",
      slug: "ghani-pressed-mustard-oil",
      category: categoryIdsBySlug["ghee-oil"],
      priceCurrent: 650,
      sortOrder: 2,
    },
    {
      nameBn: "কোল্ড প্রেস নারিকেল তেল",
      nameEn: "Cold-pressed Coconut Oil",
      slug: "cold-pressed-coconut-oil",
      category: categoryIdsBySlug["ghee-oil"],
      priceCurrent: 550,
      sortOrder: 3,
    },
    {
      nameBn: "মিল্ক বাটার",
      nameEn: "Milk Butter",
      slug: "milk-butter",
      category: categoryIdsBySlug["ghee-oil"],
      priceCurrent: 750,
      sortOrder: 4,
    },

    // Honey
    {
      nameBn: "কালিজিরা ফুলের মধু",
      nameEn: "Black Seed Flower Honey",
      slug: "black-seed-flower-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 850,
      badge: "new",
      sortOrder: 1,
    },
    {
      nameBn: "ধনিয়া ফুলের মধু",
      nameEn: "Coriander Flower Honey",
      slug: "coriander-flower-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 800,
      sortOrder: 2,
    },
    {
      nameBn: "লিচু ফুলের মধু",
      nameEn: "Lychee Flower Honey",
      slug: "lychee-flower-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 900,
      sortOrder: 3,
    },
    {
      nameBn: "সরিষা ফুলের মধু",
      nameEn: "Mustard Flower Honey",
      slug: "mustard-flower-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 750,
      sortOrder: 4,
    },
    {
      nameBn: "মিশ্র ফুলের মধু",
      nameEn: "Mixed Flower Honey",
      slug: "mixed-flower-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 700,
      sortOrder: 5,
    },
    {
      nameBn: "প্রাকৃতিক চাকের মধু",
      nameEn: "Natural Honeycomb Honey",
      slug: "natural-honeycomb-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 1350,
      sortOrder: 6,
    },
    {
      nameBn: "সুন্দরবনের মধু",
      nameEn: "Sundarban Honey",
      slug: "sundarban-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 1200,
      isTrending: true, // drives the hero spotlight card
      sortOrder: 7,
    },

    // Rice
    {
      nameBn: "ঢেঁকি ছাটা লাল চাল (প্রতি কেজি)",
      nameEn: "Hand-pounded Red Rice (per kg)",
      slug: "hand-pounded-red-rice",
      category: categoryIdsBySlug["rice"],
      priceCurrent: 180,
      sortOrder: 1,
    },

    // Seasonal
    {
      nameBn: "ফরমালিন মুক্ত আম",
      nameEn: "Formalin-free Mango",
      slug: "formalin-free-mango",
      category: categoryIdsBySlug["seasonal"],
      priceCurrent: 450,
      badge: "preorder",
      sortOrder: 1,
    },
  ];
}

async function upsertProduct(data) {
  return Product.findOneAndUpdate(
    { slug: data.slug },
    data,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected.\n");

  // Categories
  console.log("Seeding categories...");
  const categoryDocs = {};
  for (const cat of categories) {
    const doc = await upsertCategory(cat);
    categoryDocs[cat.slug] = doc._id;
    console.log(`  - ${cat.nameBn} / ${cat.nameEn}`);
  }

  // Products
  console.log("\nSeeding products...");
  const products = buildProducts(categoryDocs);
  const productDocs = {};
  for (const p of products) {
    const doc = await upsertProduct(p);
    productDocs[p.slug] = doc._id;
    console.log(`  - ${p.nameBn} / ${p.nameEn} — ৳${p.priceCurrent}`);
  }

  // Combo — Breakfast Combo (Ghee + Honey + Butter)
  console.log("\nSeeding combo...");
  await Combo.findOneAndUpdate(
    { nameEn: "Breakfast Combo (Ghee + Honey + Butter)" },
    {
      nameBn: "ব্রেকফাস্ট কম্বো — ঘি + মধু + মাখন",
      nameEn: "Breakfast Combo (Ghee + Honey + Butter)",
      productIds: [
        productDocs["pabna-pure-ghee"],
        productDocs["mixed-flower-honey"],
        productDocs["milk-butter"],
      ],
      priceRegular: 2200,
      priceCombo: 1850,
      isActive: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("  - ব্রেকফাস্ট কম্বো / Breakfast Combo — ৳1850");

  // Settings — only create if it doesn't already exist (don't overwrite
  // real values the admin may have already set in Settings).
  console.log("\nChecking settings...");
  const existingSettings = await Settings.findOne();
  if (existingSettings) {
    console.log("  - Settings document already exists, left untouched.");
  } else {
    await Settings.create({});
    console.log("  - Created default settings document.");
  }

  // Admin user — create if missing, otherwise reset the password to
  // whatever is currently in .env.local (handy if you forget it).
  console.log("\nSeeding admin user...");
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME });
  if (existingAdmin) {
    existingAdmin.passwordHash = passwordHash;
    await existingAdmin.save();
    console.log(`  - Updated password for existing admin "${ADMIN_USERNAME}".`);
  } else {
    await Admin.create({ username: ADMIN_USERNAME, passwordHash });
    console.log(`  - Created admin user "${ADMIN_USERNAME}".`);
  }

  console.log("\n✅ Seeding complete.\n");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("\n❌ Seeding failed:", err);
  process.exit(1);
});
