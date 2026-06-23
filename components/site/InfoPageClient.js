"use client";

import { SiteProviders, useT } from "./SiteProviders";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import { Reveal } from "./Reveal";

function InfoBody({ titleBn, titleEn, children }) {
  const t = useT();
  return (
    <main className="site-section">
      <div className="site-wrap" style={{ maxWidth: 720 }}>
        <Reveal>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--heading)", marginBottom: 22 }}>
            {t(titleBn, titleEn)}
          </h1>
          <div style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.9 }}>{children}</div>
        </Reveal>
      </div>
    </main>
  );
}

export default function InfoPageClient({ titleBn, titleEn, children, categories, settings, hasActiveCombo }) {
  return (
    <SiteProviders>
      <Header categories={categories} settings={settings} hasActiveCombo={hasActiveCombo} />
      <InfoBody titleBn={titleBn} titleEn={titleEn}>
        {children}
      </InfoBody>
      <Footer categories={categories} settings={settings} hasActiveCombo={hasActiveCombo} />
      <FloatingWhatsApp settings={settings} />
    </SiteProviders>
  );
}
