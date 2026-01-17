import type { Metadata } from "next";
import "./globals.css";
import RTLToggle from "@/components/RTLToggle";

export const metadata: Metadata = {
  title: "AI Tool Founder – Compare & Review AI Tools",
  description:
    "AI Tool Founder lets you discover, compare and review AI tools. See ratings, comparisons and real reviews for the best AI tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="antialiased">
        <div className="fixed top-4 right-4 z-50">
          <RTLToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
