// app/admin/(dashboard)/layout.js
//
// Wraps every real admin page (Dashboard, Products, Categories, Combos,
// Banners, Settings) — NOT the login page, which lives outside this route
// group specifically so it isn't subject to this same redirect.
//
// This check runs on the server before any HTML is sent, so an
// unauthenticated visitor never even briefly sees the admin UI.

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { AdminProviders } from "@/components/admin/AdminProviders";
import "@tabler/icons-webfont/dist/tabler-icons.css";

export const metadata = {
  title: "Pure Deshi — Admin Panel",
};

export default async function AdminProtectedLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminProviders>
      <AdminShell username={session.username}>{children}</AdminShell>
    </AdminProviders>
  );
}