// app/admin/(dashboard)/combos/page.js
"use client";

import { useEffect, useState } from "react";
import { formatTaka } from "@/lib/bn";

function emptyForm() {
  return {
    nameBn: "",
    nameEn: "",
    productIds: [],
    priceRegular: "",
    priceCombo: "",
    image: "",
    isActive: true,
  };
}

export default function CombosPage() {
  const [combos, setCombos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [comboRes, prodRes] = await Promise.all([
        fetch("/api/combos", { cache: "no-store" }),
        fetch("/api/products", { cache: "no-store" }),
      ]);
      const comboData = await comboRes.json();
      const prodData = await prodRes.json();
      if (!comboRes.ok) throw new Error(comboData.error);
      if (!prodRes.ok) throw new Error(prodData.error);
      setCombos(comboData);
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

  function openAdd() {
    setEditing(null);
    setForm(emptyForm());
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(combo) {
    setEditing(combo);
    setForm({
      nameBn: combo.nameBn,
      nameEn: combo.nameEn,
      productIds: combo.productIds.map((p) => p._id || p),
      priceRegular: combo.priceRegular ?? "",
      priceCombo: combo.priceCombo ?? "",
      image: combo.image || "",
      isActive: combo.isActive,
    });
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  function toggleProduct(id) {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id)
        ? f.productIds.filter((x) => x !== id)
        : [...f.productIds, id],
    }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const previousUrl = form.image;
    setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      if (previousUrl) body.append("oldUrl", previousUrl);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "ছবি আপলোড ব্যর্থ হয়েছে");
        return;
      }
      setForm((f) => ({ ...f, image: data.url }));
    } catch {
      setFormError("ছবি আপলোড করার সময় সংযোগ বিচ্ছিন্ন হয়ে গেছে");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!form.nameBn || !form.nameEn || form.productIds.length === 0 || form.priceCombo === "") {
      setFormError("নাম, কমপক্ষে একটি প্রোডাক্ট এবং কম্বো দাম আবশ্যক");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editing;
      const body = {
        nameBn: form.nameBn,
        nameEn: form.nameEn,
        productIds: form.productIds,
        priceRegular: form.priceRegular === "" ? undefined : Number(form.priceRegular),
        priceCombo: Number(form.priceCombo),
        image: form.image,
        isActive: form.isActive,
      };
      const res = await fetch(isEdit ? `/api/combos/${editing._id}` : "/api/combos", {
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

  async function handleDelete(combo) {
    if (!confirm(`"${combo.nameBn}" ডিলিট করতে চান?`)) return;
    try {
      const res = await fetch(`/api/combos/${combo._id}`, { method: "DELETE" });
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
          <i className="ti ti-plus" /> নতুন কম্বো
        </button>
      </div>

      {error && <p className="text-sm text-[var(--brand-coral-600)] px-5 py-3">{error}</p>}
      {loading && <p className="text-sm text-[var(--admin-gray-500)] px-5 py-6">লোড হচ্ছে…</p>}

      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ছবি", "নাম", "প্রোডাক্টসমূহ", "দাম", "অ্যাক্টিভ", ""].map((h) => (
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
            {combos.map((c) => {
              const isSale = c.priceRegular && c.priceRegular > c.priceCombo;
              return (
                <tr key={c._id}>
                  <td className="px-5 py-3 border-b border-[var(--admin-gray-100)]">
                    <div className="w-[42px] h-[42px] rounded-lg bg-gradient-to-br from-[var(--brand-amber-50)] to-[#fff5e4] flex items-center justify-center overflow-hidden">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/blob preview URL, not a static asset
                        <img src={c.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <i className="ti ti-package text-[var(--brand-amber-600,#854F0B)]" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] font-semibold text-[13.5px]">
                    {c.nameBn}
                  </td>
                  <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] text-[13px] text-[var(--admin-gray-700)]">
                    {c.productIds.map((p) => p.nameBn).join(", ")}
                  </td>
                  <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] text-[13.5px]">
                    {isSale && <span className="price-old">{formatTaka(c.priceRegular)}</span>}
                    <span className={`price-now ${isSale ? "sale" : "normal"}`}>
                      {formatTaka(c.priceCombo)}
                    </span>
                  </td>
                  <td className="px-5 py-3 border-b border-[var(--admin-gray-100)]">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        c.isActive
                          ? "bg-[var(--brand-green-50)] text-[var(--brand-green-800)]"
                          : "bg-[var(--admin-gray-100)] text-[var(--admin-gray-500)]"
                      }`}
                    >
                      {c.isActive ? "অ্যাক্টিভ" : "নিষ্ক্রিয়"}
                    </span>
                  </td>
                  <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] whitespace-nowrap">
                    <button
                      onClick={() => openEdit(c)}
                      className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)]"
                    >
                      <i className="ti ti-edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)]"
                    >
                      <i className="ti ti-trash" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {combos.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-sm text-[var(--admin-gray-500)] py-8">
                  কোনো কম্বো অফার নেই।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="border-t border-[var(--admin-gray-100)] p-6 bg-[var(--admin-gray-50)] max-w-lg"
        >
          <div className="grid grid-cols-2 gap-3.5 mb-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
                নাম (বাংলা)
              </label>
              <input
                value={form.nameBn}
                onChange={(e) => setForm((f) => ({ ...f, nameBn: e.target.value }))}
                className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
                নাম (English)
              </label>
              <input
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
              প্রোডাক্ট বেছে নিন
            </label>
            <div className="bg-white border border-[var(--admin-gray-200)] rounded-lg p-3 max-h-44 overflow-y-auto flex flex-col gap-1.5">
              {products.map((p) => (
                <label key={p._id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.productIds.includes(p._id)}
                    onChange={() => toggleProduct(p._id)}
                  />
                  {p.nameBn}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 mb-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
                পুরোনো দাম (যোগফল, না থাকলে খালি)
              </label>
              <input
                type="number"
                value={form.priceRegular}
                onChange={(e) => setForm((f) => ({ ...f, priceRegular: e.target.value }))}
                className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
                কম্বো দাম
              </label>
              <input
                type="number"
                value={form.priceCombo}
                onChange={(e) => setForm((f) => ({ ...f, priceCombo: e.target.value }))}
                className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
              ছবি
            </label>
            <div
              onClick={() => document.getElementById("combo-image").click()}
              className="border-[1.5px] border-dashed border-[var(--admin-gray-200)] rounded-[10px] p-4 text-center bg-white cursor-pointer"
            >
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/blob preview URL, not a static asset
                <img src={form.image} alt="" className="w-16 h-16 object-cover rounded-lg mx-auto mb-2" />
              ) : (
                <i className="ti ti-cloud-upload text-[26px] text-[var(--admin-gray-400)]" />
              )}
              <div className="text-[12.5px] text-[var(--admin-gray-500)] mt-1.5">
                {uploading ? "আপলোড হচ্ছে…" : "ছবি আপলোড করতে ক্লিক করুন"}
              </div>
            </div>
            <input
              id="combo-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex justify-between items-center bg-white border border-[var(--admin-gray-200)] rounded-lg px-3.5 py-2.5 mb-4">
            <span className="text-sm">অ্যাক্টিভ</span>
            <div
              role="switch"
              aria-checked={form.isActive}
              tabIndex={0}
              onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              className={`admin-switch ${form.isActive ? "on" : ""}`}
            />
          </div>

          {formError && (
            <p className="text-sm text-[var(--brand-coral-600)] bg-[var(--brand-coral-50)] rounded-lg px-3 py-2 mb-3">
              {formError}
            </p>
          )}

          <div className="flex gap-2.5">
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
              onClick={closeForm}
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