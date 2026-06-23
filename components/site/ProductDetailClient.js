"use client";

import Link from "next/link";
import { SiteProviders, useT } from "./SiteProviders";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import OrderButton from "./OrderButton";
import { Reveal } from "./Reveal";
import { formatTaka, BADGE_LABELS } from "@/lib/bn";

const BADGE_LABELS_EN = { none: "", new: "New", bestseller: "Bestseller", preorder: "Pre-order" };

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
  const t = useT();
  const isSale = product.priceRegular && product.priceRegular > product.priceCurrent;
  const content = product.content || {};

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

            {content.intro && (
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.85, marginBottom: 22 }}>
                {content.intro}
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
              <DetailList title={t("উপকারিতা", "Benefits")} items={content.benefits} icon="ti-circle-check" />
              <DetailList title={t("উপাদান / উৎস", "Ingredients / Source")} items={content.ingredients} icon="ti-leaf" />
              <DetailList title={t("ব্যবহার বিধি", "How to use")} items={content.usage} icon="ti-info-circle" />
              <DetailList title={t("কেন পিওর দেশি", "Why Pure Deshi")} items={content.whyUs} icon="ti-shield-check" />
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
