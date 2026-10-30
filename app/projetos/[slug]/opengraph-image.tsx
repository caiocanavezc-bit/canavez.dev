import { getProject, getProjects } from "@/lib/projects";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Case do portfólio de Caio Canavez";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getProject(slug)?.meta;
  return ogImage({
    titulo: meta?.title ?? "Caio Canavez",
    subtitulo: meta?.subtitle ?? "Portfólio",
  });
}
