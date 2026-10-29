import fs from "node:fs";
import path from "node:path";

export type ProjectMeta = {
  slug: string;
  title: string;
  subtitle: string;
  year: number;
  role: string;
  kind: "sistema" | "site";
  stack: string[];
  liveUrl?: string;
  cover: string;
  thumb: string;
  gallery: { src: string; alt: string }[];
  order: number;
  published: boolean;
};

const OBRIGATORIOS = ["slug", "title", "subtitle", "year", "role", "kind", "stack", "cover", "thumb", "gallery", "order", "published"] as const;
const KINDS = ["sistema", "site"];

/** Valida os metadados de todos os cases e lança um único Error listando todas as falhas. */
export function validateProjects(entries: { fileSlug: string; meta: unknown }[], publicDir: string): ProjectMeta[] {
  const erros: string[] = [];
  const ordens = new Map<number, string>();

  for (const { fileSlug, meta } of entries) {
    const m = (meta ?? {}) as Record<string, unknown>;
    const falha = (msg: string) => erros.push(`${fileSlug}: ${msg}`);
    const imagem = (src: unknown) => {
      if (typeof src !== "string" || !fs.existsSync(path.join(publicDir, src))) falha(`imagem não encontrada: ${String(src)}`);
    };

    for (const campo of OBRIGATORIOS) if (m[campo] === undefined) falha(`campo obrigatório ausente: ${campo}`);
    if (m.slug !== undefined && m.slug !== fileSlug) falha(`slug "${String(m.slug)}" difere do arquivo`);
    if (m.kind !== undefined && !KINDS.includes(m.kind as string)) falha(`kind inválido: ${String(m.kind)}`);
    if (m.cover !== undefined) imagem(m.cover);
    if (m.thumb !== undefined) imagem(m.thumb);
    if (Array.isArray(m.gallery)) {
      for (const item of m.gallery as { src?: unknown; alt?: unknown }[]) {
        imagem(item.src);
        if (typeof item.alt !== "string" || !item.alt.trim()) falha(`alt vazio na galeria: ${String(item.src)}`);
      }
    }
    if (typeof m.order === "number") {
      if (ordens.has(m.order)) falha(`order ${m.order} repetido (também em ${ordens.get(m.order)})`);
      else ordens.set(m.order, fileSlug);
    }
  }

  if (erros.length) throw new Error(`Cases inválidos:\n${erros.join("\n")}`);
  return entries.map((e) => e.meta as ProjectMeta);
}
