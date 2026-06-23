// app/products/[slug]/page.js
//
// Naturo-style product detail page (Section 5/Phase 4 of spec) — intro,
// benefits, ingredients, usage, and "why us", all pulled from the
// product's `content` field that the admin panel's product form writes to.

import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Settings from "@/models/Settings";
import Combo from "@/models/Combo";
import ProductDetailClient from "@/components/site/ProductDetailClient";

export const dynamic = "force-dynamic";

async function getSettings() {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  await connectToDatabase();

  const [productRaw, categoriesRaw, settingsRaw, combosRaw] = await Promise.all([
    Product.findOne({ slug }).populate("category"),
    Category.find().sort({ sortOrder: 1 }),
    getSettings(),
    Combo.find({ isActive: true }),
  ]);

  if (!productRaw) {
    notFound();
  }

  const product = JSON.parse(JSON.stringify(productRaw));
  const categories = JSON.parse(JSON.stringify(categoriesRaw));
  const settings = JSON.parse(JSON.stringify(settingsRaw));
  const hasActiveCombo = combosRaw.length > 0;

  return (
    <ProductDetailClient
      product={product}
      categories={categories}
      settings={settings}
      hasActiveCombo={hasActiveCombo}
    />
  );
}
