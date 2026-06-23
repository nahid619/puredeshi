import { getSiteChrome } from "@/lib/site-data";
import InfoPageClient from "@/components/site/InfoPageClient";
import FaqContent from "@/components/site/FaqContent";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const { categories, settings, hasActiveCombo } = await getSiteChrome();
  return (
    <InfoPageClient
      titleBn="সচরাচর জিজ্ঞাসা"
      titleEn="Frequently Asked Questions"
      categories={categories}
      settings={settings}
      hasActiveCombo={hasActiveCombo}
    >
      <FaqContent />
    </InfoPageClient>
  );
}
