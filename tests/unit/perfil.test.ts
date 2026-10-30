import { expect, test } from "vitest";
import { perfil } from "@/content/perfil";

test("toda métrica informa a fonte", () => {
  for (const m of perfil.metricas)
    expect(m.fonte.trim().length).toBeGreaterThan(0);
});

test("bio cabe no cartão", () => {
  expect(perfil.bio.length).toBeLessThanOrEqual(120);
});

test("título do hero em duas linhas", () => {
  expect(perfil.heroTitulo).toEqual(["Desenvolvedor", "full-stack"]);
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
