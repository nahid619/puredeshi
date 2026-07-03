// components/site/Header.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSite, useT } from "./SiteProviders";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Header({ categories, settings, hasActiveCombo }) {
  const { lang, toggleLang, dark, toggleTheme } = useSite();
  const t = useT();
  const waLink = buildWhatsAppUrl(settings.whatsappNumber);

  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [activeId,  setActiveId]  = useState("");

  const navItems = [
    ...categories.map((c) => ({ href: `/#${c.slug}`, id: c.slug, bn: c.nameBn, en: c.nameEn })),
    ...(hasActiveCombo ? [{ href: "/#combo", id: "combo", bn: "কম্বো অফার", en: "Combo Offers" }] : []),
    { href: "/#story", id: "story", bn: "গল্প", en: "Our Story" },
  ];

  // ── Scrolled state — adds shadow once the page moves ────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Active section tracking via IntersectionObserver ─────────────────
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      // Only fire when the section occupies the middle 30 % of the viewport
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // ── Smooth-scroll helper ──────────────────────────────────────────────
  // Next.js router.push() doesn't always trigger the browser's native
  // scroll-behavior:smooth, so we intercept clicks and use scrollIntoView.
  const scrollTo = useCallback((e, id) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  }, []);

  const headerClass = ["site-header", scrolled ? "scrolled" : ""].filter(Boolean).join(" ");

  return (
    <>
      {/* ── Top utility bar ────────────────────────────────────────── */}
      <div className="site-topbar">
        <div className="site-wrap">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href={`tel:${settings.phoneNumber}`}>
              <i className="ti ti-phone" /> {settings.phoneNumber}
            </a>
            <a href={waLink} target="_blank" rel="noreferrer">
              <i className="ti ti-brand-whatsapp" />{" "}
              {t("হোয়াটসঅ্যাপে অর্ডার করুন", "Order on WhatsApp")}
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

      {/* ── Main header / nav ──────────────────────────────────────── */}
      <header className={headerClass}>
        <div className="site-wrap">
          {/* Logo */}
          <Link className="site-logo" href="/#top" onClick={(e) => scrollTo(e, "top")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.logoUrl || "/images/logo-emblem.png"}
              alt="Pure Deshi"
              width={42}
              height={42}
              style={{ borderRadius: "50%" }}
            />
            <div>
              <div className="name">Pure Deshi</div>
              <div className="tag">{t(settings.tagline?.bn, settings.tagline?.en)}</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="site-nav-links">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={activeId === item.id ? "active" : ""}
                onClick={(e) => scrollTo(e, item.id)}
              >
                {t(item.bn, item.en)}
              </Link>
            ))}
          </nav>

          {/* CTA + hamburger wrapper */}
          <div className="site-header-actions">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="site-btn site-btn-primary"
            >
              <i className="ti ti-brand-whatsapp" />{" "}
              <span>{t("অর্ডার করুন", "Order now")}</span>
            </a>
            <button
              className={`site-hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile slide-down drawer */}
        {menuOpen && (
          <nav className="site-mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={activeId === item.id ? "active" : ""}
                onClick={(e) => scrollTo(e, item.id)}
              >
                {t(item.bn, item.en)}
              </Link>
            ))}
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="site-btn site-btn-primary"
            >
              <i className="ti ti-brand-whatsapp" />{" "}
              {t("অর্ডার করুন", "Order now")}
            </a>
          </nav>
        )}
      </header>
    </>
  );
}