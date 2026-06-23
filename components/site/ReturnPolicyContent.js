"use client";

import { useT } from "./SiteProviders";

export default function ReturnPolicyContent() {
  const t = useT();
  return (
    <>
      <p style={{ marginBottom: 14 }}>
        {t(
          "যেহেতু আমাদের প্রোডাক্টগুলো খাদ্যপণ্য, ডেলিভারি দেওয়ার পর আমরা রিটার্ন গ্রহণ করতে পারি না।",
          "Since our products are food items, we're unable to accept returns once a delivery has been made."
        )}
      </p>
      <p style={{ marginBottom: 14 }}>
        {t(
          "তবে যদি আপনি ক্ষতিগ্রস্ত বা ভুল প্রোডাক্ট পেয়ে থাকেন, ডেলিভারির ২৪ ঘণ্টার মধ্যে হোয়াটসঅ্যাপে আমাদের জানান — আমরা সমাধান করার চেষ্টা করব।",
          "However, if you receive a damaged or incorrect item, please let us know on WhatsApp within 24 hours of delivery — we'll do our best to make it right."
        )}
      </p>
      <p style={{ fontSize: 13, color: "var(--admin-gray-400)" }}>
        {t(
          "* এটি একটি প্রাথমিক খসড়া পলিসি — প্রয়োজনে আপনার নিজস্ব শর্ত অনুযায়ী পরিবর্তন করে নিন।",
          "* This is a starting draft policy — adjust it to match your own terms as needed."
        )}
      </p>
    </>
  );
}
