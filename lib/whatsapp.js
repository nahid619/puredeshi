// lib/whatsapp.js
//
// Builds the wa.me link for an "Order Now" click (Section 6 of spec).
// The message template lives in Settings (set via the admin panel), not
// hardcoded — {প্রোডাক্ট}/{product} and {দাম}/{price} get substituted with
// the real product name (in whichever language is active) and price.

export function buildOrderMessage(template, name, price) {
  return template.replace(/{প্রোডাক্ট}|{product}/g, name).replace(/{দাম}|{price}/g, price);
}

export function buildWhatsAppUrl(whatsappNumber, message) {
  const digits = String(whatsappNumber || "").replace(/[^0-9]/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
