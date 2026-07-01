// components/admin/AdminProviders.js
//
// Same idea as components/site/SiteProviders.js, but scoped to the admin
// panel only, and kept deliberately separate from it: an admin's language
// preference shouldn't affect what a site visitor sees, and vice versa.
//
// There's nothing to store in the database here — every string this
// touches is hardcoded UI chrome (button labels, table headers, nav items),
// not content — so this is just a toggle + an if/else lookup (t(bn, en)),
// persisted in the browser via localStorage so it survives a refresh.

"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext(null);
const LANG_KEY   = "pure-deshi-admin-lang";
const THEME_KEY  = "pure-deshi-admin-theme";

export function AdminProviders({ children }) {
  // Lazy initializers run once on first render (client-side only).
  // This avoids calling setState inside a useEffect, which ESLint flags
  // as a cascading-render risk. localStorage isn't available during SSR,
  // so the try/catch handles that edge case gracefully.
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "bn" || saved === "en") return saved;
    } catch { /* SSR or privacy mode — fall through */ }
    return "bn";
  });

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light") return "light";
    } catch { /* SSR or privacy mode — fall through */ }
    return "dark"; // admin panel defaults to dark
  });

  function toggleLang() {
    setLang((l) => {
      const next = l === "bn" ? "en" : "bn";
      try { localStorage.setItem(LANG_KEY, next); } catch { /* ignored */ }
      return next;
    });
  }

  function toggleTheme() {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch { /* ignored */ }
      return next;
    });
  }

  return (
    <AdminContext.Provider value={{ lang, toggleLang, theme, toggleTheme }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminLang() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminLang must be used within AdminProviders");
  }
  return ctx;
}

export function useAdminTheme() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminTheme must be used within AdminProviders");
  return { theme: ctx.theme, toggleTheme: ctx.toggleTheme };
}

/**
 * Shorthand for picking the right-language string.
 * Usage: const t = useAdminT(); t("সেভ করুন", "Save")
 */
export function useAdminT() {
  const { lang } = useAdminLang();
  return (bn, en) => (lang === "bn" ? bn : en);
}