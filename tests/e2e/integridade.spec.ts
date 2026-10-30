import { expect, type Page, test } from "@playwright/test";

const PAGINAS = ["/", "/projetos/aeb-transporte", "/projetos/bc-consultoria"];

async function rolarTudo(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForLoadState("networkidle");
  // Imagens lazy disparadas na última rolagem podem ainda estar baixando em máquinas lentas (CI).
  // Uma imagem quebrada também termina "complete" (com naturalWidth 0), então o teste segue pegando-a.
  await page.waitForFunction(
    () => [...document.images].every((i) => i.complete),
    null,
    { timeout: 15_000 },
  );
}

for (const url of PAGINAS) {
  test(`links externos seguros em ${url}`, async ({ page }) => {
    await page.goto(url);
    const rels = await page
      .locator("a[target=_blank]")
      .evaluateAll((as) => as.map((a) => a.getAttribute("rel") ?? ""));
    // A home sempre tem links externos (WhatsApp, LinkedIn, GitHub); os cases só quando há "Ver online".
    if (url === "/") expect(rels.length).toBeGreaterThan(0);
    for (const rel of rels) {
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });

  test(`imagens carregam e têm alt em ${url}`, async ({ page }) => {
    await page.goto(url);
    await rolarTudo(page);
    const imagens = await page.locator("img").evaluateAll((imgs) =>
      (imgs as HTMLImageElement[]).map((i) => ({
        src: i.currentSrc,
        alt: i.getAttribute("alt"),
        // alt="" só é aceito em imagem decorativa dentro de um link que já tem texto
        decorativaComTexto:
          (i.closest("a")?.textContent ?? "").trim().length > 0,
        ok: i.naturalWidth > 0,
      })),
    );
    expect(imagens.length).toBeGreaterThan(0);
    for (const img of imagens) {
      expect(img.alt, `${img.src} sem atributo alt`).not.toBeNull();
      if (img.alt?.trim() === "")
        expect(
          img.decorativaComTexto,
          `${img.src} com alt vazio fora de link com texto`,
        ).toBe(true);
      expect(img.ok, img.src).toBe(true);
    }
  });
}
