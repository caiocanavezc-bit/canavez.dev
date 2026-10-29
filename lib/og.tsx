import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const fonte = (arquivo: string) =>
  readFile(join(process.cwd(), "node_modules/geist/dist/fonts", arquivo));

/** Imagem de compartilhamento no visual do site: fundo preto, título branco, subtítulo cinza. */
export async function ogImage({
  titulo,
  subtitulo,
}: {
  titulo: string;
  subtitulo: string;
}): Promise<ImageResponse> {
  const [bold, mono] = await Promise.all([
    fonte("geist-sans/Geist-Bold.ttf"),
    fonte("geist-mono/GeistMono-Regular.ttf"),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#000000",
        padding: "72px 80px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "Geist",
            fontSize: 72,
            color: "#E7E9EA",
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
            color: "#71767B",
            marginTop: 24,
            lineHeight: 1.3,
          }}
        >
          {subtitulo}
        </div>
      </div>
      <div style={{ fontFamily: "Geist Mono", fontSize: 24, color: "#71767B" }}>
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
