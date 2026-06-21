"use client";

import { useEffect, useState } from "react";

export default function AdminLoginPanel({ onSessionChange }) {
  const [session, setSession] = useState(null); // null = checking, false = logged out, {username} = logged in
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function checkSession() {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      const next = data.loggedIn ? { username: data.username } : false;
      setSession(next);
      onSessionChange?.(!!data.loggedIn);
    } catch {
      setSession(false);
      onSessionChange?.(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e) {
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
        setError(data.error || "Login failed");
        return;
      }
      setPassword("");
      await checkSession();
    } catch {
      setError("Could not reach the server");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await checkSession();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--brand-green-100)] bg-[var(--surface)] p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Admin Login Test</h2>

      {session === null && <p className="text-sm opacity-70">Checking session…</p>}

      {session === false && (
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-[var(--brand-green-100)] rounded-lg px-3 py-2 text-sm bg-transparent"
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[var(--brand-green-100)] rounded-lg px-3 py-2 text-sm bg-transparent"
            autoComplete="current-password"
          />
          {error && <p className="text-xs text-[var(--brand-coral-600)]">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-lg bg-[var(--brand-green-800)] text-[var(--brand-amber-50)] text-sm font-semibold py-2 disabled:opacity-60"
          >
            {busy ? "Logging in…" : "Log in"}
          </button>
          <p className="text-xs opacity-60">
            Use the ADMIN_USERNAME / ADMIN_PASSWORD you set in .env.local
            before running <code className="px-1 rounded bg-black/5">npm run seed</code>.
          </p>
        </form>
      )}

      {session && (
        <div className="flex items-center justify-between">
          <p className="text-sm">
            ✅ Logged in as <strong>{session.username}</strong>
          </p>
          <button
            onClick={handleLogout}
            disabled={busy}
            className="text-xs px-3 py-1 rounded-full border border-[var(--brand-green-700)] hover:bg-[var(--brand-green-100)] transition-colors disabled:opacity-60"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
