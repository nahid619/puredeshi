"use client";

import Link from "next/link";
import { SiteProviders, useSite, useT } from "./SiteProviders";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import OrderButton from "./OrderButton";
import { Reveal } from "./Reveal";
import { formatTaka, BADGE_LABELS } from "@/lib/bn";

const BADGE_LABELS_EN = { none: "", new: "New", bestseller: "Bestseller", preorder: "Pre-order" };

// Picks the English version of a content field, falling back to Bangla if
// the admin hasn't filled in an English translation yet for that product —
// better to show something than an empty section.
function pick(lang, bn, en) {
  if (lang === "en" && en && (Array.isArray(en) ? en.length > 0 : en.trim())) {
    return en;
  }
  return bn;
}

function DetailList({ title, items, icon }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 22 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--heading)", marginBottom: 8 }}>
        {title}
      </h3>
      <ul className="site-detail-list">
        {items.map((item, i) => (
          <li key={i}>
            <i className={`ti ${icon}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetailBody({ product, settings }) {
  const { lang } = useSite();
  const t = useT();
  const isSale = product.priceRegular && product.priceRegular > product.priceCurrent;
  const content = product.content || {};
  const intro = pick(lang, content.intro, content.introEn);
  const benefits = pick(lang, content.benefits, content.benefitsEn);
  const ingredients = pick(lang, content.ingredients, content.ingredientsEn);
  const usage = pick(lang, content.usage, content.usageEn);
  const whyUs = pick(lang, content.whyUs, content.whyUsEn);

  return (
    <main className="site-section">
      <div className="site-wrap">
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 22 }}>
          <Link href="/">{t("হোম", "Home")}</Link> /{" "}
          {product.category && (
            <>
              <Link href={`/#${product.category.slug}`}>{t(product.category.nameBn, product.category.nameEn)}</Link>{" "}
              /{" "}
            </>
          )}
          {t(product.nameBn, product.nameEn)}
        </p>

        <Reveal
          as="div"
          style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 44, alignItems: "start" }}
        >
          <div className="site-detail-thumb">
            {!product.inStock && (
              <span className="badge stockout-badge" style={{ position: "absolute", top: 14, left: 14 }}>
                {t("স্টক আউট", "Out of stock")}
              </span>
            )}
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary URL, not a static asset
              <img src={product.images[0]} alt={t(product.nameBn, product.nameEn)} />
            ) : (
              <i className={`ti ${product.category?.icon || "ti-package"}`} />
            )}
          </div>

          <div>
            {product.category && (
              <div className="site-eyebrow" style={{ marginBottom: 6 }}>
                {t(product.category.nameBn, product.category.nameEn)}
              </div>
            )}
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--heading)", marginBottom: 10 }}>
              {t(product.nameBn, product.nameEn)}
            </h1>

            {product.badge !== "none" && !isSale && (
              <span className="badge site-badge-tag" style={{ position: "static", display: "inline-block", marginBottom: 12 }}>
                {t(BADGE_LABELS[product.badge], BADGE_LABELS_EN[product.badge])}
              </span>
            )}

            <div style={{ fontSize: 22, marginBottom: 18 }}>
              {isSale && <span className="price-old" style={{ fontSize: 16 }}>{formatTaka(product.priceRegular)}</span>}
              <span className={`price-now ${isSale ? "sale" : "normal"}`}>
                {formatTaka(product.priceCurrent)}
              </span>
            </div>

            {intro && (
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.85, marginBottom: 22 }}>
                {intro}
              </p>
            )}

            <OrderButton
              nameBn={product.nameBn}
              nameEn={product.nameEn}
              price={formatTaka(product.priceCurrent)}
              productId={product._id}
              settings={settings}
              disabled={!product.inStock}
              variant="primary"
              className="site-btn"
            />

            <div style={{ marginTop: 32 }}>
              <DetailList title={t("উপকারিতা", "Benefits")} items={benefits} icon="ti-circle-check" />
              <DetailList title={t("উপাদান / উৎস", "Ingredients / Source")} items={ingredients} icon="ti-leaf" />
              <DetailList title={t("ব্যবহার বিধি", "How to use")} items={usage} icon="ti-info-circle" />
              <DetailList title={t("কেন পিওর দেশি", "Why Pure Deshi")} items={whyUs} icon="ti-shield-check" />
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

export default function ProductDetailClient({ product, categories, settings, hasActiveCombo }) {
  return (
    <SiteProviders>
      <Header categories={categories} settings={settings} hasActiveCombo={hasActiveCombo} />
      <ProductDetailBody product={product} settings={settings} />
      <Footer categories={categories} settings={settings} hasActiveCombo={hasActiveCombo} />
      <FloatingWhatsApp settings={settings} />
    </SiteProviders>
  );
}
