"use client";

import { useEffect, useState } from "react";

function StatusRow({ label, status }) {
  if (!status) {
    return (
      <div className="flex items-center gap-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 animate-pulse" />
        <span className="text-sm">{label}: checking…</span>
      </div>
    );
  }

  const dotColor = status.connected
    ? "bg-green-600"
    : status.configured
    ? "bg-[var(--brand-coral-600)]"
    : "bg-gray-400";

  return (
    <div className="flex items-start gap-3 py-2">
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`} />
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm opacity-80">{status.message}</p>
      </div>
    </div>
  );
}

export default function SetupStatus() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  async function check() {
    setLoading(true);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setHealth({
        mongodb: { configured: false, connected: false, message: "Could not reach /api/health" },
        cloudinary: { configured: false, connected: false, message: "Could not reach /api/health" },
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Standard "fetch on mount" pattern — safe here since check() always
    // resolves (it catches its own errors) and this only runs once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    check();
  }, []);

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--brand-green-100)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Setup Status</h2>
        <button
          onClick={check}
          className="text-xs px-3 py-1 rounded-full border border-[var(--brand-green-700)] hover:bg-[var(--brand-green-100)] transition-colors"
        >
          Re-check
        </button>
      </div>
      <StatusRow label="MongoDB Atlas" status={health?.mongodb} />
      <StatusRow label="Cloudinary" status={health?.cloudinary} />
      {!loading && (
        <p className="text-xs opacity-60 mt-3">
          Both will show grey until you add your credentials to{" "}
          <code className="px-1 rounded bg-black/5">.env.local</code> — see
          README.md.
        </p>
      )}
    </div>
  );
}
