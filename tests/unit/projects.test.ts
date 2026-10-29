import fs from "node:fs";
import { expect, test } from "vitest";
import { getAdjacentProject, getProject, getProjects, registeredSlugs } from "@/lib/projects";

test("cases publicados em ordem", () => {
  expect(getProjects().map((p) => p.slug)).toEqual(["aeb-transporte", "bc-consultoria"]);
});

test("slug inexistente devolve null", () => {
  expect(getProject("nao-existe")).toBeNull();
});

test("próximo case volta ao primeiro depois do último", () => {
  expect(getAdjacentProject("bc-consultoria").slug).toBe("aeb-transporte");
  expect(getAdjacentProject("aeb-transporte").slug).toBe("bc-consultoria");
});

test("todo MDX da pasta está registrado", () => {
  const arquivos = fs
    .readdirSync("content/projetos")
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
  expect([...registeredSlugs].sort()).toEqual(arquivos);
});

test("lista de slugs do proxy acompanha os cases publicados", async () => {
  const { PUBLISHED_SLUGS } = await import("@/lib/project-slugs");
  expect([...PUBLISHED_SLUGS]).toEqual(getProjects().map((p) => p.slug));
});
