"use client";

import { useSite } from "./SiteProviders";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * variant: "primary" | "soft" | "outline"
 * productId is optional — omit it for combos (ClickLog only tracks Products).
 */
export default function OrderButton({
  nameBn,
  nameEn,
  price,
  productId,
  settings,
  disabled = false,
  variant = "soft",
  className = "",
  children,
}) {
  const { lang } = useSite();

  function handleClick() {
    if (disabled) return;

    const name = lang === "bn" ? nameBn : nameEn;
    const template =
      lang === "bn" ? settings.orderMessageTemplateBn : settings.orderMessageTemplateEn;
    const message = buildOrderMessage(template, name, price);
    const url = buildWhatsAppUrl(settings.whatsappNumber, message);

    if (productId) {
      // Fire-and-forget — never let a logging failure block the actual order.
      fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      }).catch(() => {});
    }

    window.open(url, "_blank");
  }

  const variantClass =
    variant === "primary" ? "site-btn-primary" : variant === "outline" ? "site-btn-outline" : "site-btn-soft";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`site-btn ${variantClass} ${className}`}
    >
      {children || (
        <>
          <i className="ti ti-brand-whatsapp" />
          <span>{disabled ? (lang === "bn" ? "স্টক আউট" : "Out of stock") : lang === "bn" ? "অর্ডার করুন" : "Order now"}</span>
        </>
      )}
    </button>
  );
}
