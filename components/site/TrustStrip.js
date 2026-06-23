"use client";

import { useT } from "./SiteProviders";
import { RevealGroup } from "./Reveal";

const ITEMS = [
  { icon: "ti-shield-check", bn: "ফরমালিনমুক্ত", en: "No formalin" },
  { icon: "ti-leaf", bn: "পুরনো নিয়মে তৈরি", en: "Made the old way" },
  { icon: "ti-cash", bn: "ক্যাশ অন ডেলিভারি", en: "Cash on delivery" },
  { icon: "ti-truck-delivery", bn: "সারাদেশে ডেলিভারি", en: "Delivery nationwide" },
];

export default function TrustStrip() {
  const t = useT();
  return (
    <section className="site-trust" style={{ background: "var(--surface)" }}>
      <RevealGroup className="site-wrap site-grid">
        {ITEMS.map((item) => (
          <div className="item" key={item.icon}>
            <i className={`ti ${item.icon}`} />
            <div>{t(item.bn, item.en)}</div>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}
