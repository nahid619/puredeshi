// components/site/TrustStrip.js
"use client";

import { useT } from "./SiteProviders";
import { RevealGroup } from "./Reveal";

export default function TrustStrip({ settings }) {
  const t = useT();
  const badges = settings?.trustBadges || [];
  if (badges.length === 0) return null;

  return (
    <section className="site-trust" style={{ background: "var(--surface)" }}>
      <RevealGroup className="site-wrap site-grid">
        {badges.map((item, i) => (
          <div className="item" key={i}>
            <i className={`ti ${item.icon}`} />
            <div>{t(item.bn, item.en)}</div>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}