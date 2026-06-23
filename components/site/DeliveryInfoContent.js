"use client";

import { useT } from "./SiteProviders";

export default function DeliveryInfoContent() {
  const t = useT();
  return (
    <>
      <p style={{ marginBottom: 14 }}>
        {t(
          "আমরা সারাদেশে কুরিয়ারের মাধ্যমে ডেলিভারি দিই। ডেলিভারি চার্জ ও সময় আপনার এলাকার উপর নির্ভর করে — অর্ডার করার সময় হোয়াটসঅ্যাপে আমরা আপনাকে সঠিক তথ্য জানিয়ে দিব।",
          "We deliver nationwide via courier. Delivery charge and time depend on your location — we'll confirm the exact details with you on WhatsApp when you place your order."
        )}
      </p>
      <p style={{ marginBottom: 14 }}>
        {t(
          "পেমেন্ট ক্যাশ অন ডেলিভারিতে (COD) করা যায়।",
          "Payment can be made via Cash on Delivery (COD)."
        )}
      </p>
      <p>
        {t(
          "যেকোনো প্রশ্নের জন্য হোয়াটসঅ্যাপে আমাদের সাথে সরাসরি যোগাযোগ করুন।",
          "For any questions, feel free to message us directly on WhatsApp."
        )}
      </p>
    </>
  );
}
