import { Geist, Geist_Mono } from "next/font/google";

// next/font/google baixa a Geist no build, recorta só o subconjunto latino (~1/3 do arquivo
// variável completo) e serve junto com o site: nenhuma requisição ao Google em runtime.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// A mono só aparece em números e chips pequenos: sem preload, fica fora do caminho crítico.
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
