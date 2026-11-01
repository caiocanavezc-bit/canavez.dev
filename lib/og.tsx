import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Leitura síncrona no carregamento do módulo: sem I/O assíncrono no handler,
// o Next pré-renderiza as imagens no build (com cacheComponents, readFile async as tornava dinâmicas).
const fonte = (arquivo: string) =>
  readFileSync(join(process.cwd(), "node_modules/geist/dist/fonts", arquivo));
const bold = fonte("geist-sans/Geist-Bold.ttf");
const mono = fonte("geist-mono/GeistMono-Regular.ttf");

/** Imagem de compartilhamento no visual do site: fundo claro, título em tinta escura, assinatura na cor de destaque. */
export async function ogImage({
  titulo,
  subtitulo,
}: {
  titulo: string;
  subtitulo: string;
}): Promise<ImageResponse> {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f4f5f2",
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "Geist",
            fontSize: 72,
            color: "#1d211f",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          {titulo}
        </div>
        <div
          style={{
            fontFamily: "Geist",
            fontSize: 32,
            color: "#474d49",
            marginTop: 24,
            lineHeight: 1.3,
          }}
        >
          {subtitulo}
        </div>
      </div>
      <div style={{ fontFamily: "Geist Mono", fontSize: 24, color: "#2f6a5e" }}>
        canavez
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: bold, style: "normal", weight: 700 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
