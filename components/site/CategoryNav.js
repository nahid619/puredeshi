"use client";

import { useT } from "./SiteProviders";
import { Reveal, RevealGroup } from "./Reveal";

export default function CategoryNav({ categories }) {
  const t = useT();
  if (categories.length === 0) return null;

  return (
    <section className="site-section site-cat">
      <div className="site-wrap">
        <Reveal>
          <div className="site-eyebrow">{t("ক্যাটাগরি", "Categories")}</div>
          <h2 className="site-h2">{t("যা যা পাবেন এখানে", "Shop by category")}</h2>
        </Reveal>
        <RevealGroup className="site-grid" style={{ marginTop: 26 }}>
          {categories.map((c) => (
            <a key={c._id} className="site-card tile" href={`#${c.slug}`}>
              <div className="circle">
                <i className={`ti ${c.icon}`} />
              </div>
              <div className="label">{t(c.nameBn, c.nameEn)}</div>
            </a>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
