"use client";

import { useT } from "./SiteProviders";
import OrderButton from "./OrderButton";
import { formatTaka } from "@/lib/bn";

export default function Hero({ featuredProduct, settings }) {
  const t = useT();

  return (
    <section className="site-hero" id="top">
      <div className="blob1" />
      <div className="blob2" />
      <i className="ti ti-leaf leaf-deco" aria-hidden="true" />
      <div className="site-wrap">
        <div className="inner">
          <h1>{t("পিওর দেশি — বিশুদ্ধতার পরিচয়", "Pure Deshi — The Mark of Purity")}</h1>
          <p>
            {t(
              "পাবনার খাঁটি ঘি, ঘানি ভাঙা সরিষার তেল, আর সাত রকমের ফুলের মধু — সব তৈরি হয় পুরনো নিয়মে, হাতে হাতে, কোনো রাসায়নিক ছাড়া।",
              "Pure ghee from Pabna, ghani-pressed mustard oil, and seven kinds of pure honey — all made the old way, by hand, with no chemicals."
            )}
          </p>
          <div className="cta">
            <a href="#honey" className="site-btn site-btn-primary">
              <span>{t("এখনই অর্ডার করুন", "Order now")}</span> <i className="ti ti-arrow-right" />
            </a>
            <a href="#story" className="site-btn site-btn-outline">
              <span>{t("আমাদের গল্প জানুন", "Read our story")}</span>
            </a>
          </div>
        </div>

        {featuredProduct && (
          <div className="spotlight">
            <div className="spot-ring r2" />
            <div className="spot-ring r1" />
            <div className="spotlight-card">
              <span className="spot-badge">
                <i className="ti ti-flame" /> <span>{t("ট্রেন্ডিং", "Trending now")}</span>
              </span>
              <div className="spot-icon">
                {featuredProduct.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary URL, not a static asset
                  <img src={featuredProduct.images[0]} alt="" />
                ) : (
                  <i className={`ti ${featuredProduct.category?.icon || "ti-droplet"}`} />
                )}
              </div>
              <div className="spot-name">{t(featuredProduct.nameBn, featuredProduct.nameEn)}</div>
              <div className="spot-price">{formatTaka(featuredProduct.priceCurrent)}</div>
              <OrderButton
                nameBn={featuredProduct.nameBn}
                nameEn={featuredProduct.nameEn}
                price={formatTaka(featuredProduct.priceCurrent)}
                productId={featuredProduct._id}
                settings={settings}
                variant="primary"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
