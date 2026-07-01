// app/admin/(dashboard)/testimonials/page.js
"use client";

import { useEffect, useState } from "react";

const EMPTY_FORM = {
  avatar: "",
  nameBn: "",
  nameEn: "",
  roleBn: "",
  roleEn: "",
  textBn: "",
  textEn: "",
};

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/testimonials", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems([...data].sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err) {
      setError(err.message || "ডেটা লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setFormError("");
    setFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!form.nameBn || !form.nameEn || !form.textBn || !form.textEn) {
      setFormError("নাম ও মতামত — দুই ভাষাতেই — অবশ্যই পূরণ করতে হবে");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sortOrder: items.length, isActive: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || "সেভ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!confirm("এই মতামতটি ডিলিট করতে চান?")) return;
    try {
      const res = await fetch(`/api/testimonials/${item._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadData();
    } catch (err) {
      alert(err.message || "ডিলিট করা যায়নি");
    }
  }

  async function toggleActive(item) {
    try {
      const res = await fetch(`/api/testimonials/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadData();
    } catch (err) {
      alert(err.message || "আপডেট করা যায়নি");
    }
  }

  async function move(item, direction) {
    const index = items.findIndex((i) => i._id === item._id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;
    const other = items[swapIndex];
    try {
      await Promise.all([
        fetch(`/api/testimonials/${item._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: other.sortOrder }),
        }),
        fetch(`/api/testimonials/${other._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: item.sortOrder }),
        }),
      ]);
      await loadData();
    } catch {
      alert("ক্রম পরিবর্তন করা যায়নি");
    }
  }

  return (
    <div className="bg-[var(--admin-surface)] rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] overflow-hidden">
      <div className="flex justify-end px-5 py-4.5 border-b border-[var(--admin-gray-100)]">
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)]"
        >
          <i className="ti ti-plus" /> নতুন মতামত
        </button>
      </div>

      {error && <p className="text-sm text-[var(--brand-coral-600)] px-5 py-3">{error}</p>}
      {loading && <p className="text-sm text-[var(--admin-gray-500)] px-5 py-6">লোড হচ্ছে…</p>}

      {!loading && !error && (
        <div className="p-5 flex flex-col gap-3">
          {items.map((item, i) => (
            <div
              key={item._id}
              className="flex items-center gap-4 border border-[var(--admin-gray-100)] rounded-xl p-3"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--brand-green-50)] text-[var(--brand-green-800)] flex items-center justify-center font-semibold text-sm shrink-0">
                {item.avatar || item.nameEn.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">
                  {item.nameBn} / {item.nameEn}
                </p>
                <p className="text-[12.5px] text-[var(--admin-gray-500)] truncate">{item.textEn}</p>
                <button onClick={() => toggleActive(item)} className="mt-1">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      item.isActive
                        ? "bg-[var(--brand-green-50)] text-[var(--brand-green-800)]"
                        : "bg-[var(--admin-gray-100)] text-[var(--admin-gray-500)]"
                    }`}
                  >
                    {item.isActive ? "অ্যাক্টিভ" : "নিষ্ক্রিয়"}
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(item, "up")}
                  disabled={i === 0}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)] disabled:opacity-30"
                >
                  <i className="ti ti-chevron-up" />
                </button>
                <button
                  onClick={() => move(item, "down")}
                  disabled={i === items.length - 1}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)] disabled:opacity-30"
                >
                  <i className="ti ti-chevron-down" />
                </button>
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)]"
              >
                <i className="ti ti-trash" />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-sm text-[var(--admin-gray-500)] py-8">
              কোনো মতামত নেই।
            </p>
          )}
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="border-t border-[var(--admin-gray-100)] p-6 bg-[var(--admin-gray-50)] max-w-lg flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
                নাম (বাংলা)
              </label>
              <input
                value={form.nameBn}
                onChange={(e) => update("nameBn", e.target.value)}
                className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-[var(--admin-surface)]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
                Name (English)
              </label>
              <input
                value={form.nameEn}
                onChange={(e) => update("nameEn", e.target.value)}
                className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-[var(--admin-surface)]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
                পরিচয় (বাংলা) — যেমন গৃহিণী
              </label>
              <input
                value={form.roleBn}
                onChange={(e) => update("roleBn", e.target.value)}
                className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-[var(--admin-surface)]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
                Role (English) — e.g. Homemaker
              </label>
              <input
                value={form.roleEn}
                onChange={(e) => update("roleEn", e.target.value)}
                className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-[var(--admin-surface)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
              অ্যাভাটার লেখা (২ অক্ষর — খালি রাখলে নাম থেকে নেওয়া হবে)
            </label>
            <input
              value={form.avatar}
              onChange={(e) => update("avatar", e.target.value)}
              maxLength={2}
              placeholder="রবে"
              className="w-32 border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-[var(--admin-surface)]"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
              মতামত (বাংলা)
            </label>
            <textarea
              rows={3}
              value={form.textBn}
              onChange={(e) => update("textBn", e.target.value)}
              className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-[var(--admin-surface)]"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
              Review (English)
            </label>
            <textarea
              rows={3}
              value={form.textEn}
              onChange={(e) => update("textEn", e.target.value)}
              className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-[var(--admin-surface)]"
            />
          </div>

          {formError && (
            <p className="text-sm text-[var(--brand-coral-600)] bg-[var(--brand-coral-50)] rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <div className="flex gap-2.5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)] disabled:opacity-60"
            >
              <i className="ti ti-check" />
              {saving ? "সেভ হচ্ছে…" : "সেভ করুন"}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-[var(--admin-gray-100)] text-[var(--admin-gray-700)] hover:bg-[var(--admin-gray-200)]"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}
    </div>
  );
}