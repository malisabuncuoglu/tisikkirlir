import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Opportunity Cockpit",
  description: "Founder research agent & opportunity scoring engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex font-sans">
        <Providers>
          <Sidebar />
          <main className="flex-1 min-h-screen overflow-auto">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 pt-14 md:pt-6">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
