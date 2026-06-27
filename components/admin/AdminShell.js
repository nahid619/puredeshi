// components/admin/AdminShell.js
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAdminLang, useAdminT } from "./AdminProviders";

const NAV_ITEMS = [
  { href: "/admin", icon: "ti-layout-dashboard", bn: "ড্যাশবোর্ড", en: "Dashboard" },
  { href: "/admin/products", icon: "ti-shopping-bag", bn: "প্রোডাক্ট", en: "Products" },
  { href: "/admin/categories", icon: "ti-category", bn: "ক্যাটাগরি", en: "Categories" },
  { href: "/admin/combos", icon: "ti-package", bn: "কম্বো অফার", en: "Combo Offers" },
  { href: "/admin/banners", icon: "ti-photo", bn: "ব্যানার", en: "Banners" },
  { href: "/admin/testimonials", icon: "ti-message-2-star", bn: "গ্রাহক মতামত", en: "Testimonials" },
];

const BOTTOM_NAV_ITEMS = [
  { href: "/admin/settings", icon: "ti-settings", bn: "সেটিংস", en: "Settings" },
];

const TITLES = {
  "/admin": { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  "/admin/products": { bn: "প্রোডাক্ট", en: "Products" },
  "/admin/categories": { bn: "ক্যাটাগরি", en: "Categories" },
  "/admin/combos": { bn: "কম্বো অফার", en: "Combo Offers" },
  "/admin/banners": { bn: "ব্যানার", en: "Banners" },
  "/admin/testimonials": { bn: "গ্রাহক মতামত", en: "Testimonials" },
  "/admin/settings": { bn: "সেটিংস", en: "Settings" },
};

function NavLink({ href, icon, bn, en, active, t }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium border-l-[3px] transition-colors ${
        active
          ? "bg-white/10 text-white border-[var(--brand-amber-200)]"
          : "text-[var(--brand-green-100)] border-transparent hover:bg-white/5"
      }`}
    >
      <i className={`ti ${icon} text-lg w-5`} />
      {t(bn, en)}
    </Link>
  );
}

export default function AdminShell({ username, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { lang, toggleLang } = useAdminLang();
  const t = useAdminT();

  const title = TITLES[pathname] || { bn: "অ্যাডমিন", en: "Admin" };
  const pageTitle = t(title.bn, title.en);
  const initials = (username || "PD").slice(0, 2).toUpperCase();

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--admin-gray-50)] text-[var(--admin-gray-900)]">
      {/* Sidebar — fixed height (h-screen on the parent), never scrolls with
          the page. Its own overflow-y-auto is just a safety net for if the
          nav list ever grows taller than the viewport someday. */}
      <aside className="w-60 shrink-0 flex flex-col py-5 bg-[var(--brand-green-900)] text-[var(--brand-green-100)] overflow-y-auto">
        <div className="flex items-center gap-2.5 px-5 pb-[22px] mb-3.5 border-b border-white/10">
          <Image
            src="/images/logo-emblem.png"
            alt="Pure Deshi"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <div className="font-bold text-[15px] text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Pure Deshi
            </div>
            <div className="text-[10.5px] text-[var(--brand-green-100)]">
              {t("অ্যাডমিন প্যানেল", "Admin Panel")}
            </div>
          </div>
        </div>

        <nav className="flex flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} t={t} active={pathname === item.href} />
          ))}
        </nav>

        <div className="flex-1" />

        <div className="border-t border-white/10 pt-2.5 mt-2.5">
          {BOTTOM_NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} t={t} active={pathname === item.href} />
          ))}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-[var(--brand-green-100)] hover:bg-white/5 transition-colors w-full text-left disabled:opacity-60"
          >
            <i className="ti ti-logout text-lg w-5" />
            {loggingOut ? t("লগ আউট হচ্ছে…", "Logging out…") : t("লগ আউট", "Log out")}
          </button>
        </div>
      </aside>

      {/* Main column — also capped to the screen height, but flex-col with
          overflow-hidden so it never scrolls itself either; only the inner
          content div below it scrolls. */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar — shrink-0 so it stays put and never gets pushed/scrolled */}
        <div className="bg-white border-b border-[var(--admin-gray-200)] px-7 py-4 flex justify-between items-center shrink-0">
          <h1 className="text-[19px] font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            {pageTitle}
          </h1>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium border border-[var(--admin-gray-200)] text-[var(--admin-gray-700)] hover:bg-[var(--admin-gray-50)] transition-colors"
            >
              <i className="ti ti-external-link" />
              {t("সাইট দেখুন", "View site")}
            </a>
            <button
              onClick={toggleLang}
              title={t("ভাষা পরিবর্তন করুন", "Change language")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium border border-[var(--admin-gray-200)] text-[var(--admin-gray-700)] hover:bg-[var(--admin-gray-50)] transition-colors"
            >
              <i className="ti ti-language" />
              {lang === "bn" ? "EN" : "বাং"}
            </button>
            <div className="flex items-center gap-2 text-sm text-[var(--admin-gray-700)] ml-1">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-amber-200)] flex items-center justify-center font-semibold text-xs text-[var(--brand-amber-900)]">
                {initials}
              </div>
              {username}
            </div>
          </div>
        </div>

        {/* The ONLY scrollable region in the whole shell */}
        <div className="flex-1 overflow-y-auto p-6 md:p-7">{children}</div>
      </div>
    </div>
  );
}