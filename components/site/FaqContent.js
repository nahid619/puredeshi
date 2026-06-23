"use client";

import { useT } from "./SiteProviders";

const FAQS = [
  {
    qBn: "অর্ডার কীভাবে করব?",
    qEn: "How do I place an order?",
    aBn: "যেকোনো প্রোডাক্টের \"অর্ডার করুন\" বাটনে ক্লিক করুন — এটি হোয়াটসঅ্যাপ খুলবে প্রোডাক্টের নাম ও দাম সহ একটি মেসেজ নিয়ে। মেসেজটি পাঠিয়ে দিলে আমরা বাকি প্রক্রিয়া সম্পন্ন করব।",
    aEn: "Click the \"Order Now\" button on any product — it opens WhatsApp with a message already containing the product name and price. Just send it, and we'll take care of the rest.",
  },
  {
    qBn: "পেমেন্ট পদ্ধতি কী?",
    qEn: "What payment methods do you accept?",
    aBn: "আমরা ক্যাশ অন ডেলিভারি (COD) গ্রহণ করি।",
    aEn: "We accept Cash on Delivery (COD).",
  },
  {
    qBn: "ডেলিভারি কতদিনে হয়?",
    qEn: "How long does delivery take?",
    aBn: "এলাকার উপর নির্ভর করে — অর্ডার করার সময় হোয়াটসঅ্যাপে সঠিক সময় জানিয়ে দেওয়া হয়।",
    aEn: "It depends on your location — we'll confirm the exact delivery time with you on WhatsApp when you order.",
  },
  {
    qBn: "প্রোডাক্ট কি আসলেই ফরমালিনমুক্ত ও খাঁটি?",
    qEn: "Are the products really formalin-free and pure?",
    aBn: "হ্যাঁ — আমরা প্রতিটি প্রোডাক্ট নিজেরা যাচাই করে সংগ্রহ করি, কোনো ভেজাল বা ক্ষতিকর রাসায়নিক মেশানো হয় না।",
    aEn: "Yes — we personally verify every product we source, with no adulteration or harmful chemicals added.",
  },
];

export default function FaqContent() {
  const t = useT();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {FAQS.map((item) => (
        <div key={item.qEn}>
          <h3 style={{ fontSize: 15.5, fontWeight: 600, color: "var(--heading)", marginBottom: 6 }}>
            {t(item.qBn, item.qEn)}
          </h3>
          <p>{t(item.aBn, item.aEn)}</p>
        </div>
      ))}
    </div>
  );
}
