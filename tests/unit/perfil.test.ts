import { expect, test } from "vitest";
import { perfil } from "@/content/perfil";

test("toda métrica informa a fonte", () => {
  for (const m of perfil.metricas)
    expect(m.fonte.trim().length).toBeGreaterThan(0);
});

test("bio cabe na descrição de busca", () => {
  expect(perfil.bio.length).toBeLessThanOrEqual(120);
});

test("papel na barra lateral", () => {
  expect(perfil.papel).toBe("desenvolvedor full-stack");
});

test("linha do tempo começa pelo trabalho atual", () => {
  expect(perfil.experiencia[0]).toMatchObject({
    papel: "Estagiário de TI",
    org: "Prefeitura Municipal de Batatais",
    status: "atual",
  });
});

test("cada serviço aponta para o case de exemplo", () => {
  expect(perfil.servicos.map((s) => s.exemploSlug)).toEqual([
    "aeb-transporte",
    "bc-consultoria",
  ]);
});

test("contatos aprovados", () => {
  expect(perfil.contato.whatsapp).toBe("5516992647064");
  expect(perfil.contato.email).toBe("caiocanavezc@gmail.com");
  expect(perfil.contato.instagram).toBe("https://www.instagram.com/canavezz/");
});
