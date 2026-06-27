// components/site/Header.js
"use client";

import Link from "next/link";
import { useSite, useT } from "./SiteProviders";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Header({ categories, settings, hasActiveCombo }) {
  const { lang, toggleLang, dark, toggleTheme } = useSite();
  const t = useT();
  const waLink = buildWhatsAppUrl(settings.whatsappNumber);

  const navItems = [
    ...categories.map((c) => ({ href: `/#${c.slug}`, bn: c.nameBn, en: c.nameEn })),
    ...(hasActiveCombo ? [{ href: "/#combo", bn: "কম্বো অফার", en: "Combo Offers" }] : []),
    { href: "/#story", bn: "গল্প", en: "Our Story" },
  ];

  return (
    <>
      {/* top utility bar */}
      <div className="site-topbar">
        <div className="site-wrap">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href={`tel:${settings.phoneNumber}`}>
              <i className="ti ti-phone" /> {settings.phoneNumber}
            </a>
            <a href={waLink} target="_blank" rel="noreferrer">
              <i className="ti ti-brand-whatsapp" /> {t("হোয়াটসঅ্যাপে অর্ডার করুন", "Order on WhatsApp")}
            </a>
          </div>
          <div className="site-icon-cluster">
            {settings.facebookUrl && (
              <a
                className="site-icon-btn"
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                title="Facebook page"
              >
                <i className="ti ti-brand-facebook" />
              </a>
            )}
            <button className="site-lang-pill" onClick={toggleLang} title="Change language">
              <i className="ti ti-language" /> <span>{lang === "bn" ? "EN" : "বাং"}</span>
            </button>
            <button className="site-icon-btn" onClick={toggleTheme} title="Dark / light mode">
              <i className={`ti ${dark ? "ti-sun" : "ti-moon"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* header / nav */}
      <header className="site-header">
        <div className="site-wrap">
          <Link className="site-logo" href="/#top">
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/local logo URL, not a static asset */}
            <img src={settings.logoUrl || "/images/logo-emblem.png"} alt="Pure Deshi" width={42} height={42} style={{ borderRadius: "50%" }} />
            <div>
              <div className="name">Pure Deshi</div>
              <div className="tag">{t(settings.tagline?.bn, settings.tagline?.en)}</div>
            </div>
          </Link>
          <nav className="site-nav-links">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {t(item.bn, item.en)}
              </Link>
            ))}
          </nav>
          <a href={waLink} target="_blank" rel="noreferrer" className="site-btn site-btn-primary">
            <i className="ti ti-brand-whatsapp" /> <span>{t("অর্ডার করুন", "Order now")}</span>
          </a>
        </div>
      </header>
    </>
  );
}