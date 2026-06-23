"use client";

export default function FloatingWhatsApp({ settings }) {
  const digits = String(settings.whatsappNumber || "").replace(/[^0-9]/g, "");
  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      className="site-float-wa"
      aria-label="WhatsApp"
    >
      <i className="ti ti-brand-whatsapp" />
    </a>
  );
}
