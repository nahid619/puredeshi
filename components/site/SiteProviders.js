// components/site/SiteProviders.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SiteContext = createContext(null);

const LANG_KEY = "pure-deshi-lang";
const THEME_KEY = "pure-deshi-theme";

export function SiteProviders({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "bn" || saved === "en") return saved;
    } catch { /* SSR / privacy mode */ }
    return "bn";
  });

  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark";
    } catch { /* SSR / privacy mode */ }
    return false;
  });

  // Keep <html lang="..."> in sync (matches the mockup's setLang behavior)
  // and remember the choice for next time.
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // Persistence is a nice-to-have, not essential — fail silently.
    }
  }, [lang]);

  // The CSS (ported directly from the mockup) uses "body.dark ..." selectors,
  // so the class has to go on the actual <body> element, not a wrapper div.
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {
      // Same as above.
    }
    return () => document.body.classList.remove("dark");
  }, [dark]);

  function toggleLang() {
    setLang((l) => (l === "bn" ? "en" : "bn"));
  }

  function toggleTheme() {
    setDark((d) => !d);
  }

  return (
    <SiteContext.Provider value={{ lang, toggleLang, dark, toggleTheme }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSite must be used within SiteProviders");
  }
  return ctx;
}

/**
 * Shorthand for picking the right-language string.
 * Usage: const t = useT(); t(product.nameBn, product.nameEn)
 */
export function useT() {
  const { lang } = useSite();
  return (bn, en) => (lang === "bn" ? bn : en);
}