"use client";

import { useEffect, useState } from "react";

export default function CatalogPreview() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [catRes, prodRes, comboRes] = await Promise.all([
        fetch("/api/categories", { cache: "no-store" }),
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/combos", { cache: "no-store" }),
      ]);
      setCategories(await catRes.json());
      setProducts(await prodRes.json());
      setCombos(await comboRes.json());
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  async function handleAddTestCategory() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameBn: "টেস্ট ক্যাটাগরি",
          nameEn: "Test Category",
          slug: `test-category-${Date.now()}`,
          icon: "ti-flask",
          sortOrder: 99,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`❌ ${data.error} (this is expected if you're not logged in — try logging in above first)`);
        return;
      }
      setMessage("✅ Test category created — protected POST works.");
      await loadData();
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`❌ ${data.error} (this is expected if you're not logged in — try logging in above first)`);
        return;
      }
      setMessage("✅ Category deleted — protected DELETE works.");
      await loadData();
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--brand-green-100)] bg-[var(--surface)] p-5 shadow-sm text-left">
      <h2 className="text-lg font-semibold mb-3">Catalog Data Test</h2>

      {loading ? (
        <p className="text-sm opacity-70">Loading…</p>
      ) : (
        <>
          <p className="text-sm mb-3">
            <strong>{categories.length}</strong> categories ·{" "}
            <strong>{products.length}</strong> products ·{" "}
            <strong>{combos.length}</strong> combo
          </p>

          <ul className="flex flex-col gap-1 mb-3">
            {categories.map((c) => (
              <li
                key={c._id}
                className="flex items-center justify-between text-sm border border-[var(--brand-green-100)] rounded-lg px-3 py-1.5"
              >
                <span>
                  {c.nameBn} <span className="opacity-60">/ {c.nameEn}</span>
                </span>
                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={busy}
                  className="text-xs text-[var(--brand-coral-600)] disabled:opacity-50"
                >
                  delete
                </button>
              </li>
            ))}
            {categories.length === 0 && (
              <li className="text-sm opacity-70">
                No categories yet — run <code className="px-1 rounded bg-black/5">npm run seed</code>.
              </li>
            )}
          </ul>

          <button
            onClick={handleAddTestCategory}
            disabled={busy}
            className="w-full rounded-lg border border-dashed border-[var(--brand-green-700)] text-sm py-2 hover:bg-[var(--brand-green-100)] transition-colors disabled:opacity-60"
          >
            + Add test category
          </button>

          {message && <p className="text-xs mt-2 opacity-80">{message}</p>}
        </>
      )}
    </div>
  );
}
