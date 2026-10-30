import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGINAS = [
  "/",
  "/projetos/aeb-transporte",
  "/projetos/bc-consultoria",
  "/projetos/nao-existe",
];

for (const url of PAGINAS) {
  test(`sem violações sérias de acessibilidade em ${url}`, async ({ page }) => {
    await page.goto(url);
    // Rola tudo para que o conteúdo revelado por scroll esteja visível na análise.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForTimeout(600);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const graves = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      );
    expect(graves).toEqual([]);
  });
}
