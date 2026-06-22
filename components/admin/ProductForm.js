"use client";

import { useState } from "react";
import { formatTaka, BADGE_OPTIONS, BADGE_LABELS } from "@/lib/bn";

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
    imageUrl: "",
    introText: "",
    benefitsText: "",
    ingredientsText: "",
    usageText: "",
    whyUsText: "",
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
    imageUrl: product.images?.[0] || "",
    introText: product.content?.intro || "",
    benefitsText: (product.content?.benefits || []).join("\n"),
    ingredientsText: (product.content?.ingredients || []).join("\n"),
    usageText: (product.content?.usage || []).join("\n"),
    whyUsText: (product.content?.whyUs || []).join("\n"),
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

    // Instant local preview, matching the mockup's feel.
    const localUrl = URL.createObjectURL(file);
    update("imageUrl", localUrl);

    // Real upload to Cloudinary in the background.
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
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
        images: form.imageUrl ? [form.imageUrl] : [],
        content: {
          intro: form.introText,
          benefits: splitLines(form.benefitsText),
          ingredients: splitLines(form.ingredientsText),
          usage: splitLines(form.usageText),
          whyUs: splitLines(form.whyUsText),
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
          <Row2>
            <Field label="পুরোনো দাম (অফার না থাকলে খালি রাখুন)">
              <input
                type="number"
                value={form.priceRegular}
                onChange={(e) => update("priceRegular", e.target.value)}
                placeholder="১০৫০"
              />
            </Field>
            <Field label="বর্তমান দাম">
              <input
                type="number"
                value={form.priceCurrent}
                onChange={(e) => update("priceCurrent", e.target.value)}
                placeholder="৯৫০"
              />
            </Field>
          </Row2>
          <p className="text-[11.5px] text-[var(--admin-gray-500)] -mt-2.5 mb-3.5">
            পুরোনো দাম পূরণ করলে সেটা কাটা (crossed-out) দেখাবে এবং বর্তমান দাম লাল রঙে অফার
            প্রাইস হিসেবে দেখাবে। পুরোনো দাম খালি থাকলে বর্তমান দাম স্বাভাবিক সবুজ রঙে দেখাবে।
          </p>

          <SectionTitle>ছবি</SectionTitle>
          <div className="mb-4">
            <div
              onClick={() => document.getElementById("f-image").click()}
              className="border-[1.5px] border-dashed border-[var(--admin-gray-200)] rounded-[10px] p-4.5 text-center bg-white cursor-pointer"
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

          <SectionTitle>প্রোডাক্ট পেজের কন্টেন্ট (নাচুরো স্টাইল)</SectionTitle>
          <Field label="সংক্ষিপ্ত পরিচিতি">
            <textarea
              rows={2}
              value={form.introText}
              onChange={(e) => update("introText", e.target.value)}
              placeholder="এক বা দুই লাইনে প্রোডাক্টের পরিচিতি লিখুন"
            />
          </Field>
          <Field label="উপকারিতা (প্রতি লাইনে একটি)">
            <textarea
              rows={3}
              value={form.benefitsText}
              onChange={(e) => update("benefitsText", e.target.value)}
              placeholder={"হজমে সহায়ক\nশরীরে শক্তি বাড়ায়\nত্বক ও চুলের জন্য ভালো"}
            />
          </Field>
          <Field label="উপাদান / উৎস (প্রতি লাইনে একটি)">
            <textarea
              rows={2}
              value={form.ingredientsText}
              onChange={(e) => update("ingredientsText", e.target.value)}
              placeholder={"১০০% খাঁটি গরুর দুধ\nপাবনার স্থানীয় খামার"}
            />
          </Field>
          <Field label="ব্যবহার বিধি (প্রতি লাইনে একটি)">
            <textarea
              rows={2}
              value={form.usageText}
              onChange={(e) => update("usageText", e.target.value)}
              placeholder={"ভাত, রুটি বা পরোটার সাথে ব্যবহার করুন\nফ্রিজে সংরক্ষণ করা ভালো"}
            />
          </Field>
          <Field label="কেন পিওর দেশি (প্রতি লাইনে একটি)">
            <textarea
              rows={2}
              value={form.whyUsText}
              onChange={(e) => update("whyUsText", e.target.value)}
              placeholder={"কোনো ভেজাল বা প্রিজারভেটিভ নেই\nসরাসরি খামার থেকে সংগ্রহ"}
            />
          </Field>

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
          <div className="bg-white rounded-2xl shadow-[0_8px_20px_rgba(23,52,4,0.1)] overflow-hidden max-w-[230px] sticky top-5">
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
      <div className="[&_input]:w-full [&_input]:border [&_input]:border-[var(--admin-gray-200)] [&_input]:rounded-lg [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:bg-white [&_select]:w-full [&_select]:border [&_select]:border-[var(--admin-gray-200)] [&_select]:rounded-lg [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-sm [&_select]:bg-white [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[var(--admin-gray-200)] [&_textarea]:rounded-lg [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-sm [&_textarea]:bg-white">
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex justify-between items-center bg-white border border-[var(--admin-gray-200)] rounded-lg px-3.5 py-2.5 mb-3">
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
