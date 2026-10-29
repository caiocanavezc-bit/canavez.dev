import type { Metadata } from "next";
import { RevealObserver } from "@/components/reveal-observer";
import { SkipLink } from "@/components/skip-link";
import { perfil } from "@/content/perfil";
import { siteUrl } from "@/lib/site";
import { geistMono, geistSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Caio Canavez · Desenvolvedor full-stack", template: "%s" },
  description: perfil.bio,
  openGraph: { type: "website", locale: "pt_BR", siteName: "Caio Canavez" },
  twitter: { card: "summary_large_image" },
};

// Marca <html> com "js" antes da pintura: só então o CSS esconde o que vai ser revelado.
const marcarJs = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: marcarJs }} />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
