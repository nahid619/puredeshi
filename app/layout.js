import "./globals.css";

export const metadata = {
  title: "Pure Deshi — পিওর দেশি",
  description: "পিওর দেশি — বিশুদ্ধতার পরিচয় (Pure Deshi — The Mark of Purity)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
