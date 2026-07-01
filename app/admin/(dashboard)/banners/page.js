"use client";

import { useEffect, useState } from "react";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/banners", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBanners([...data].sort((a, b) => a.sortOrder - b.sortOrder));
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
    setImage("");
    setLink("");
    setFormError("");
    setFormOpen(true);
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setUploading(true);
    setFormError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "ছবি আপলোড ব্যর্থ হয়েছে");
        return;
      }
      setImage(data.url);
    } catch {
      setFormError("ছবি আপলোড করার সময় সংযোগ বিচ্ছিন্ন হয়ে গেছে");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!image || image.startsWith("blob:")) {
      setFormError("ছবি আপলোড সম্পন্ন হওয়া পর্যন্ত অপেক্ষা করুন");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, link, sortOrder: banners.length, isActive: true }),
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

  async function handleDelete(banner) {
    if (!confirm("এই ব্যানারটি ডিলিট করতে চান?")) return;
    try {
      const res = await fetch(`/api/banners/${banner._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadData();
    } catch (err) {
      alert(err.message || "ডিলিট করা যায়নি");
    }
  }

  async function toggleActive(banner) {
    try {
      const res = await fetch(`/api/banners/${banner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadData();
    } catch (err) {
      alert(err.message || "আপডেট করা যায়নি");
    }
  }

  async function move(banner, direction) {
    const index = banners.findIndex((b) => b._id === banner._id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= banners.length) return;
    const other = banners[swapIndex];
    try {
      await Promise.all([
        fetch(`/api/banners/${banner._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: other.sortOrder }),
        }),
        fetch(`/api/banners/${other._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: banner.sortOrder }),
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
          <i className="ti ti-plus" /> নতুন ব্যানার
        </button>
      </div>

      {error && <p className="text-sm text-[var(--brand-coral-600)] px-5 py-3">{error}</p>}
      {loading && <p className="text-sm text-[var(--admin-gray-500)] px-5 py-6">লোড হচ্ছে…</p>}

      {!loading && !error && (
        <div className="p-5 flex flex-col gap-3">
          {banners.map((b, i) => (
            <div
              key={b._id}
              className="flex items-center gap-4 border border-[var(--admin-gray-100)] rounded-xl p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/blob preview URL, not a static asset */}
              <img
                src={b.image}
                alt=""
                className="w-28 h-16 object-cover rounded-lg shrink-0 bg-[var(--admin-gray-100)]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{b.link || "(কোনো লিংক নেই)"}</p>
                <button onClick={() => toggleActive(b)} className="mt-1">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      b.isActive
                        ? "bg-[var(--brand-green-50)] text-[var(--brand-green-800)]"
                        : "bg-[var(--admin-gray-100)] text-[var(--admin-gray-500)]"
                    }`}
                  >
                    {b.isActive ? "অ্যাক্টিভ" : "নিষ্ক্রিয়"}
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(b, "up")}
                  disabled={i === 0}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)] disabled:opacity-30"
                >
                  <i className="ti ti-chevron-up" />
                </button>
                <button
                  onClick={() => move(b, "down")}
                  disabled={i === banners.length - 1}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)] disabled:opacity-30"
                >
                  <i className="ti ti-chevron-down" />
                </button>
              </div>
              <button
                onClick={() => handleDelete(b)}
                className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--admin-gray-500)] hover:bg-[var(--admin-gray-100)]"
              >
                <i className="ti ti-trash" />
              </button>
            </div>
          ))}
          {banners.length === 0 && (
            <p className="text-center text-sm text-[var(--admin-gray-500)] py-8">
              কোনো ব্যানার নেই।
            </p>
          )}
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="border-t border-[var(--admin-gray-100)] p-6 bg-[var(--admin-gray-50)] max-w-md"
        >
          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
              ব্যানার ছবি
            </label>
            <div
              onClick={() => document.getElementById("banner-image").click()}
              className="border-[1.5px] border-dashed border-[var(--admin-gray-200)] rounded-[10px] p-4 text-center bg-[var(--admin-surface)] cursor-pointer"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary/blob preview URL, not a static asset
                <img src={image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
              ) : (
                <i className="ti ti-cloud-upload text-[26px] text-[var(--admin-gray-400)]" />
              )}
              <div className="text-[12.5px] text-[var(--admin-gray-500)] mt-1.5">
                {uploading ? "আপলোড হচ্ছে…" : "ছবি আপলোড করতে ক্লিক করুন"}
              </div>
            </div>
            <input
              id="banner-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-[var(--admin-gray-700)] mb-1.5">
              লিংক (ক্লিক করলে কোথায় যাবে — না থাকলে খালি রাখুন)
            </label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/products/sundarban-honey"
              className="w-full border border-[var(--admin-gray-200)] rounded-lg px-3 py-2.5 text-sm bg-[var(--admin-surface)]"
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