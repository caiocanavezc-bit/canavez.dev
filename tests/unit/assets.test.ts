import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, test } from "vitest";

const arquivos = [
  "perfil/avatar.webp",
  ...["capa", "thumb", "chamada", "rotas", "celular", "pdf"].map((n) => `projetos/aeb-transporte/${n}.webp`),
  ...["capa", "thumb", "servicos", "celular"].map((n) => `projetos/bc-consultoria/${n}.webp`),
];

const tamanho = async (p: string) => {
  const { width, height } = await sharp(path.join("public", p)).metadata();
  return [width, height];
};

describe("imagens do site", () => {
  test.each(arquivos)("%s existe", (p) => {
    expect(fs.existsSync(path.join("public", p))).toBe(true);
  });

  test("avatar 512×512", async () => {
    expect(await tamanho("perfil/avatar.webp")).toEqual([512, 512]);
  });

  test.each(["aeb-transporte", "bc-consultoria"])("capa 1600×1000 e thumb 640×400 de %s", async (slug) => {
    expect(await tamanho(`projetos/${slug}/capa.webp`)).toEqual([1600, 1000]);
    expect(await tamanho(`projetos/${slug}/thumb.webp`)).toEqual([640, 400]);
  });
});
