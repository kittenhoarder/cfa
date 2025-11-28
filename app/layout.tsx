import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/app/components/Navigation";

export const metadata: Metadata = {
  title: "CFA Study Service",
  description: "Efficient CFA exam preparation with spaced repetition and practice questions",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        <div style={{ paddingTop: "48px" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
