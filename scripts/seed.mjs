// scripts/seed.mjs
//
// Populates the database with the real Pure Deshi catalog: 4 categories,
// 13 products, 1 combo, 3 example testimonials, default settings, and one
// admin login.
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
import Testimonial from "../models/Testimonial.js";
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
        introEn: "100% pure ghee sourced from Pabna farms, made the old way.",
        benefits: ["হজমে সহায়ক", "শরীরে শক্তি বাড়ায়", "রোগ প্রতিরোধ ক্ষমতা বাড়ায়"],
        benefitsEn: ["Supports digestion", "Boosts energy", "Strengthens immunity"],
        ingredients: ["১০০% খাঁটি গরুর দুধ", "পাবনার স্থানীয় খামার"],
        ingredientsEn: ["100% pure cow's milk", "Local farms in Pabna"],
        usage: [
          "ভাত, রুটি বা পরোটার সাথে ব্যবহার করুন",
          "ঠান্ডা ও শুকনো জায়গায় সংরক্ষণ করুন",
        ],
        usageEn: ["Use with rice, bread, or paratha", "Store in a cool, dry place"],
        whyUs: ["কোনো ভেজাল বা প্রিজারভেটিভ নেই", "সরাসরি খামার থেকে সংগ্রহ"],
        whyUsEn: ["No adulteration or preservatives", "Sourced directly from the farm"],
      },
    },
    {
      nameBn: "ঘানি ভাঙা সরিষার তেল",
      nameEn: "Ghani-pressed Mustard Oil",
      slug: "ghani-pressed-mustard-oil",
      category: categoryIdsBySlug["ghee-oil"],
      priceCurrent: 650,
      sortOrder: 2,
      content: {
        intro: "ঘানিতে ভাঙা খাঁটি সরিষার তেল, কোনো রাসায়নিক বা হিট প্রসেস ছাড়া।",
        introEn: "Pure mustard oil pressed in a traditional ghani, with no chemicals or heat processing.",
        benefits: ["ঠান্ডা-কাশি কমাতে সহায়ক", "রান্নায় ঘ্রাণ ও স্বাদ বাড়ায়", "ত্বক ও চুলের জন্য উপকারী"],
        benefitsEn: ["Helps with cold and cough relief", "Adds aroma and flavor to cooking", "Good for skin and hair"],
        ingredients: ["১০০% খাঁটি সরিষা", "ঘানিতে কোল্ড-প্রেস করা"],
        ingredientsEn: ["100% pure mustard seeds", "Cold-pressed in a ghani"],
        usage: ["রান্নায়, মাখা-ভর্তায় বা শরীরে মাখার জন্য ব্যবহার করুন", "ঠান্ডা জায়গায় সংরক্ষণ করুন"],
        usageEn: ["Use in cooking, with rice/bhorta, or for body massage", "Store in a cool place"],
        whyUs: ["কোনো মেশানো তেল বা রাসায়নিক নেই", "ঘানি থেকে সরাসরি সংগ্রহ"],
        whyUsEn: ["No mixed oil or chemicals", "Sourced directly from the ghani"],
      },
    },
    {
      nameBn: "কোল্ড প্রেস নারিকেল তেল",
      nameEn: "Cold-pressed Coconut Oil",
      slug: "cold-pressed-coconut-oil",
      category: categoryIdsBySlug["ghee-oil"],
      priceCurrent: 550,
      sortOrder: 3,
      content: {
        intro: "ঠান্ডা পদ্ধতিতে তোলা খাঁটি নারিকেল তেল, রান্না ও ত্বকের যত্নে ব্যবহারযোগ্য।",
        introEn: "Pure coconut oil extracted using the cold-press method, suitable for both cooking and skincare.",
        benefits: ["চুল ও ত্বকের জন্য উপকারী", "রান্নায় ব্যবহার করা যায়", "প্রাকৃতিক ময়েশ্চারাইজার হিসেবে কাজ করে"],
        benefitsEn: ["Good for hair and skin", "Can be used in cooking", "Works as a natural moisturizer"],
        ingredients: ["১০০% খাঁটি নারিকেল", "কোল্ড-প্রেস পদ্ধতিতে তৈরি"],
        ingredientsEn: ["100% pure coconut", "Cold-pressed"],
        usage: ["রান্নায় বা চুল-ত্বকে সরাসরি ব্যবহার করুন", "ঠান্ডায় জমাট বাঁধতে পারে, এটি স্বাভাবিক"],
        usageEn: ["Use directly in cooking or on hair/skin", "May solidify in cold weather — that's normal"],
        whyUs: ["কোনো রিফাইনিং বা রাসায়নিক প্রসেস নেই", "খাঁটি ও সতেজ"],
        whyUsEn: ["No refining or chemical processing", "Pure and fresh"],
      },
    },
    {
      nameBn: "মিল্ক বাটার",
      nameEn: "Milk Butter",
      slug: "milk-butter",
      category: categoryIdsBySlug["ghee-oil"],
      priceCurrent: 750,
      sortOrder: 4,
      content: {
        intro: "দুধ থেকে তোলা খাঁটি মাখন, কোনো মেশানো উপাদান ছাড়া।",
        introEn: "Pure butter churned from milk, with nothing added.",
        benefits: ["প্রাকৃতিক ক্যালসিয়াম ও পুষ্টির উৎস", "শিশুদের জন্য উপকারী", "রুটি-পরোটায় খেতে ভালো লাগে"],
        benefitsEn: ["A natural source of calcium and nutrition", "Good for children", "Tastes great with bread or paratha"],
        ingredients: ["১০০% খাঁটি গরুর দুধ"],
        ingredientsEn: ["100% pure cow's milk"],
        usage: ["রুটি, পরোটা বা টোস্টের সাথে খান", "ফ্রিজে সংরক্ষণ করুন"],
        usageEn: ["Eat with bread, paratha, or toast", "Store in the refrigerator"],
        whyUs: ["কোনো মেশানো ফ্যাট বা প্রিজারভেটিভ নেই", "দুধ থেকে সরাসরি তোলা"],
        whyUsEn: ["No added fat or preservatives", "Churned directly from milk"],
      },
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
      content: {
        intro: "কালিজিরা ফুলের মৌসুমে সংগ্রহ করা খাঁটি মধু, ঘ্রাণে ও স্বাদে আলাদা।",
        introEn: "Pure honey collected during the black seed flowering season, distinct in both aroma and taste.",
        benefits: ["রোগ প্রতিরোধ ক্ষমতা বাড়াতে সহায়ক", "হজমে সহায়ক", "প্রাকৃতিক এনার্জির উৎস"],
        benefitsEn: ["Helps boost immunity", "Supports digestion", "A natural source of energy"],
        ingredients: ["১০০% খাঁটি মধু", "কালিজিরা ফুলের মৌসুমে সংগ্রহ করা"],
        ingredientsEn: ["100% pure honey", "Collected during black seed flower season"],
        usage: ["সকালে খালি পেটে বা চায়ের সাথে খান", "রোদ থেকে দূরে শুকনো জায়গায় সংরক্ষণ করুন"],
        usageEn: ["Take on an empty stomach in the morning or with tea", "Store in a dry place away from sunlight"],
        whyUs: ["কোনো চিনি বা সিরাপ মেশানো নেই", "ল্যাবে পরীক্ষিত বিশুদ্ধতা"],
        whyUsEn: ["No added sugar or syrup", "Lab-tested purity"],
      },
    },
    {
      nameBn: "ধনিয়া ফুলের মধু",
      nameEn: "Coriander Flower Honey",
      slug: "coriander-flower-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 800,
      sortOrder: 2,
      content: {
        intro: "ধনিয়া ফুলের মৌসুমে সংগ্রহ করা হালকা স্বাদের খাঁটি মধু।",
        introEn: "A mild-flavored pure honey collected during the coriander flowering season.",
        benefits: ["হজমে সহায়ক", "ঠান্ডা-কাশিতে আরামদায়ক", "প্রতিদিনের পুষ্টির উৎস"],
        benefitsEn: ["Supports digestion", "Soothing for cold and cough", "A daily source of nutrition"],
        ingredients: ["১০০% খাঁটি মধু", "ধনিয়া ফুলের মৌসুমে সংগ্রহ করা"],
        ingredientsEn: ["100% pure honey", "Collected during coriander flower season"],
        usage: ["চা বা গরম পানির সাথে মিশিয়ে খান", "শুকনো ও ঠান্ডা জায়গায় সংরক্ষণ করুন"],
        usageEn: ["Mix with tea or warm water", "Store in a cool, dry place"],
        whyUs: ["কোনো ভেজাল নেই", "সরাসরি মৌচাক থেকে সংগ্রহ"],
        whyUsEn: ["No adulteration", "Collected directly from the hive"],
      },
    },
    {
      nameBn: "লিচু ফুলের মধু",
      nameEn: "Lychee Flower Honey",
      slug: "lychee-flower-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 900,
      sortOrder: 3,
      content: {
        intro: "লিচু ফুলের মৌসুমে সংগ্রহ করা সুমিষ্ট খাঁটি মধু।",
        introEn: "A sweet, pure honey collected during the lychee flowering season.",
        benefits: ["প্রাকৃতিক এনার্জি বুস্টার", "ত্বকের যত্নে উপকারী", "রোগ প্রতিরোধ ক্ষমতা বাড়ায়"],
        benefitsEn: ["A natural energy booster", "Good for skincare", "Helps boost immunity"],
        ingredients: ["১০০% খাঁটি মধু", "লিচু ফুলের মৌসুমে সংগ্রহ করা"],
        ingredientsEn: ["100% pure honey", "Collected during lychee flower season"],
        usage: ["সরাসরি খান বা পানিতে মিশিয়ে খান", "রোদ থেকে দূরে সংরক্ষণ করুন"],
        usageEn: ["Eat directly or mix with water", "Store away from sunlight"],
        whyUs: ["কোনো চিনি মেশানো নেই", "খাঁটি ও সতেজ"],
        whyUsEn: ["No added sugar", "Pure and fresh"],
      },
    },
    {
      nameBn: "সরিষা ফুলের মধু",
      nameEn: "Mustard Flower Honey",
      slug: "mustard-flower-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 750,
      sortOrder: 4,
      content: {
        intro: "সরিষা ফুলের মৌসুমে সংগ্রহ করা গাঢ় স্বাদের খাঁটি মধু।",
        introEn: "A rich-flavored pure honey collected during the mustard flowering season.",
        benefits: ["শরীরে শক্তি বাড়ায়", "ঠান্ডা আবহাওয়ায় বিশেষ উপকারী", "হজমে সহায়ক"],
        benefitsEn: ["Boosts energy", "Especially good in cold weather", "Supports digestion"],
        ingredients: ["১০০% খাঁটি মধু", "সরিষা ফুলের মৌসুমে সংগ্রহ করা"],
        ingredientsEn: ["100% pure honey", "Collected during mustard flower season"],
        usage: ["সকালে বা রাতে দুধ-রুটির সাথে খান", "ঠান্ডায় জমাট বাঁধতে পারে — এটি স্বাভাবিক"],
        usageEn: ["Take with milk or bread, morning or night", "May crystallize in cold weather — that's normal"],
        whyUs: ["কোনো ভেজাল নেই", "সরাসরি মৌচাক থেকে সংগ্রহ"],
        whyUsEn: ["No adulteration", "Collected directly from the hive"],
      },
    },
    {
      nameBn: "মিশ্র ফুলের মধু",
      nameEn: "Mixed Flower Honey",
      slug: "mixed-flower-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 700,
      sortOrder: 5,
      content: {
        intro: "বিভিন্ন ফুলের মিশ্রণ থেকে সংগ্রহ করা সুষম স্বাদের খাঁটি মধু।",
        introEn: "A balanced-tasting pure honey collected from a mix of different flowers.",
        benefits: ["দৈনন্দিন পুষ্টির ভালো উৎস", "রোগ প্রতিরোধ ক্ষমতা বাড়ায়", "পরিবারের সবার জন্য উপযোগী"],
        benefitsEn: ["A good everyday source of nutrition", "Helps boost immunity", "Suitable for the whole family"],
        ingredients: ["১০০% খাঁটি মধু", "একাধিক ফুলের মৌসুম থেকে সংগ্রহ করা"],
        ingredientsEn: ["100% pure honey", "Collected across multiple flower seasons"],
        usage: ["চা, রুটি বা সরাসরি খান", "শুকনো জায়গায় সংরক্ষণ করুন"],
        usageEn: ["Have with tea, bread, or on its own", "Store in a dry place"],
        whyUs: ["কোনো চিনি বা সিরাপ মেশানো নেই", "পরিবারের জন্য নিরাপদ পছন্দ"],
        whyUsEn: ["No added sugar or syrup", "A safe choice for the whole family"],
      },
    },
    {
      nameBn: "প্রাকৃতিক চাকের মধু",
      nameEn: "Natural Honeycomb Honey",
      slug: "natural-honeycomb-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 1350,
      sortOrder: 6,
      content: {
        intro: "মৌচাক থেকে সরাসরি সংগ্রহ করা সম্পূর্ণ প্রাকৃতিক মধু, বেশি প্রসেস করা হয়নি।",
        introEn: "Completely natural honey collected directly from the comb, minimally processed.",
        benefits: ["সবচেয়ে কম প্রসেসড", "প্রাকৃতিক এনজাইম ও পুষ্টি ধরে রাখে", "রোগ প্রতিরোধ ক্ষমতা বাড়ায়"],
        benefitsEn: ["The least processed option", "Retains natural enzymes and nutrition", "Helps boost immunity"],
        ingredients: ["১০০% খাঁটি মধু", "সরাসরি মৌচাক থেকে সংগ্রহ"],
        ingredientsEn: ["100% pure honey", "Collected directly from the honeycomb"],
        usage: ["সরাসরি খান বা রুটির সাথে খান", "ঘরের স্বাভাবিক তাপমাত্রায় সংরক্ষণ করুন"],
        usageEn: ["Eat directly or with bread", "Store at normal room temperature"],
        whyUs: ["কোনো হিট প্রসেস বা ফিল্টারিং নেই", "সবচেয়ে খাঁটি রূপে পাবেন"],
        whyUsEn: ["No heat processing or filtering", "Honey in its purest form"],
      },
    },
    {
      nameBn: "সুন্দরবনের মধু",
      nameEn: "Sundarban Honey",
      slug: "sundarban-honey",
      category: categoryIdsBySlug["honey"],
      priceCurrent: 1200,
      isTrending: true, // drives the hero spotlight card
      sortOrder: 7,
      content: {
        intro: "সুন্দরবনের গহীন বন থেকে সংগ্রহ করা খাঁটি মধু, স্বাদ ও মানে অনন্য।",
        introEn: "Pure honey collected from deep within the Sundarbans, unique in both taste and quality.",
        benefits: ["প্রাকৃতিক এনার্জির উৎস", "রোগ প্রতিরোধ ক্ষমতা বাড়ায়", "হজমে সহায়ক"],
        benefitsEn: ["A natural source of energy", "Helps boost immunity", "Supports digestion"],
        ingredients: ["১০০% খাঁটি মধু", "সুন্দরবনের স্থানীয় মৌয়ালদের থেকে সংগ্রহ"],
        ingredientsEn: ["100% pure honey", "Sourced from local honey collectors in the Sundarbans"],
        usage: ["সকালে খালি পেটে বা চায়ের সাথে খান", "শুকনো ও ঠান্ডা জায়গায় সংরক্ষণ করুন"],
        usageEn: ["Take on an empty stomach in the morning or with tea", "Store in a cool, dry place"],
        whyUs: ["সরাসরি সুন্দরবনের মৌয়ালদের কাছ থেকে সংগ্রহ", "কোনো ভেজাল বা সংরক্ষক নেই"],
        whyUsEn: ["Sourced directly from Sundarban honey collectors", "No adulteration or preservatives"],
      },
    },

    // Rice
    {
      nameBn: "ঢেঁকি ছাটা লাল চাল (প্রতি কেজি)",
      nameEn: "Hand-pounded Red Rice (per kg)",
      slug: "hand-pounded-red-rice",
      category: categoryIdsBySlug["rice"],
      priceCurrent: 180,
      sortOrder: 1,
      content: {
        intro: "ঢেঁকিতে ছাটা লাল চাল, চালের প্রাকৃতিক পুষ্টিগুণ অক্ষত রেখে তৈরি।",
        introEn: "Red rice hand-pounded using a traditional dheki, keeping the rice's natural nutrition intact.",
        benefits: ["ফাইবার সমৃদ্ধ", "রক্তে শর্করার মাত্রা নিয়ন্ত্রণে সহায়ক", "দীর্ঘ সময় পেট ভরা রাখে"],
        benefitsEn: ["Rich in fiber", "Helps manage blood sugar levels", "Keeps you full for longer"],
        ingredients: ["১০০% খাঁটি দেশি ধান", "ঢেঁকিতে ছাটা"],
        ingredientsEn: ["100% pure local paddy", "Hand-pounded using a dheki"],
        usage: ["ভাত রান্নার জন্য সাধারণ চালের মতোই ব্যবহার করুন", "শুকনো জায়গায় সংরক্ষণ করুন"],
        usageEn: ["Use just like regular rice for cooking", "Store in a dry place"],
        whyUs: ["মেশিনে ছাটা চালের তুলনায় বেশি পুষ্টিগুণ ধরে রাখে", "সরাসরি কৃষকের কাছ থেকে সংগ্রহ"],
        whyUsEn: ["Retains more nutrition than machine-milled rice", "Sourced directly from farmers"],
      },
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
      content: {
        intro: "ফরমালিনমুক্ত পরীক্ষিত আম, সরাসরি বাগান থেকে সংগ্রহ করে আনা হয়।",
        introEn: "Formalin-tested mangoes, sourced directly from the orchard.",
        benefits: ["কোনো ক্ষতিকর রাসায়নিক নেই", "প্রাকৃতিকভাবে পাকানো", "ভিটামিন সি সমৃদ্ধ"],
        benefitsEn: ["No harmful chemicals", "Naturally ripened", "Rich in Vitamin C"],
        ingredients: ["১০০% প্রাকৃতিক আম", "মৌসুমভিত্তিক সংগ্রহ"],
        ingredientsEn: ["100% natural mango", "Seasonal harvest"],
        usage: ["সরাসরি খান বা জুস/শরবত বানিয়ে খান", "ফ্রিজে সংরক্ষণ করলে বেশি দিন ভালো থাকে"],
        usageEn: ["Eat directly or make juice/sharbat", "Keeps longer when refrigerated"],
        whyUs: ["ফরমালিন পরীক্ষা করে নিশ্চিত করা হয়", "সরাসরি বাগান থেকে প্রি-অর্ডারে সংগ্রহ"],
        whyUsEn: ["Formalin-tested for safety", "Sourced via pre-order directly from the orchard"],
      },
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

// ── Testimonials ────────────────────────────────────────────────────────
// These are the same example reviews that used to be hardcoded directly in
// components/site/Testimonials.js. They're seeded here so the homepage
// isn't empty on first run, but they're now just starting data — replace
// them with real customer reviews via the admin "গ্রাহক মতামত" page
// whenever you have them, no code change needed.
const testimonials = [
  {
    avatar: "রবে",
    nameBn: "রহিমা বেগম",
    nameEn: "Rahima Begum",
    roleBn: "গৃহিণী",
    roleEn: "Homemaker",
    textBn: "প্রথমবার ঘি অর্ডার করেছিলাম, স্বাদ একদম দাদীর হাতের মতো লাগলো।",
    textEn: "I ordered the ghee for the first time — it tasted just like my grandmother used to make.",
    sortOrder: 1,
  },
  {
    avatar: "কহ",
    nameBn: "কামরুল হাসান",
    nameEn: "Kamrul Hasan",
    roleBn: "ব্যবসায়ী",
    roleEn: "Business owner",
    textBn: "সরিষার তেলের ঘ্রাণ আর মান অসাধারণ, এখন থেকে এখান থেকেই নিচ্ছি।",
    textEn: "The mustard oil's smell and quality are amazing — I only buy from here now.",
    sortOrder: 2,
  },
  {
    avatar: "নআ",
    nameBn: "নাজনীন আক্তার",
    nameEn: "Nazneen Akter",
    roleBn: "শিক্ষিকা",
    roleEn: "Teacher",
    textBn: "মধু একদম খাঁটি লেগেছে, পরিবারের সবাই পছন্দ করেছে।",
    textEn: "The honey felt completely pure — my whole family loved it.",
    sortOrder: 3,
  },
];

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

  // Testimonials — only seed if the collection is completely empty, so
  // re-running this script doesn't resurrect reviews an admin has since
  // edited or deleted from the admin panel.
  console.log("\nChecking testimonials...");
  const existingTestimonialCount = await Testimonial.countDocuments();
  if (existingTestimonialCount > 0) {
    console.log("  - Testimonials already exist, left untouched.");
  } else {
    for (const item of testimonials) {
      await Testimonial.create(item);
      console.log(`  - ${item.nameBn} / ${item.nameEn}`);
    }
  }

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
