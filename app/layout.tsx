import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SkipLink } from "@/components/skip-link";
import { perfil } from "@/content/perfil";
import { revealScript } from "@/lib/reveal-script";
import { siteUrl } from "@/lib/site";
import { themeScript } from "@/lib/theme-script";
import { mono, sans, serif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Caio Canavez · Desenvolvedor full-stack", template: "%s" },
  description: perfil.bio,
  openGraph: { type: "website", locale: "pt_BR", siteName: "Caio Canavez" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  // o site é escuro por padrão, então a barra do navegador também
  themeColor: "#131514",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      // os scripts inline acrescentam a classe "js" e o data-theme antes da hidratação
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
