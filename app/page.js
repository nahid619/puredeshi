// app/page.js
//
// The real public homepage (Section 5 of spec) — replaces the Phase 1-3
// placeholder. Everything here is fetched live from MongoDB rather than
// hardcoded, per Phase 4's checklist. This file is a Server Component so
// the data fetch happens at request time on the server; the interactive
// bits (language/theme toggle, scroll reveals, WhatsApp buttons) live in
// the client components it renders.

import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Combo from "@/models/Combo";
import Settings from "@/models/Settings";
import Testimonial from "@/models/Testimonial";
import HomeClient from "@/components/site/HomeClient";

// Always fetch fresh data — this is a small catalog, not a high-traffic
// store, and admins expect their edits to show up immediately.
export const dynamic = "force-dynamic";

async function getSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

export default async function HomePage() {
  await connectToDatabase();

  const [categoriesRaw, productsRaw, combosRaw, settingsRaw, testimonialsRaw] = await Promise.all([
    Category.find().sort({ sortOrder: 1 }),
    Product.find().populate("category"),
    Combo.find({ isActive: true }).populate("productIds"),
    getSettings(),
    Testimonial.find({ isActive: true }).sort({ sortOrder: 1 }),
  ]);

  // Plain-JSON-serialize everything before handing it to a Client Component
  // (Mongoose documents aren't serializable as React props as-is).
  const categories = JSON.parse(JSON.stringify(categoriesRaw));
  const products = JSON.parse(JSON.stringify(productsRaw));
  const combos = JSON.parse(JSON.stringify(combosRaw));
  const settings = JSON.parse(JSON.stringify(settingsRaw));
  const testimonials = JSON.parse(JSON.stringify(testimonialsRaw));

  // isTrending specifically drives the hero spotlight card; isFeatured is a
  // separate, lighter-touch flag that just sorts a product first within its
  // own category grid (see productsByCategory below). If no admin has set
  // isTrending yet, fall back to isFeatured, then to the first in-stock item.
  const featuredProduct =
    products.find((p) => p.isTrending && p.inStock) ||
    products.find((p) => p.isFeatured && p.inStock) ||
    products.find((p) => p.inStock) ||
    null;

  const activeCombo = combos[0] || null;

  const productsByCategory = {};
  for (const p of products) {
    const catId = p.category?._id;
    if (!catId) continue;
    if (!productsByCategory[catId]) productsByCategory[catId] = [];
    productsByCategory[catId].push(p);
  }
  // Featured products surface first within their own category grid.
  for (const catId in productsByCategory) {
    productsByCategory[catId].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return (
    <HomeClient
      categories={categories}
      productsByCategory={productsByCategory}
      featuredProduct={featuredProduct}
      activeCombo={activeCombo}
      settings={settings}
      testimonials={testimonials}
    />
  );
}