"use client";

import { useT } from "./SiteProviders";
import { Reveal } from "./Reveal";

export default function Story({ settings }) {
  const t = useT();
  return (
    <section className="site-section site-story" id="story" style={{ background: "var(--surface)" }}>
      <Reveal as="div" className="site-wrap">
        <div className="text">
          <div className="site-eyebrow">{t("আমাদের গল্প", "Our story")}</div>
          <h2 className="site-h2" style={{ marginBottom: 0 }}>
            {t("পাবনার মাটি থেকে শুরু", "Where it all began, in Pabna")}
          </h2>
          <p>
            {t(
              "ঘানি ভাঙা সরিষার তেল, ঢেঁকিতে ছাটা লাল চাল, আর সাত রকমের ফুলের মধু — আমরা পুরনো নিয়ম ধরে রেখেছি, যাতে প্রতিটি পণ্যে থাকে আসল স্বাদ আর বিশুদ্ধতা। কোনো শর্টকাট নেই, কোনো রাসায়নিক নেই — অনেক বছর ধরে চলে আসা পদ্ধতিতেই তৈরি হয় সব।",
              "Ghani-pressed mustard oil, hand-pounded red rice, and seven kinds of pure honey — we've kept the old methods alive, so every product keeps its real taste and purity. No shortcuts, no chemicals — just methods passed down for years."
            )}
          </p>
          {settings.facebookUrl && (
            <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="site-btn site-btn-primary">
              <span>{t("আরও জানুন", "Learn more")}</span> <i className="ti ti-arrow-right" />
            </a>
          )}
        </div>
        <div className="visual">
          <i className="ti ti-leaf" />
          <span>{t("পুরনো নিয়মে তৈরি", "Made the old way")}</span>
        </div>
      </Reveal>
    </section>
  );
}
