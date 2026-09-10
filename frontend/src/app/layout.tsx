import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { AppShell } from "@/components/layout/AppShell";
import { GsapProvider } from "@/components/motion/GsapProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "COACH.AI — Technical Interview Engine",
  description:
    "High-signal AI technical assessments calibrated for Staff and Principal engineering interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${inter.variable} ${jetbrains.variable} ${GeistSans.className} antialiased`}
      >
        <GsapProvider>
          <AppShell>{children}</AppShell>
        </GsapProvider>
      </body>
    </html>
  );
}
