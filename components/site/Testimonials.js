// components/site/Testimonials.js
"use client";

import { useT } from "./SiteProviders";
import { Reveal, RevealGroup } from "./Reveal";

export default function Testimonials({ testimonials }) {
  const t = useT();
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="site-section site-testimonials" style={{ background: "var(--surface)" }}>
      <div className="site-wrap">
        <Reveal>
          <div className="site-eyebrow">{t("গ্রাহকদের মতামত", "What customers say")}</div>
          <h2 className="site-h2">{t("তারা যা বলছেন", "In their words")}</h2>
        </Reveal>
        <RevealGroup className="site-grid" style={{ marginTop: 24 }}>
          {testimonials.map((item) => (
            <div className="site-card site-testi" key={item._id}>
              <div className="top">
                <div className="avatar">{item.avatar || item.nameEn.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="nm">{t(item.nameBn, item.nameEn)}</div>
                  <div className="role">{t(item.roleBn, item.roleEn)}</div>
                </div>
              </div>
              <p>{t(item.textBn, item.textEn)}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}