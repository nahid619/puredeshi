"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@tabler/icons-webfont/dist/tabler-icons.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "লগইন ব্যর্থ হয়েছে");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("সার্ভারের সাথে সংযোগ করা যায়নি");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--brand-amber-50)] px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo-emblem.png"
            alt="Pure Deshi"
            width={72}
            height={72}
            priority
          />
          <h1
            className="mt-3 text-2xl font-bold text-[var(--brand-green-900)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Admin Login
          </h1>
          <p className="text-sm text-[var(--brand-green-700)]">পিওর দেশি অ্যাডমিন প্যানেল</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--admin-surface)] rounded-2xl shadow-sm border border-[var(--brand-green-100)] p-6 flex flex-col gap-3"
        >
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-green-800)] mb-1.5">
              ইউজারনেম
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              className="w-full border border-[var(--brand-green-100)] rounded-lg px-3 py-2.5 text-sm focus:outline-2 focus:outline-[var(--brand-amber-200)] focus:border-[var(--brand-amber-400)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-green-800)] mb-1.5">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full border border-[var(--brand-green-100)] rounded-lg px-3 py-2.5 text-sm focus:outline-2 focus:outline-[var(--brand-amber-200)] focus:border-[var(--brand-amber-400)]"
            />
          </div>

          {error && (
            <p className="text-xs text-[var(--brand-coral-600)] bg-[var(--brand-coral-50)] rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-lg bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)] text-sm font-semibold py-2.5 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <i className="ti ti-login" />
            {busy ? "লগইন হচ্ছে…" : "লগইন করুন"}
          </button>
        </form>
      </div>
    </main>
  );
}