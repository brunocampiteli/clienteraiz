import type { Metadata } from "next";
import { Nunito, Bebas_Neue } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Cliente Raiz",
  description: "Cliente Raiz — Fidelidade no Balcão",
  manifest: "/manifest.json",
  themeColor: "#212121",
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
        className={`${nunito.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
