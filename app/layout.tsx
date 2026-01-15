import type { Metadata } from "next";
import "./globals.css";
import RTLToggle from "@/components/RTLToggle";

export const metadata: Metadata = {
  title: "AI Tool Finder - Discover & Compare AI Tools",
  description: "Find and compare AI tools for video, image, audio, text, and more",
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
