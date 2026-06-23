"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SiteContext = createContext(null);

export function SiteProviders({ children }) {
  const [lang, setLang] = useState("bn");
  const [dark, setDark] = useState(false);

  // Keep <html lang="..."> in sync (matches the mockup's setLang behavior).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // The CSS (ported directly from the mockup) uses "body.dark ..." selectors,
  // so the class has to go on the actual <body> element, not a wrapper div.
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
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
