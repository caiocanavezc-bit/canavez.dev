import type { Metadata } from "next";
import { SkipLink } from "@/components/skip-link";
import { perfil } from "@/content/perfil";
import { revealScript } from "@/lib/reveal-script";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      // o script inline acrescenta a classe "js" antes da hidratação
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
