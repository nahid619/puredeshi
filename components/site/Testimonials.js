"use client";

import { useT } from "./SiteProviders";
import { Reveal, RevealGroup } from "./Reveal";

// Placeholder examples for the design only — Phase 5 replaces these with
// real reviews collected from the Facebook page.
const TESTIMONIALS = [
  {
    avatar: "রবে",
    nameBn: "রহিমা বেগম",
    nameEn: "Rahima Begum",
    roleBn: "গৃহিণী",
    roleEn: "Homemaker",
    textBn: "প্রথমবার ঘি অর্ডার করেছিলাম, স্বাদ একদম দাদীর হাতের মতো লাগলো।",
    textEn: "I ordered the ghee for the first time — it tasted just like my grandmother used to make.",
  },
  {
    avatar: "কহ",
    nameBn: "কামরুল হাসান",
    nameEn: "Kamrul Hasan",
    roleBn: "ব্যবসায়ী",
    roleEn: "Business owner",
    textBn: "সরিষার তেলের ঘ্রাণ আর মান অসাধারণ, এখন থেকে এখান থেকেই নিচ্ছি।",
    textEn: "The mustard oil's smell and quality are amazing — I only buy from here now.",
  },
  {
    avatar: "নআ",
    nameBn: "নাজনীন আক্তার",
    nameEn: "Nazneen Akter",
    roleBn: "শিক্ষিকা",
    roleEn: "Teacher",
    textBn: "মধু একদম খাঁটি লেগেছে, পরিবারের সবাই পছন্দ করেছে।",
    textEn: "The honey felt completely pure — my whole family loved it.",
  },
];

export default function Testimonials() {
  const t = useT();
  return (
    <section className="site-section site-testimonials" style={{ background: "var(--surface)" }}>
      <div className="site-wrap">
        <Reveal>
          <div className="site-eyebrow">{t("গ্রাহকদের মতামত", "What customers say")}</div>
          <h2 className="site-h2">{t("তারা যা বলছেন", "In their words")}</h2>
        </Reveal>
        <RevealGroup className="site-grid" style={{ marginTop: 24 }}>
          {TESTIMONIALS.map((item) => (
            <div className="site-card site-testi" key={item.nameEn}>
              <div className="top">
                <div className="avatar">{item.avatar}</div>
                <div>
                  <div className="nm">{t(item.nameBn, item.nameEn)}</div>
                  <div className="role">{t(item.roleBn, item.roleEn)}</div>
                </div>
              </div>
              <p>{t(item.textBn, item.textEn)}</p>
            </div>
          ))}
        </RevealGroup>
        <p style={{ marginTop: 16, fontSize: 12, color: "#b7bba9" }}>
          {t(
            "* এই মতামতগুলো শুধুমাত্র ডিজাইন উদাহরণ — লঞ্চের আগে আসল গ্রাহকের রিভিউ দিয়ে প্রতিস্থাপন করুন।",
            "* These testimonials are placeholder examples for the design only — replace with real customer reviews before launch."
          )}
        </p>
      </div>
    </section>
  );
}
