// app/layout.js
import { Baloo_Da_2, Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import "@tabler/icons-webfont/dist/tabler-icons.css";
import "./globals.css";

// Headings font — Baloo Da 2 (Section 3 of the project spec)
const balooDa2 = Baloo_Da_2({
  variable: "--font-heading",
  subsets: ["latin", "bengali"],
  weight: ["500", "600", "700"],
});

// Body/UI font — Hind Siliguri (Section 3 of the project spec)
const hindSiliguri = Hind_Siliguri({
  variable: "--font-body",
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600"],
});

// Numeral/price font — Noto Sans Bengali renders clean, standard Bengali
// digit forms (০–৯). Baloo Da 2 and Hind Siliguri have stylised numeral
// glyphs that cause the "১ looks wrong" rendering issue on price tags.
const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-numeral",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Pure Deshi — পিওর দেশি",
  description: "পিওর দেশি — বিশুদ্ধতার পরিচয় (Pure Deshi — The Mark of Purity)",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${balooDa2.variable} ${hindSiliguri.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}