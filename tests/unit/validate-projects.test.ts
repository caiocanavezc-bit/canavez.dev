import path from "node:path";
import { describe, expect, test } from "vitest";
import { validateProjects } from "@/lib/validate-projects";

const PUBLIC = path.resolve("public");

const base = {
  slug: "aeb-transporte",
  title: "AEB Transporte",
  subtitle: "Chamada e embarque",
  year: 2026,
  role: "Desenvolvimento full-stack",
  kind: "sistema",
  stack: ["Python"],
  cover: "/projetos/aeb-transporte/capa.webp",
  thumb: "/projetos/aeb-transporte/thumb.webp",
  gallery: [
    {
      src: "/projetos/aeb-transporte/chamada.webp",
      alt: "Chamada com dados fictícios",
      width: 1440,
      height: 1400,
    },
  ],
  order: 1,
  published: true,
};

const um = (meta: Record<string, unknown>, fileSlug = "aeb-transporte") => [
  { fileSlug, meta },
];
const erroDe = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    return (e as Error).message;
  }
  throw new Error("esperava erro");
};

describe("validateProjects", () => {
  test("meta válido passa", () => {
    expect(validateProjects(um(base), PUBLIC)).toHaveLength(1);
  });

  test("campo obrigatório ausente", () => {
    const semTitulo: Partial<typeof base> = { ...base };
    delete semTitulo.title;
    expect(erroDe(() => validateProjects(um(semTitulo), PUBLIC))).toContain(
      "aeb-transporte: campo obrigatório ausente: title",
    );
  });

  test("slug diferente do arquivo", () => {
    expect(
      erroDe(() => validateProjects(um({ ...base, slug: "outro" }), PUBLIC)),
    ).toContain('slug "outro" difere do arquivo');
  });

  test("capa inexistente", () => {
    expect(
      erroDe(() =>
        validateProjects(
          um({ ...base, cover: "/projetos/x/nao-existe.webp" }),
          PUBLIC,
        ),
      ),
    ).toContain("imagem não encontrada: /projetos/x/nao-existe.webp");
  });

  test("order repetido", () => {
    const entradas = [
      { fileSlug: "aeb-transporte", meta: base },
      { fileSlug: "bc-consultoria", meta: { ...base, slug: "bc-consultoria" } },
    ];
    expect(erroDe(() => validateProjects(entradas, PUBLIC))).toContain(
      "order 1 repetido",
    );
  });

  test("kind inválido", () => {
    expect(
      erroDe(() => validateProjects(um({ ...base, kind: "app" }), PUBLIC)),
    ).toContain("kind inválido");
  });

  test("imagem da galeria inexistente", () => {
    const gallery = [
      { src: "/projetos/x/falta.webp", alt: "x", width: 10, height: 10 },
    ];
    expect(
      erroDe(() => validateProjects(um({ ...base, gallery }), PUBLIC)),
    ).toContain("imagem não encontrada: /projetos/x/falta.webp");
  });

  test("alt vazio na galeria", () => {
    const gallery = [
      {
        src: "/projetos/aeb-transporte/chamada.webp",
        alt: "",
        width: 10,
        height: 10,
      },
    ];
    expect(
      erroDe(() => validateProjects(um({ ...base, gallery }), PUBLIC)),
    ).toContain("alt vazio");
  });

  test("galeria sem dimensões", () => {
    const gallery = [
      { src: "/projetos/aeb-transporte/chamada.webp", alt: "Chamada" },
    ];
    expect(
      erroDe(() => validateProjects(um({ ...base, gallery }), PUBLIC)),
    ).toContain(
      "dimensões inválidas na galeria: /projetos/aeb-transporte/chamada.webp",
    );
  });

  test("lista todos os problemas juntos", () => {
    const msg = erroDe(() =>
      validateProjects(um({ ...base, kind: "app", cover: "/x.webp" }), PUBLIC),
    );
    expect(msg).toContain("kind inválido");
    expect(msg).toContain("imagem não encontrada: /x.webp");
  });
});
