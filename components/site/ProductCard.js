"use client";

import Link from "next/link";
import { useT } from "./SiteProviders";
import OrderButton from "./OrderButton";
import { formatTaka, BADGE_LABELS } from "@/lib/bn";

export default function ProductCard({ product, settings }) {
  const t = useT();
  const isSale = product.priceRegular && product.priceRegular > product.priceCurrent;
  const discountPct = isSale
    ? Math.round(((product.priceRegular - product.priceCurrent) / product.priceRegular) * 100)
    : 0;

  return (
    <div className="site-card site-product">
      <Link href={`/products/${product.slug}`}>
        <div className="thumb">
          {!product.inStock && (
            <span className="badge stockout-badge">{t("স্টক আউট", "Out of stock")}</span>
          )}
          {product.inStock && isSale && (
            <span className="badge site-badge-sale">-{discountPct}%</span>
          )}
          {product.inStock && !isSale && product.badge !== "none" && (
            <span className="badge site-badge-tag">
              {t(BADGE_LABELS[product.badge], BADGE_LABELS_EN[product.badge])}
            </span>
          )}
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary URL, not a static asset
            <img src={product.images[0]} alt={t(product.nameBn, product.nameEn)} />
          ) : (
            <i className={`ti ${product.category?.icon || "ti-package"}`} />
          )}
        </div>
      </Link>
      <div className="body">
        <Link href={`/products/${product.slug}`}>
          <div className="name">{t(product.nameBn, product.nameEn)}</div>
        </Link>
        <div className="price">
          {isSale && <span className="price-old">{formatTaka(product.priceRegular)}</span>}
          <span className={`price-now ${isSale ? "sale" : "normal"}`}>
            {formatTaka(product.priceCurrent)}
          </span>
        </div>
        <OrderButton
          nameBn={product.nameBn}
          nameEn={product.nameEn}
          price={formatTaka(product.priceCurrent)}
          productId={product._id}
          settings={settings}
          disabled={!product.inStock}
        />
      </div>
    </div>
  );
}

const BADGE_LABELS_EN = {
  none: "",
  new: "New",
  bestseller: "Bestseller",
  preorder: "Pre-order",
};
