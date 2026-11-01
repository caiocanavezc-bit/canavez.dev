import { Hanken_Grotesk, IBM_Plex_Mono, Spectral } from "next/font/google";

// next/font/google baixa as fontes no build e serve junto com o site: nenhuma requisição
// ao Google em runtime. Trio editorial: serifa leve nos títulos, grotesca no texto,
// mono nos rótulos e datas.
export const serif = Spectral({
  variable: "--ff-serif",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const sans = Hanken_Grotesk({
  variable: "--ff-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// A mono só aparece em datas e rótulos pequenos: sem preload, fica fora do caminho crítico.
export const mono = IBM_Plex_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});
