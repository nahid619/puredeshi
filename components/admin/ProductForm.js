// components/admin/ProductForm.js
"use client";

import { useState } from "react";
import { formatTaka, BADGE_OPTIONS, BADGE_LABELS } from "@/lib/bn";

// ── Bengali ↔ Arabic numeral helpers for price inputs ─────────────────────
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const EN_DIGITS = "0123456789";

/** "1500" → "১৫০০"  (Arabic → Bengali digits, keeps decimal dots) */
function tobn(str) {
  return String(str).replace(/[0-9]/g, (d) => BN_DIGITS[d]);
}

/** "১৫০০" → "1500"  (Bengali → Arabic digits, passes through normal chars) */
function toen(str) {
  return String(str).replace(/[০-৯]/g, (d) => EN_DIGITS[BN_DIGITS.indexOf(d)]);
}

/** Extract only digit characters (Arabic or Bengali) from a string */
function digitsOnly(str) {
  return str.replace(/[^0-9০-৯.]/g, "");
}

function splitLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function emptyFormState(categories) {
  return {
    nameBn: "",
    nameEn: "",
    category: categories[0]?._id || "",
    badge: "none",
    priceRegular: "",
    priceCurrent: "",
    inStock: true,
    isFeatured: false,
    isTrending: false,
    imageUrl: "",
    introText: "",
    introTextEn: "",
    benefitsText: "",
    benefitsTextEn: "",
    ingredientsText: "",
    ingredientsTextEn: "",
    usageText: "",
    usageTextEn: "",
    whyUsText: "",
    whyUsTextEn: "",
  };
}

function formStateFromProduct(product) {
  return {
    nameBn: product.nameBn || "",
    nameEn: product.nameEn || "",
    category: product.category?._id || product.category || "",
    badge: product.badge || "none",
    priceRegular: product.priceRegular ?? "",
    priceCurrent: product.priceCurrent ?? "",
    inStock: product.inStock ?? true,
    isFeatured: product.isFeatured ?? false,
    isTrending: product.isTrending ?? false,
    imageUrl: product.images?.[0] || "",
    introText: product.content?.intro || "",
    introTextEn: product.content?.introEn || "",
    benefitsText: (product.content?.benefits || []).join("\n"),
    benefitsTextEn: (product.content?.benefitsEn || []).join("\n"),
    ingredientsText: (product.content?.ingredients || []).join("\n"),
    ingredientsTextEn: (product.content?.ingredientsEn || []).join("\n"),
    usageText: (product.content?.usage || []).join("\n"),
    usageTextEn: (product.content?.usageEn || []).join("\n"),
    whyUsText: (product.content?.whyUs || []).join("\n"),
    whyUsTextEn: (product.content?.whyUsEn || []).join("\n"),
  };
}

export default function ProductForm({ product, categories, onSave, onCancel }) {
  const [form, setForm] = useState(() =>
    product ? formStateFromProduct(product) : emptyFormState(categories)
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Capture before we overwrite it with the local preview below.
    const previousUrl = form.imageUrl;

    // Instant local preview, matching the mockup's feel.
    const localUrl = URL.createObjectURL(file);
    update("imageUrl", localUrl);

    // Real upload to Cloudinary in the background.
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      if (previousUrl) body.append("oldUrl", previousUrl);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ছবি আপলোড ব্যর্থ হয়েছে");
        return;
      }
      update("imageUrl", data.url);
    } catch {
      setError("ছবি আপলোড করার সময় সংযোগ বিচ্ছিন্ন হয়ে গেছে");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.nameBn || !form.nameEn || !form.category || form.priceCurrent === "") {
      setError("নাম (বাংলা ও English), ক্যাটাগরি এবং বর্তমান দাম আবশ্যক");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        nameBn: form.nameBn,
        nameEn: form.nameEn,
        category: form.category,
        badge: form.badge,
        priceRegular: form.priceRegular === "" ? undefined : Number(form.priceRegular),
        priceCurrent: Number(form.priceCurrent),
        inStock: form.inStock,
        isFeatured: form.isFeatured,
        isTrending: form.isTrending,
        images: form.imageUrl ? [form.imageUrl] : [],
        content: {
          intro: form.introText,
          introEn: form.introTextEn,
          benefits: splitLines(form.benefitsText),
          benefitsEn: splitLines(form.benefitsTextEn),
          ingredients: splitLines(form.ingredientsText),
          ingredientsEn: splitLines(form.ingredientsTextEn),
          usage: splitLines(form.usageText),
          usageEn: splitLines(form.usageTextEn),
          whyUs: splitLines(form.whyUsText),
          whyUsEn: splitLines(form.whyUsTextEn),
        },
      });
    } catch (err) {
      setError(err.message || "সেভ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  const old = parseFloat(form.priceRegular);
  const now = parseFloat(form.priceCurrent);
  const isSale = old && old > now;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[var(--admin-gray-100)] p-6 bg-[var(--admin-gray-50)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-7 items-start">
        {/* Left: fields */}
        <div>
          <SectionTitle first>মূল তথ্য</SectionTitle>
          <Row2>
            <Field label="প্রোডাক্টের নাম (বাংলা)">
              <input
                value={form.nameBn}
                onChange={(e) => update("nameBn", e.target.value)}
                placeholder="যেমনঃ পাবনার খাঁটি ঘি"
              />
            </Field>
            <Field label="প্রোডাক্টের নাম (English)">
              <input
                value={form.nameEn}
                onChange={(e) => update("nameEn", e.target.value)}
                placeholder="e.g. Pabna Pure Ghee"
              />
            </Field>
          </Row2>
          <Row2>
            <Field label="ক্যাটাগরি">
              <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nameBn}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ব্যাজ">
              <select value={form.badge} onChange={(e) => update("badge", e.target.value)}>
                {BADGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </Row2>

          <SectionTitle>দাম</SectionTitle>

          {/* ── Regular (old/crossed-out) price ── */}
          <div className="mb-1">
            <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
              পুরোনো দাম{" "}
              <span className="font-normal text-[var(--admin-gray-500)]">
                (অফার না থাকলে খালি রাখুন)
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* English input — stores the actual number */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-gray-400)] text-xs font-bold select-none">
                  EN
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.priceRegular}
                  onChange={(e) => {
                    const raw = digitsOnly(toen(e.target.value));
                    update("priceRegular", raw);
                  }}
                  placeholder="1050"
                  className="w-full border border-[var(--admin-gray-200)] rounded-lg pl-9 pr-3 py-2.5 text-sm bg-[var(--admin-surface)]"
                />
              </div>
              {/* Bengali display input — converts to Arabic on change */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-gray-400)] text-xs font-bold select-none">
                  বাং
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.priceRegular !== "" ? tobn(form.priceRegular) : ""}
                  onChange={(e) => {
                    const raw = digitsOnly(toen(e.target.value));
                    update("priceRegular", raw);
                  }}
                  placeholder="১০৫০"
                  className="w-full border border-[var(--admin-gray-200)] rounded-lg pl-9 pr-3 py-2.5 text-sm bg-[var(--admin-surface)]"
                />
              </div>
            </div>
          </div>

          {/* ── Current price ── */}
          <div className="mb-1">
            <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
              বর্তমান দাম
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-gray-400)] text-xs font-bold select-none">
                  EN
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.priceCurrent}
                  onChange={(e) => {
                    const raw = digitsOnly(toen(e.target.value));
                    update("priceCurrent", raw);
                  }}
                  placeholder="950"
                  className="w-full border border-[var(--admin-gray-200)] rounded-lg pl-9 pr-3 py-2.5 text-sm bg-[var(--admin-surface)]"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-gray-400)] text-xs font-bold select-none">
                  বাং
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.priceCurrent !== "" ? tobn(form.priceCurrent) : ""}
                  onChange={(e) => {
                    const raw = digitsOnly(toen(e.target.value));
                    update("priceCurrent", raw);
                  }}
                  placeholder="৯৫০"
                  className="w-full border border-[var(--admin-gray-200)] rounded-lg pl-9 pr-3 py-2.5 text-sm bg-[var(--admin-surface)]"
                />
              </div>
            </div>
          </div>

          <p className="text-[11.5px] text-[var(--admin-gray-500)] mt-1.5 mb-3.5">
            EN বক্সে ইংরেজি নম্বর লিখলে বাং বক্স স্বয়ংক্রিয়ভাবে আপডেট হবে, এবং উল্টোটাও।
            পুরোনো দাম পূরণ করলে সেটা কাটা দেখাবে; খালি রাখলে বর্তমান দাম স্বাভাবিক সবুজে দেখাবে।
          </p>

          <SectionTitle>ছবি</SectionTitle>
          <div className="mb-4">
            <div
              onClick={() => document.getElementById("f-image").click()}
              className="border-[1.5px] border-dashed border-[var(--admin-gray-200)] rounded-[10px] p-4.5 text-center bg-[var(--admin-surface)] cursor-pointer"
            >
              {form.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/blob preview URL, not a static asset
                <img
                  src={form.imageUrl}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                />
              ) : (
                <i className="ti ti-cloud-upload text-[26px] text-[var(--admin-gray-400)]" />
              )}
              <div className="text-[12.5px] text-[var(--admin-gray-500)] mt-1.5">
                {uploading ? "আপলোড হচ্ছে…" : "ছবি আপলোড করতে ক্লিক করুন"}
              </div>
            </div>
            <input
              id="f-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <SectionTitle>স্ট্যাটাস</SectionTitle>
          <ToggleRow
            label="স্টকে আছে"
            checked={form.inStock}
            onChange={(v) => update("inStock", v)}
          />
          <ToggleRow
            label="হোমপেজে ফিচার্ড করুন"
            checked={form.isFeatured}
            onChange={(v) => update("isFeatured", v)}
          />
          <ToggleRow
            label="হিরো স্পটলাইটে দেখান (ট্রেন্ডিং)"
            checked={form.isTrending}
            onChange={(v) => update("isTrending", v)}
          />
          <p className="text-[11.5px] text-[var(--admin-gray-500)] -mt-1.5 mb-3.5">
            হোমপেজের সবচেয়ে উপরে, হিরো সেকশনে একটি প্রোডাক্ট হাইলাইট হয়ে দেখানো হয় — এটি অন
            করলে এই প্রোডাক্টটি সেখানে দেখাবে। একসাথে একাধিক প্রোডাক্টে অন থাকলে সবচেয়ে নতুনটি
            দেখাবে।
          </p>

          <SectionTitle>প্রোডাক্ট পেজের কন্টেন্ট (নাচুরো স্টাইল)</SectionTitle>
          <p className="text-[11.5px] text-[var(--admin-gray-500)] -mt-1.5 mb-3">
            প্রতিটি অংশের বাংলা ও English দুটোই পূরণ করুন — ভাষা টগল করলে কাস্টমার এই দুটোর মধ্যে
            সুইচ করবে। English ফাঁকা রাখলে সেই অংশ English ভিউতে দেখাবে না।
          </p>
          <Row2>
            <Field label="সংক্ষিপ্ত পরিচিতি — বাংলা">
              <textarea
                rows={2}
                value={form.introText}
                onChange={(e) => update("introText", e.target.value)}
                placeholder="এক বা দুই লাইনে প্রোডাক্টের পরিচিতি লিখুন"
              />
            </Field>
            <Field label="Short intro — English">
              <textarea
                rows={2}
                value={form.introTextEn}
                onChange={(e) => update("introTextEn", e.target.value)}
                placeholder="One or two lines introducing the product"
              />
            </Field>
          </Row2>
          <Row2>
            <Field label="উপকারিতা — বাংলা (প্রতি লাইনে একটি)">
              <textarea
                rows={3}
                value={form.benefitsText}
                onChange={(e) => update("benefitsText", e.target.value)}
                placeholder={"হজমে সহায়ক\nশরীরে শক্তি বাড়ায়"}
              />
            </Field>
            <Field label="Benefits — English (one per line)">
              <textarea
                rows={3}
                value={form.benefitsTextEn}
                onChange={(e) => update("benefitsTextEn", e.target.value)}
                placeholder={"Supports digestion\nBoosts energy"}
              />
            </Field>
          </Row2>
          <Row2>
            <Field label="উপাদান / উৎস — বাংলা (প্রতি লাইনে একটি)">
              <textarea
                rows={2}
                value={form.ingredientsText}
                onChange={(e) => update("ingredientsText", e.target.value)}
                placeholder={"১০০% খাঁটি গরুর দুধ"}
              />
            </Field>
            <Field label="Ingredients / Source — English (one per line)">
              <textarea
                rows={2}
                value={form.ingredientsTextEn}
                onChange={(e) => update("ingredientsTextEn", e.target.value)}
                placeholder={"100% pure cow's milk"}
              />
            </Field>
          </Row2>
          <Row2>
            <Field label="ব্যবহার বিধি — বাংলা (প্রতি লাইনে একটি)">
              <textarea
                rows={2}
                value={form.usageText}
                onChange={(e) => update("usageText", e.target.value)}
                placeholder={"ভাত, রুটি বা পরোটার সাথে ব্যবহার করুন"}
              />
            </Field>
            <Field label="How to use — English (one per line)">
              <textarea
                rows={2}
                value={form.usageTextEn}
                onChange={(e) => update("usageTextEn", e.target.value)}
                placeholder={"Use with rice, bread, or paratha"}
              />
            </Field>
          </Row2>
          <Row2>
            <Field label="কেন পিওর দেশি — বাংলা (প্রতি লাইনে একটি)">
              <textarea
                rows={2}
                value={form.whyUsText}
                onChange={(e) => update("whyUsText", e.target.value)}
                placeholder={"কোনো ভেজাল বা প্রিজারভেটিভ নেই"}
              />
            </Field>
            <Field label="Why Pure Deshi — English (one per line)">
              <textarea
                rows={2}
                value={form.whyUsTextEn}
                onChange={(e) => update("whyUsTextEn", e.target.value)}
                placeholder={"No adulteration or preservatives"}
              />
            </Field>
          </Row2>

          {error && (
            <p className="text-sm text-[var(--brand-coral-600)] bg-[var(--brand-coral-50)] rounded-lg px-3 py-2 mb-3">
              {error}
            </p>
          )}

          <div className="flex gap-2.5 mt-5">
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)] disabled:opacity-60"
            >
              <i className="ti ti-check" />
              {saving ? "সেভ হচ্ছে…" : "সেভ করুন"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-[var(--admin-gray-100)] text-[var(--admin-gray-700)] hover:bg-[var(--admin-gray-200)]"
            >
              বাতিল
            </button>
          </div>
        </div>

        {/* Right: live preview */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--admin-gray-500)] mb-2.5">
            লাইভ প্রিভিউ — ফ্রন্টএন্ডে এভাবে দেখাবে
          </div>
          <div className="bg-[var(--admin-surface)] rounded-2xl shadow-[0_8px_20px_rgba(23,52,4,0.1)] overflow-hidden max-w-[230px] sticky top-5">
            <div className="h-[120px] bg-gradient-to-br from-[var(--brand-amber-50)] to-[#fff5e4] flex items-center justify-center relative">
              {form.badge !== "none" && (
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--brand-coral-50)] text-[var(--brand-coral-600)]">
                  {BADGE_LABELS[form.badge]}
                </span>
              )}
              {form.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/blob preview URL, not a static asset
                <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <i className="ti ti-flask text-3xl text-[var(--brand-amber-400)]" />
              )}
            </div>
            <div className="p-3.5">
              <div className="font-semibold text-[13.5px] text-[var(--brand-green-900)] mb-1.5 min-h-[34px]">
                {form.nameBn || "প্রোডাক্টের নাম"}
              </div>
              <div className="text-[13px] mb-2.5">
                {isSale && <span className="price-old">{formatTaka(old)}</span>}
                <span className={`price-now ${isSale ? "sale" : "normal"}`}>
                  {formatTaka(now || 0)}
                </span>
              </div>
              <div className="bg-[var(--brand-green-50)] text-[var(--brand-green-800)] w-full text-center py-2 rounded-lg text-[12.5px] font-semibold flex items-center justify-center gap-1.5">
                <i className="ti ti-brand-whatsapp" /> অর্ডার করুন
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function SectionTitle({ children, first }) {
  return (
    <div
      className={`text-[13px] font-bold uppercase tracking-wide text-[var(--admin-gray-700)] ${
        first ? "mt-0 mb-2.5" : "mt-4.5 mb-2.5"
      }`}
    >
      {children}
    </div>
  );
}

function Row2({ children }) {
  return <div className="grid grid-cols-2 gap-3.5">{children}</div>;
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
        {label}
      </label>
      <div className="[&_input]:w-full [&_input]:border [&_input]:border-[var(--admin-gray-200)] [&_input]:rounded-lg [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:bg-[var(--admin-surface)] [&_select]:w-full [&_select]:border [&_select]:border-[var(--admin-gray-200)] [&_select]:rounded-lg [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-sm [&_select]:bg-[var(--admin-surface)] [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[var(--admin-gray-200)] [&_textarea]:rounded-lg [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-sm [&_textarea]:bg-[var(--admin-surface)]">
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex justify-between items-center bg-[var(--admin-surface)] border border-[var(--admin-gray-200)] rounded-lg px-3.5 py-2.5 mb-3">
      <span className="text-sm">{label}</span>
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={`admin-switch ${checked ? "on" : ""}`}
      />
    </div>
  );
}