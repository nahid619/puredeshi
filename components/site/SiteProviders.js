// components/site/SiteProviders.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SiteContext = createContext(null);

const LANG_KEY = "pure-deshi-lang";
const THEME_KEY = "pure-deshi-theme";

export function SiteProviders({ children }) {
  const [lang, setLang] = useState("bn");
  const [dark, setDark] = useState(false);

  // Runs once on mount only: pick up whatever the visitor chose last time,
  // if anything. Defaults stay "bn" / light until this runs, since
  // localStorage doesn't exist during server rendering — so there's a
  // brief moment on first paint where it shows the default before
  // switching, which is an acceptable trade-off for not needing a cookie +
  // server-side read just for a UI preference like this.
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of an external system (localStorage) on mount, not a render-triggered cascade
      if (savedLang === "bn" || savedLang === "en") setLang(savedLang);
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === "dark") setDark(true);
    } catch {
      // Some browser privacy modes throw on localStorage access — fall
      // back to defaults silently, it's not worth bothering the visitor.
    }
  }, []);

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