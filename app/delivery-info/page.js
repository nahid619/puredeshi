import { getSiteChrome } from "@/lib/site-data";
import InfoPageClient from "@/components/site/InfoPageClient";
import DeliveryInfoContent from "@/components/site/DeliveryInfoContent";

export const dynamic = "force-dynamic";

export default async function DeliveryInfoPage() {
  const { categories, settings, hasActiveCombo } = await getSiteChrome();
  return (
    <InfoPageClient
      titleBn="ডেলিভারি তথ্য"
      titleEn="Delivery Information"
      categories={categories}
      settings={settings}
      hasActiveCombo={hasActiveCombo}
    >
      <DeliveryInfoContent />
    </InfoPageClient>
  );
}
