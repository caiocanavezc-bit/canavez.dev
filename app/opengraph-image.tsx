import { perfil } from "@/content/perfil";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Caio Canavez, desenvolvedor full-stack";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    titulo: `${perfil.nome}, desenvolvedor full-stack`,
    subtitulo: perfil.bio,
  });
}
