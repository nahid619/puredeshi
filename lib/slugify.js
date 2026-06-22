// lib/slugify.js
//
// Turns an English name into a URL-safe slug for new Product/Category
// documents. The admin form doesn't expose a separate "slug" field (to
// match the mockup, which doesn't have one either) — it's derived
// automatically from the English name instead.

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
