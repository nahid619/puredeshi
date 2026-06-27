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
const LANG_KEY = "pure-deshi-admin-lang";

export function AdminProviders({ children }) {
  const [lang, setLang] = useState("bn");

  // Runs once on mount only. Defaults stay "bn" until this runs, since
  // localStorage doesn't exist during server rendering.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of an external system (localStorage) on mount, not a render-triggered cascade
      if (saved === "bn" || saved === "en") setLang(saved);
    } catch {
      // Some browser privacy modes throw on localStorage access — fall
      // back to the default silently, not worth surfacing to the admin.
    }
  }, []);

  function toggleLang() {
    setLang((l) => {
      const next = l === "bn" ? "en" : "bn";
      try {
        localStorage.setItem(LANG_KEY, next);
      } catch {
        // Same as above — persistence is a nice-to-have, not essential.
      }
      return next;
    });
  }

  return (
    <AdminContext.Provider value={{ lang, toggleLang }}>{children}</AdminContext.Provider>
  );
}

export function useAdminLang() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminLang must be used within AdminProviders");
  }
  return ctx;
}

/**
 * Shorthand for picking the right-language string.
 * Usage: const t = useAdminT(); t("সেভ করুন", "Save")
 */
export function useAdminT() {
  const { lang } = useAdminLang();
  return (bn, en) => (lang === "bn" ? bn : en);
}