"use client";

import { useT } from "./SiteProviders";
import { Reveal } from "./Reveal";
import OrderButton from "./OrderButton";
import { formatTaka } from "@/lib/bn";

export default function ComboBanner({ combo, settings }) {
  const t = useT();
  if (!combo) return null;

  const isSale = combo.priceRegular && combo.priceRegular > combo.priceCombo;

  return (
    <section className="site-section" id="combo">
      <Reveal as="div" className="site-wrap">
        <div className="site-combo-box">
          <div>
            <span className="tag">{t("কম্বো অফার", "Combo offer")}</span>
            <h3>{t(combo.nameBn, combo.nameEn)}</h3>
            <div className="price">
              {isSale && (
                <span className="price-old" style={{ fontSize: 14 }}>
                  {formatTaka(combo.priceRegular)}
                </span>
              )}
              <span className={`price-now ${isSale ? "sale" : "normal"}`} style={{ fontSize: 16 }}>
                {formatTaka(combo.priceCombo)}
              </span>
            </div>
          </div>
          <OrderButton
            nameBn={combo.nameBn}
            nameEn={combo.nameEn}
            price={formatTaka(combo.priceCombo)}
            settings={settings}
            variant="primary"
          >
            <i className="ti ti-brand-whatsapp" />
            <span>{t("হোয়াটসঅ্যাপে অর্ডার করুন", "Order on WhatsApp")}</span>
          </OrderButton>
        </div>
      </Reveal>
    </section>
  );
}
