import path from "node:path";
import type { ComponentType } from "react";
import * as aebTransporte from "@/content/projetos/aeb-transporte.mdx";
import * as bcConsultoria from "@/content/projetos/bc-consultoria.mdx";
import { type ProjectMeta, validateProjects } from "@/lib/validate-projects";

export type { ProjectMeta };

type MdxModule = { default: ComponentType; meta: unknown };

// Registro explícito: um case novo entra aqui e em content/projetos/<slug>.mdx.
const registro: { fileSlug: string; mod: MdxModule }[] = [
  { fileSlug: "aeb-transporte", mod: aebTransporte },
  { fileSlug: "bc-consultoria", mod: bcConsultoria },
];

export const registeredSlugs = registro.map((r) => r.fileSlug);

// Roda no carregamento do módulo, ou seja, no build: um case inválido derruba o build.
const metas = validateProjects(
  registro.map((r) => ({ fileSlug: r.fileSlug, meta: r.mod.meta })),
  path.join(process.cwd(), "public"),
);

const publicados = metas.filter((m) => m.published).sort((a, b) => a.order - b.order);

export function getProjects(): ProjectMeta[] {
  return publicados;
}

export function getProject(slug: string): { meta: ProjectMeta; Content: ComponentType } | null {
  const meta = publicados.find((m) => m.slug === slug);
  if (!meta) return null;
  return { meta, Content: registro.find((r) => r.fileSlug === slug)!.mod.default };
}

export function getAdjacentProject(slug: string): ProjectMeta {
  const i = publicados.findIndex((m) => m.slug === slug);
  return publicados[(i + 1) % publicados.length];
}
