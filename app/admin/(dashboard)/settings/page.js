"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState(null); // null = still loading
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.error) {
          setError(data.error);
        } else {
          setForm(data);
        }
      })
      .catch(() => active && setError("সার্ভারের সাথে সংযোগ করা যায়নি"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(data);
      setSaved(true);
    } catch (err) {
      setError(err.message || "সেভ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--admin-gray-500)]">লোড হচ্ছে…</p>;
  }
  if (error && !form) {
    return <p className="text-sm text-[var(--brand-coral-600)]">{error}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] p-6 max-w-lg flex flex-col gap-4"
    >
      <div>
        <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
          হোয়াটসঅ্যাপ নম্বর
        </label>
        <input
          value={form.whatsappNumber}
          onChange={(e) => update("whatsappNumber", e.target.value)}
          className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
          অর্ডার মেসেজ টেমপ্লেট (বাংলা)
        </label>
        <textarea
          rows={2}
          value={form.orderMessageTemplateBn}
          onChange={(e) => update("orderMessageTemplateBn", e.target.value)}
          className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm"
        />
        <p className="text-[11.5px] text-[var(--admin-gray-500)] mt-1">
          {"{প্রোডাক্ট}"} ও {"{দাম}"} লিখলে সেগুলো প্রকৃত প্রোডাক্টের নাম ও দাম দিয়ে বদলে যাবে।
        </p>
      </div>
      <div>
        <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
          Order Message Template (English)
        </label>
        <textarea
          rows={2}
          value={form.orderMessageTemplateEn}
          onChange={(e) => update("orderMessageTemplateEn", e.target.value)}
          className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
          ফেসবুক পেজ লিংক
        </label>
        <input
          value={form.facebookUrl}
          onChange={(e) => update("facebookUrl", e.target.value)}
          className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-[var(--brand-coral-600)] bg-[var(--brand-coral-50)] rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-sm text-[var(--brand-green-800)] bg-[var(--brand-green-50)] rounded-lg px-3 py-2">
          সেভ হয়েছে ✓
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="self-start inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)] disabled:opacity-60"
      >
        <i className="ti ti-check" />
        {saving ? "সেভ হচ্ছে…" : "সেভ করুন"}
      </button>
    </form>
  );
}
