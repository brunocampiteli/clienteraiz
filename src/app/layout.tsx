import type { Metadata } from "next";
import { DM_Sans, Bitter } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cliente Raiz",
  description: "Cliente Raiz — Gamificação de bares e cervejarias",
  manifest: "/manifest.json",
  themeColor: "#1A3C2E",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cliente Raiz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${dmSans.variable} ${bitter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
