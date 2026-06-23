"use client";

import Image from "next/image";

export default function Error({ error, reset }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-20 text-center bg-[var(--brand-amber-50)] min-h-screen">
      <Image src="/images/logo-emblem.png" alt="Pure Deshi" width={90} height={90} />
      <h1 className="text-2xl font-bold text-[var(--brand-green-900)]">
        সাইটটি লোড করা যাচ্ছে না
      </h1>
      <p className="text-sm text-[var(--brand-green-700)] max-w-md">
        সার্ভারের সাথে সংযোগে সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন। সমস্যা থাকলে অ্যাডমিন
        প্যানেলে গিয়ে .env.local ফাইলে MongoDB কানেকশন ঠিকমতো সেট করা আছে কিনা দেখুন।
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="text-xs text-left bg-white/60 rounded-lg p-3 max-w-lg overflow-auto text-[var(--brand-coral-600)]">
          {error?.message}
        </pre>
      )}
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)] text-sm font-semibold px-5 py-2.5"
      >
        আবার চেষ্টা করুন
      </button>
    </main>
  );
}
