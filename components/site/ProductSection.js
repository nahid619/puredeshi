"use client";

import { useT } from "./SiteProviders";
import { Reveal, RevealGroup } from "./Reveal";
import ProductCard from "./ProductCard";

export default function ProductSection({ category, products, settings, alt }) {
  const t = useT();
  if (products.length === 0) return null;

  const smallGrid = products.length <= 2;

  return (
    <section
      className="site-section site-products"
      id={category.slug}
      style={alt ? { background: "var(--surface)" } : undefined}
    >
      <div className="site-wrap">
        <Reveal>
          <div className="site-eyebrow">
            {t(category.taglineBn || category.nameBn, category.taglineEn || category.nameEn)}
          </div>
          <h2 className="site-h2">{t(category.nameBn, category.nameEn)}</h2>
        </Reveal>
        <RevealGroup
          className="site-grid"
          style={
            smallGrid
              ? { marginTop: 24, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", maxWidth: 480 }
              : { marginTop: 24 }
          }
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} settings={settings} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
