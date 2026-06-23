"use client";

import Link from "next/link";
import { useT } from "./SiteProviders";

export default function Footer({ categories, settings, hasActiveCombo }) {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="site-grid">
          <div>
            <p style={{ marginTop: 10, color: "var(--brand-green-100)", fontSize: 13 }}>
              {t("বিশুদ্ধতার পরিচয়", "The mark of purity")}
            </p>
            <div className="social">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer">
                  <i className="ti ti-brand-facebook" />
                </a>
              )}
              <a href={`https://wa.me/${String(settings.whatsappNumber).replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                <i className="ti ti-brand-whatsapp" />
              </a>
            </div>
          </div>

          <div>
            <div className="colhead">{t("শপ", "Shop")}</div>
            <ul>
              {categories.map((c) => (
                <li key={c._id}>
                  <Link href={`/#${c.slug}`}>{t(c.nameBn, c.nameEn)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="colhead">{t("কোম্পানি", "Company")}</div>
            <ul>
              <li>
                <Link href="/#story">{t("আমাদের গল্প", "Our story")}</Link>
              </li>
              {hasActiveCombo && (
                <li>
                  <Link href="/#combo">{t("কম্বো অফার", "Combo offers")}</Link>
                </li>
              )}
              {settings.facebookUrl && (
                <li>
                  <a href={settings.facebookUrl} target="_blank" rel="noreferrer">
                    {t("ফেসবুক পেজ", "Facebook page")}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <div className="colhead">{t("সহায়তা", "Support")}</div>
            <ul>
              <li>
                <a href={`https://wa.me/${String(settings.whatsappNumber).replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                  {t("যোগাযোগ", "Contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-bottom-bar">
          {t(`© ${year} Pure Deshi. সর্বস্বত্ব সংরক্ষিত।`, `© ${year} Pure Deshi. All rights reserved.`)}
        </div>
      </div>
    </footer>
  );
}
