import Image from "next/image";
import SetupStatus from "@/components/SetupStatus";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-16 text-center bg-[var(--brand-amber-50)]">
      <Image
        src="/images/logo-emblem.png"
        alt="Pure Deshi logo"
        width={140}
        height={140}
        priority
      />

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-green-900)]">
          PURE DESHi
        </h1>
        <p className="mt-1 text-lg text-[var(--brand-green-700)]">
          পিওর দেশি — বিশুদ্ধতার পরিচয়
        </p>
      </div>

      <span className="inline-block rounded-full bg-[var(--brand-green-800)] text-[var(--brand-amber-50)] text-xs font-semibold px-4 py-1.5 tracking-wide">
        PHASE 1 — INFRASTRUCTURE SETUP
      </span>

      <p className="max-w-md text-sm opacity-80">
        This is a placeholder page confirming the project is running correctly.
        The real homepage (sections, products, language toggle, etc.) gets
        built in Phase 4.
      </p>

      <SetupStatus />
    </main>
  );
}
