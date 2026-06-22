// lib/bn.js
//
// The mockups display all numbers using Bengali digits (০-৯) even though
// the underlying data and form inputs use normal Arabic numerals. This
// converts for display only — never use this on values going into a
// number input or back to the database.

const DIGIT_MAP = { 0: "০", 1: "১", 2: "২", 3: "৩", 4: "৪", 5: "৫", 6: "৬", 7: "৭", 8: "৮", 9: "৯" };

export function toBnDigits(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[0-9]/g, (d) => DIGIT_MAP[d]);
}

export function formatTaka(value) {
  if (value === null || value === undefined || value === "") return "৳০";
  return `৳${toBnDigits(Math.round(Number(value)))}`;
}

// English <-> Bangla labels for the product badge enum stored in MongoDB.
export const BADGE_LABELS = {
  none: "কোনোটিই না",
  new: "নতুন",
  bestseller: "বেস্ট সেলার",
  preorder: "প্রি-অর্ডার",
};

export const BADGE_OPTIONS = Object.entries(BADGE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
