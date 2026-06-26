// components/admin/AdminShell.js
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/admin", icon: "ti-layout-dashboard", label: "ড্যাশবোর্ড" },
  { href: "/admin/products", icon: "ti-shopping-bag", label: "প্রোডাক্ট" },
  { href: "/admin/categories", icon: "ti-category", label: "ক্যাটাগরি" },
  { href: "/admin/combos", icon: "ti-package", label: "কম্বো অফার" },
  { href: "/admin/banners", icon: "ti-photo", label: "ব্যানার" },
  { href: "/admin/testimonials", icon: "ti-message-2-star", label: "গ্রাহক মতামত" },
];

const BOTTOM_NAV_ITEMS = [
  { href: "/admin/settings", icon: "ti-settings", label: "সেটিংস" },
];

const TITLES = {
  "/admin": "ড্যাশবোর্ড",
  "/admin/products": "প্রোডাক্ট",
  "/admin/categories": "ক্যাটাগরি",
  "/admin/combos": "কম্বো অফার",
  "/admin/banners": "ব্যানার",
  "/admin/testimonials": "গ্রাহক মতামত",
  "/admin/settings": "সেটিংস",
};

function NavLink({ href, icon, label, active }) {
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
      {label}
    </Link>
  );
}

export default function AdminShell({ username, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const pageTitle = TITLES[pathname] || "অ্যাডমিন";
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
    <div className="flex min-h-screen bg-[var(--admin-gray-50)] text-[var(--admin-gray-900)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col py-5 bg-[var(--brand-green-900)] text-[var(--brand-green-100)]">
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
            <div className="text-[10.5px] text-[var(--brand-green-100)]">Admin Panel</div>
          </div>
        </div>

        <nav className="flex flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} active={pathname === item.href} />
          ))}
        </nav>

        <div className="flex-1" />

        <div className="border-t border-white/10 pt-2.5 mt-2.5">
          {BOTTOM_NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} active={pathname === item.href} />
          ))}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-[var(--brand-green-100)] hover:bg-white/5 transition-colors w-full text-left disabled:opacity-60"
          >
            <i className="ti ti-logout text-lg w-5" />
            {loggingOut ? "লগ আউট হচ্ছে…" : "লগ আউট"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="bg-white border-b border-[var(--admin-gray-200)] px-7 py-4 flex justify-between items-center">
          <h1 className="text-[19px] font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            {pageTitle}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[var(--admin-gray-700)]">
            <div className="w-8 h-8 rounded-full bg-[var(--brand-amber-200)] flex items-center justify-center font-semibold text-xs text-[var(--brand-amber-900)]">
              {initials}
            </div>
            {username}
          </div>
        </div>

        <div className="p-6 md:p-7">{children}</div>
      </div>
    </div>
  );
}