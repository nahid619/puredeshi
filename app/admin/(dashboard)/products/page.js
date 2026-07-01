// app/admin/(dashboard)/products/page.js
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { formatTaka } from "@/lib/bn";
import { slugify } from "@/lib/slugify";
import ProductForm from "@/components/admin/ProductForm";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = "add new"

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      if (!prodRes.ok) throw new Error(prodData.error);
      if (!catRes.ok) throw new Error(catData.error);
      setProducts(prodData);
      setCategories(catData);
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

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.nameBn.includes(search) ||
        p.nameEn.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.category?._id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  function openAddForm() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEditForm(product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingProduct(null);
  }

  async function handleSave(payload) {
    const isEdit = !!editingProduct;
    const body = isEdit
      ? payload
      : { ...payload, slug: `${slugify(payload.nameEn)}-${Date.now().toString(36).slice(-4)}` };

    const res = await fetch(
      isEdit ? `/api/products/${editingProduct._id}` : "/api/products",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "সেভ করা যায়নি");
    }
    closeForm();
    await loadData();
  }

  async function handleDelete(product) {
    if (!confirm(`"${product.nameBn}" ডিলিট করতে চান?`)) return;
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadData();
    } catch (err) {
      alert(err.message || "ডিলিট করা যায়নি");
    }
  }

  async function toggleFeatured(product) {
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadData();
    } catch (err) {
      alert(err.message || "আপডেট করা যায়নি");
    }
  }

  return (
    <div className="bg-[var(--admin-surface)] rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] overflow-hidden">
      <div className="flex flex-wrap justify-between items-center gap-3.5 px-5 py-4.5 border-b border-[var(--admin-gray-100)]">
        <div className="flex gap-2.5 flex-1 max-w-[480px]">
          <input
            type="text"
            placeholder="প্রোডাক্ট খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-[var(--admin-gray-200)] rounded-lg px-3 py-2 flex-1"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-[var(--admin-gray-200)] rounded-lg px-3 py-2"
          >
            <option value="all">সব ক্যাটাগরি</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nameBn}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-[9px] font-semibold text-[13.5px] bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)]"
        >
          <i className="ti ti-plus" /> নতুন প্রোডাক্ট
        </button>
      </div>

      {error && <p className="text-sm text-[var(--brand-coral-600)] px-5 py-3">{error}</p>}
      {loading && <p className="text-sm text-[var(--admin-gray-500)] px-5 py-6">লোড হচ্ছে…</p>}

      {/* "Add new" has no specific row to anchor to, so it opens right here,
          immediately visible without any scrolling. */}
      {formOpen && !editingProduct && (
        <ProductForm
          key="new"
          product={null}
          categories={categories}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}

      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ছবি", "নাম", "ক্যাটাগরি", "দাম", "স্টক", "ফিচার্ড", ""].map((h) => (
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
            {filtered.map((p) => {
              const isSale = p.priceRegular && p.priceRegular > p.priceCurrent;
              const isEditingThis = formOpen && editingProduct?._id === p._id;
              return (
                <Fragment key={p._id}>
                  <tr>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)]">
                      <div className="w-[42px] h-[42px] rounded-lg bg-gradient-to-br from-[var(--brand-amber-50)] to-[#fff5e4] flex items-center justify-center overflow-hidden">
                        {p.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/blob preview URL, not a static asset
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <i
                            className={`ti ${p.category?.icon || "ti-package"} text-[var(--brand-amber-600,#854F0B)]`}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] font-semibold text-[var(--admin-gray-900)] text-[13.5px]">
                      {p.nameBn}
                    </td>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] text-[13.5px]">
                      {p.category?.nameBn || "—"}
                    </td>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] text-[13.5px]">
                      {isSale && <span className="price-old">{formatTaka(p.priceRegular)}</span>}
                      <span className={`price-now ${isSale ? "sale" : "normal"}`}>
                        {formatTaka(p.priceCurrent)}
                      </span>
                    </td>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)]">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                          p.inStock
                            ? "bg-[var(--brand-green-50)] text-[var(--brand-green-800)]"
                            : "bg-[var(--admin-gray-100)] text-[var(--admin-gray-500)]"
                        }`}
                      >
                        {p.inStock ? "স্টকে আছে" : "স্টক আউট"}
                      </span>
                    </td>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)]">
                      <button onClick={() => toggleFeatured(p)} title="ফিচার্ড টগল করুন">
                        <i
                          className={`ti ${
                            p.isFeatured ? "ti-star-filled text-[var(--brand-amber-400)]" : "ti-star text-[var(--admin-gray-200)]"
                          } text-lg`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3 border-b border-[var(--admin-gray-100)] whitespace-nowrap">
                      <button
                        onClick={() => (isEditingThis ? closeForm() : openEditForm(p))}
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)]"
                      >
                        <i className={`ti ${isEditingThis ? "ti-x" : "ti-edit"}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
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
                      <td colSpan={7} className="p-0">
                        <ProductForm
                          key={p._id}
                          product={editingProduct}
                          categories={categories}
                          onSave={handleSave}
                          onCancel={closeForm}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-sm text-[var(--admin-gray-500)] py-8">
                  কোনো প্রোডাক্ট পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}