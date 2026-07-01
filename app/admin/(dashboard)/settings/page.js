// app/admin/(dashboard)/settings/page.js
"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState(null); // null = still loading
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
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

  function updateLocalized(field, lang, value) {
    setForm((f) => ({ ...f, [field]: { ...f[field], [lang]: value } }));
    setSaved(false);
  }

  function updateBadge(index, key, value) {
    setForm((f) => {
      const badges = [...f.trustBadges];
      badges[index] = { ...badges[index], [key]: value };
      return { ...f, trustBadges: badges };
    });
    setSaved(false);
  }

  async function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const previousUrl = form.logoUrl;
    update("logoUrl", URL.createObjectURL(file));
    setUploadingLogo(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      if (previousUrl) body.append("oldUrl", previousUrl);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "লোগো আপলোড ব্যর্থ হয়েছে");
        update("logoUrl", previousUrl);
        return;
      }
      update("logoUrl", data.url);
    } catch {
      setError("লোগো আপলোড করার সময় সংযোগ বিচ্ছিন্ন হয়ে গেছে");
      update("logoUrl", previousUrl);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.logoUrl && form.logoUrl.startsWith("blob:")) {
      setError("লোগো আপলোড সম্পন্ন হওয়া পর্যন্ত অপেক্ষা করুন");
      return;
    }
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

  const labelClass = "block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5";
  const inputClass = "w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      {/* ── Contact & order settings (unchanged) ───────────────────────── */}
      <div className="bg-[var(--admin-surface)] rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-[15px]" style={{ fontFamily: "var(--font-heading)" }}>
          যোগাযোগ ও অর্ডার
        </h2>
        <div>
          <label className={labelClass}>ফোন নম্বর (টপবারে দেখাবে, কল করার জন্য)</label>
          <input
            value={form.phoneNumber}
            onChange={(e) => update("phoneNumber", e.target.value)}
            className={inputClass}
          />
          <p className="text-[11.5px] text-[var(--admin-gray-500)] mt-1">
            এটা আলাদা — হোয়াটসঅ্যাপ নম্বর থেকে ভিন্ন কোনো নম্বরও হতে পারে (যেমন ল্যান্ডলাইন)।
          </p>
        </div>
        <div>
          <label className={labelClass}>হোয়াটসঅ্যাপ নম্বর (&ldquo;হোয়াটসঅ্যাপে অর্ডার করুন&rdquo; বাটনে যাবে)</label>
          <input
            value={form.whatsappNumber}
            onChange={(e) => update("whatsappNumber", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>অর্ডার মেসেজ টেমপ্লেট (বাংলা)</label>
          <textarea
            rows={2}
            value={form.orderMessageTemplateBn}
            onChange={(e) => update("orderMessageTemplateBn", e.target.value)}
            className={inputClass}
          />
          <p className="text-[11.5px] text-[var(--admin-gray-500)] mt-1">
            {"{প্রোডাক্ট}"} ও {"{দাম}"} লিখলে সেগুলো প্রকৃত প্রোডাক্টের নাম ও দাম দিয়ে বদলে যাবে।
          </p>
        </div>
        <div>
          <label className={labelClass}>Order Message Template (English)</label>
          <textarea
            rows={2}
            value={form.orderMessageTemplateEn}
            onChange={(e) => update("orderMessageTemplateEn", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>ফেসবুক পেজ লিংক</label>
          <input
            value={form.facebookUrl}
            onChange={(e) => update("facebookUrl", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* ── Branding ────────────────────────────────────────────────────── */}
      <div className="bg-[var(--admin-surface)] rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-[15px]" style={{ fontFamily: "var(--font-heading)" }}>
          ব্র্যান্ডিং
        </h2>
        <p className="text-[12.5px] text-[var(--admin-gray-500)] -mt-2">
          ব্র্যান্ডের নাম &ldquo;Pure Deshi&rdquo; কোডে স্থির রাখা হয়েছে — ট্যাগলাইন ও লোগো এখান থেকে পরিবর্তন করা যায়।
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>ট্যাগলাইন (বাংলা)</label>
            <input
              value={form.tagline?.bn || ""}
              onChange={(e) => updateLocalized("tagline", "bn", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tagline (English)</label>
            <input
              value={form.tagline?.en || ""}
              onChange={(e) => updateLocalized("tagline", "en", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>লোগো</label>
          <div
            onClick={() => document.getElementById("logo-upload").click()}
            className="border-[1.5px] border-dashed border-[var(--admin-gray-200)] rounded-[10px] p-4 flex items-center gap-3 bg-[var(--admin-gray-50)] cursor-pointer w-fit"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/blob preview URL, not a static asset */}
            <img
              src={form.logoUrl}
              alt=""
              className="w-12 h-12 object-cover rounded-full bg-[var(--admin-surface)]"
            />
            <span className="text-[12.5px] text-[var(--admin-gray-500)]">
              {uploadingLogo ? "আপলোড হচ্ছে…" : "নতুন লোগো আপলোড করতে ক্লিক করুন"}
            </span>
          </div>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>
      </div>

      {/* ── Our Story section ──────────────────────────────────────────── */}
      <div className="bg-[var(--admin-surface)] rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-[15px]" style={{ fontFamily: "var(--font-heading)" }}>
          আমাদের গল্প (হোমপেজ সেকশন)
        </h2>
        <div>
          <label className={labelClass}>টাইটেল (বাংলা)</label>
          <input
            value={form.storyTitle?.bn || ""}
            onChange={(e) => updateLocalized("storyTitle", "bn", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Title (English)</label>
          <input
            value={form.storyTitle?.en || ""}
            onChange={(e) => updateLocalized("storyTitle", "en", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>লেখা (বাংলা)</label>
          <textarea
            rows={4}
            value={form.storyBody?.bn || ""}
            onChange={(e) => updateLocalized("storyBody", "bn", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Body (English)</label>
          <textarea
            rows={4}
            value={form.storyBody?.en || ""}
            onChange={(e) => updateLocalized("storyBody", "en", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* ── Trust strip badges ─────────────────────────────────────────── */}
      <div className="bg-[var(--admin-surface)] rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-[15px]" style={{ fontFamily: "var(--font-heading)" }}>
          ট্রাস্ট ব্যাজ (হিরো সেকশনের নিচে ৪টি)
        </h2>
        <p className="text-[12.5px] text-[var(--admin-gray-500)] -mt-2">
          আইকনের নাম{" "}
          <a href="https://tabler.io/icons" target="_blank" rel="noreferrer" className="underline">
            tabler.io/icons
          </a>{" "}
          থেকে নিয়ে &ldquo;ti-&rdquo; সহ লিখুন, যেমন: ti-leaf
        </p>
        {(form.trustBadges || []).map((badge, i) => (
          <div key={i} className="grid grid-cols-[110px_1fr_1fr] gap-3 items-end border-t border-[var(--admin-gray-100)] pt-3 first:border-0 first:pt-0">
            <div>
              <label className={labelClass}>আইকন</label>
              <input
                value={badge.icon}
                onChange={(e) => updateBadge(i, "icon", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>লেখা (বাংলা)</label>
              <input
                value={badge.bn}
                onChange={(e) => updateBadge(i, "bn", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Label (English)</label>
              <input
                value={badge.en}
                onChange={(e) => updateBadge(i, "en", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        ))}
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
        disabled={saving || uploadingLogo}
        className="self-start inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)] disabled:opacity-60"
      >
        <i className="ti ti-check" />
        {saving ? "সেভ হচ্ছে…" : "সেভ করুন"}
      </button>
    </form>
  );
}