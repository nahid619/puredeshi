// components/site/HomeClient.js
"use client";

import { SiteProviders } from "./SiteProviders";
import Header from "./Header";
import Hero from "./Hero";
import TrustStrip from "./TrustStrip";
import CategoryNav from "./CategoryNav";
import ProductSection from "./ProductSection";
import Story from "./Story";
import ComboBanner from "./ComboBanner";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";

export default function HomeClient({
  categories,
  productsByCategory,
  featuredProduct,
  activeCombo,
  settings,
  testimonials,
}) {
  return (
    <SiteProviders>
      <Header categories={categories} settings={settings} hasActiveCombo={!!activeCombo} />
      <Hero featuredProduct={featuredProduct} settings={settings} />
      <TrustStrip settings={settings} />
      <CategoryNav categories={categories} />

      {categories.map((category, i) => (
        <ProductSection
          key={category._id}
          category={category}
          products={productsByCategory[category._id] || []}
          settings={settings}
          alt={i % 2 === 0}
        />
      ))}

      <Story settings={settings} />
      <ComboBanner combo={activeCombo} settings={settings} />
      <Testimonials testimonials={testimonials} />
      <Footer categories={categories} settings={settings} hasActiveCombo={!!activeCombo} />
      <FloatingWhatsApp settings={settings} />
    </SiteProviders>
  );
}