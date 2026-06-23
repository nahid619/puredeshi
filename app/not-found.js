import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-20 text-center bg-[var(--brand-amber-50)] min-h-screen">
      <Image src="/images/logo-emblem.png" alt="Pure Deshi" width={90} height={90} />
      <h1 className="text-2xl font-bold text-[var(--brand-green-900)]">পেজটি পাওয়া যায়নি</h1>
      <p className="text-sm text-[var(--brand-green-700)] max-w-sm">
        এই প্রোডাক্ট বা পেজটি খুঁজে পাওয়া যায়নি। সম্ভবত এটি রিমুভ করা হয়েছে বা লিংকটি ভুল।
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[var(--brand-amber-200)] to-[var(--brand-amber-400)] text-[var(--brand-amber-900)] text-sm font-semibold px-5 py-2.5"
      >
        হোমপেজে ফিরে যান
      </Link>
    </main>
  );
}
