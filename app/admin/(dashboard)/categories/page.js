// app/admin/(dashboard)/categories/page.js
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { slugify } from "@/lib/slugify";
import { toBnDigits } from "@/lib/bn";

const emptyForm = { nameBn: "", nameEn: "", icon: "ti-category", taglineBn: "", taglineEn: "" };

// Extracted so the exact same form markup can render in two different
// places: above the table for "add new", or inline directly under the row
// being edited — instead of always appearing once at the very bottom of
// the page, far from whatever you actually clicked.
function CategoryForm({ form, setForm, saving, formError, onSubmit, onCancel }) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-[var(--admin-gray-100)] p-6 bg-[var(--admin-gray-50)] max-w-md"
    >
      <div className="mb-4">
        <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
          নাম (বাংলা)
        </label>
        <input
          value={form.nameBn}
          onChange={(e) => setForm((f) => ({ ...f, nameBn: e.target.value }))}
          className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
          নাম (English)
        </label>
        <input
          value={form.nameEn}
          onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
          className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
          আইকন (Tabler icon ক্লাস)
        </label>
        <input
          value={form.icon}
          onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
          placeholder="ti-droplet"
          className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-white"
        />
        <p className="text-[11.5px] text-[var(--admin-gray-500)] mt-1.5">
          আইকনের নাম দেখতে চাইলে{" "}
          <a href="https://tabler.io/icons" target="_blank" rel="noreferrer" className="underline">
            tabler.io/icons
          </a>{" "}
          দেখুন — যেমনঃ ti-droplet, ti-flask, ti-package
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3.5 mb-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
            ট্যাগলাইন — বাংলা (ঐচ্ছিক)
          </label>
          <input
            value={form.taglineBn}
            onChange={(e) => setForm((f) => ({ ...f, taglineBn: e.target.value }))}
            placeholder="যেমনঃ রান্নার মূল উপকরণ"
            className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
            Tagline — English (optional)
          </label>
          <input
            value={form.taglineEn}
            onChange={(e) => setForm((f) => ({ ...f, taglineEn: e.target.value }))}
            placeholder="e.g. Kitchen essentials"
            className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-white"
          />
        </div>
      </div>
      <p className="text-[11.5px] text-[var(--admin-gray-500)] -mt-2.5 mb-3.5">
        হোমপেজে ক্যাটাগরির নামের উপরে ছোট একটি লাইন হিসেবে দেখাবে। খালি রাখলে ক্যাটাগরির নামই
        দেখাবে।
      </p>

      {formError && (
        <p className="text-sm text-[var(--brand-coral-600)] bg-[var(--brand-coral-50)] rounded-lg px-3 py-2 mb-3">
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
          onClick={onCancel}
          className="px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-[var(--admin-gray-100)] text-[var(--admin-gray-700)] hover:bg-[var(--admin-gray-200)]"
        >
          বাতিল
        </button>
      </div>
    </form>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories", { cache: "no-store" }),
        fetch("/api/products", { cache: "no-store" }),
      ]);
      const catData = await catRes.json();
      const prodData = await prodRes.json();
      if (!catRes.ok) throw new Error(catData.error);
      if (!prodRes.ok) throw new Error(prodData.error);
      setCategories(catData);
      setProducts(prodData);
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

  const countsByCategory = useMemo(() => {
    const counts = {};
    for (const p of products) {
      const id = p.category?._id || p.category;
      if (!id) continue;
      counts[id] = (counts[id] || 0) + 1;
    }
    return counts;
  }, [products]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(category) {
    setEditing(category);
    setForm({
      nameBn: category.nameBn,
      nameEn: category.nameEn,
      icon: category.icon,
      taglineBn: category.taglineBn || "",
      taglineEn: category.taglineEn || "",
    });
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!form.nameBn || !form.nameEn) {
      setFormError("বাংলা ও English নাম আবশ্যক");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editing;
      const body = isEdit ? form : { ...form, slug: slugify(form.nameEn) };
      const res = await fetch(isEdit ? `/api/categories/${editing._id}` : "/api/categories", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      closeForm();
      await loadData();
    } catch (err) {
      setFormError(err.message || "সেভ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    const count = countsByCategory[category._id] || 0;
    const warning =
      count > 0
        ? `"${category.nameBn}" ক্যাটাগরিতে ${toBnDigits(count)}টি প্রোডাক্ট আছে। তবুও ডিলিট করতে চান?`
        : `"${category.nameBn}" ডিলিট করতে চান?`;
    if (!confirm(warning)) return;
    try {
      const res = await fetch(`/api/categories/${category._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadData();
    } catch (err) {
      alert(err.message || "ডিলিট করা যায়নি");
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] overflow-hidden">
      <div className="flex justify-end px-5 py-4.5 border-b border-[var(--admin-gray-100)]">
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)]"
        >
          <i className="ti ti-plus" /> নতুন ক্যাটাগরি
        </button>
      </div>

      {error && <p className="text-sm text-[var(--brand-coral-600)] px-5 py-3">{error}</p>}
      {loading && <p className="text-sm text-[var(--admin-gray-500)] px-5 py-6">লোড হচ্ছে…</p>}

      {/* "Add new" has no specific row to anchor to, so it opens right
          here, immediately visible without scrolling. */}
      {formOpen && !editing && (
        <CategoryForm
          form={form}
          setForm={setForm}
          saving={saving}
          formError={formError}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["আইকন", "নাম", "প্রোডাক্ট সংখ্যা", ""].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11.5px] uppercase tracking-wide text-[var(--admin-gray-500)] px-5 py-2.5 border-b border-[var(--admin-gray-100)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const isEditingThis = formOpen && editing?._id === c._id;
              return (
                <Fragment key={c._id}>
                  <tr>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)]">
                      <div className="w-[42px] h-[42px] rounded-lg bg-gradient-to-br from-[var(--brand-amber-50)] to-[#fff5e4] flex items-center justify-center">
                        <i className={`ti ${c.icon} text-[var(--brand-amber-600,#854F0B)]`} />
                      </div>
                    </td>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] font-semibold text-[13.5px]">
                      {c.nameBn} <span className="text-[var(--admin-gray-500)] font-normal">({c.nameEn})</span>
                    </td>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] text-[13.5px]">
                      {toBnDigits(countsByCategory[c._id] || 0)}
                    </td>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] whitespace-nowrap">
                      <button
                        onClick={() => (isEditingThis ? closeForm() : openEdit(c))}
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)]"
                      >
                        <i className={`ti ${isEditingThis ? "ti-x" : "ti-edit"}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)]"
                      >
                        <i className="ti ti-trash" />
                      </button>
                    </td>
                  </tr>
                  {/* Edit form opens directly under the row you clicked —
                      not at the bottom of the whole list. */}
                  {isEditingThis && (
                    <tr>
                      <td colSpan={4} className="p-0">
                        <CategoryForm
                          form={form}
                          setForm={setForm}
                          saving={saving}
                          formError={formError}
                          onSubmit={handleSubmit}
                          onCancel={closeForm}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-sm text-[var(--admin-gray-500)] py-8">
                  কোনো ক্যাটাগরি নেই।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}