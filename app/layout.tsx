import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caio Canavez",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
