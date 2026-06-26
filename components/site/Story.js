// components/site/Story.js
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
            {t(settings.storyTitle?.bn, settings.storyTitle?.en)}
          </h2>
          <p>{t(settings.storyBody?.bn, settings.storyBody?.en)}</p>
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