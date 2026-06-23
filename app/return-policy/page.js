import { getSiteChrome } from "@/lib/site-data";
import InfoPageClient from "@/components/site/InfoPageClient";
import ReturnPolicyContent from "@/components/site/ReturnPolicyContent";

export const dynamic = "force-dynamic";

export default async function ReturnPolicyPage() {
  const { categories, settings, hasActiveCombo } = await getSiteChrome();
  return (
    <InfoPageClient
      titleBn="রিটার্ন পলিসি"
      titleEn="Return Policy"
      categories={categories}
      settings={settings}
      hasActiveCombo={hasActiveCombo}
    >
      <ReturnPolicyContent />
    </InfoPageClient>
  );
}
