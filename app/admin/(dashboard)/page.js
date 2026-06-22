"use client";

import { useEffect, useState } from "react";

function StatCard({ icon, iconBg, iconColor, value, label }) {
  return (
    <div className="bg-white rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] p-5">
      <div
        className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center mb-3"
        style={{ background: iconBg }}
      >
        <i className={`ti ${icon} text-xl`} style={{ color: iconColor }} />
      </div>
      <div className="text-2xl font-bold text-[var(--admin-gray-900)]">{value}</div>
      <div className="text-xs text-[var(--admin-gray-500)] mt-0.5">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.error) {
          setError(data.error);
        } else {
          setStats(data);
        }
      })
      .catch(() => active && setError("সার্ভারের সাথে সংযোগ করা যায়নি"));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <StatCard
          icon="ti-shopping-bag"
          iconBg="var(--brand-amber-50)"
          iconColor="var(--brand-amber-400)"
          value={stats ? stats.totalProducts : "…"}
          label="মোট প্রোডাক্ট"
        />
        <StatCard
          icon="ti-brand-whatsapp"
          iconBg="var(--brand-green-50)"
          iconColor="var(--brand-green-700)"
          value={stats ? stats.monthClicks : "…"}
          label="এই মাসে অর্ডার ক্লিক"
        />
        <StatCard
          icon="ti-flame"
          iconBg="var(--brand-coral-50)"
          iconColor="var(--brand-coral-600)"
          value={stats ? stats.mostPopularProduct || "এখনও কোনো ডেটা নেই" : "…"}
          label="সবচেয়ে জনপ্রিয়"
        />
        <StatCard
          icon="ti-alert-triangle"
          iconBg="var(--admin-gray-100)"
          iconColor="var(--admin-gray-500)"
          value={stats ? stats.outOfStockCount : "…"}
          label="স্টক আউট প্রোডাক্ট"
        />
      </div>

      {error && (
        <p className="text-sm text-[var(--brand-coral-600)] mt-3">{error}</p>
      )}

      <div className="bg-white rounded-xl shadow-[0_6px_18px_rgba(23,52,4,0.07)] mt-5">
        <div className="p-10 text-center text-[var(--admin-gray-500)] text-sm">
          <i className="ti ti-chart-bar text-3xl text-[var(--admin-gray-400)] block mb-2.5" />
          বিস্তারিত অ্যানালিটিক্স পরে যুক্ত করা যাবে — কোন প্রোডাক্টে সবচেয়ে বেশি ক্লিক হচ্ছে,
          দিন/সপ্তাহ অনুযায়ী।
        </div>
      </div>
    </div>
  );
}
