import { expect, type Page, test } from "@playwright/test";

// Achados de revisão: cada teste reproduz um problema real antes da correção.

const opacidades = (page: Page, secao: string) =>
  page
    .locator(`${secao} [data-reveal]`)
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));

test("se o JavaScript do site não carregar, nada fica invisível", async ({
  page,
}) => {
  await page.route("**/_next/static/chunks/**/*.js", (r) => r.abort());
  await page.goto("/");
  for (const secao of ["#contato", "#servicos"]) {
    await page.locator(secao).scrollIntoViewIfNeeded();
    await expect
      .poll(async () => (await opacidades(page, secao)).every((o) => o === "1"), {
        timeout: 6000,
      })
      .toBe(true);
  }
});

test("pular para o conteúdo move o foco", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator("main#conteudo").first()).toBeFocused();
});

test("texto cinza mantém contraste AA no item da lista em hover", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "hover só com mouse");
  await page.goto("/");
  const link = page.locator("#servicos .cv-link").first();
  await link.scrollIntoViewIfNeeded();
  await link.hover();
  await page.waitForTimeout(300);
  const razao = await link.evaluate((a) => {
    const lum = (rgb: string) => {
      const [r, g, b] = rgb
        .match(/\d+/g)!
        .slice(0, 3)
        .map(Number)
        .map((c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const fundo = getComputedStyle(document.body).backgroundColor;
    const textos = [...a.querySelectorAll(".cv-link-title, .cv-link-desc")].map(
      (s) => getComputedStyle(s).color,
    );
    return Math.min(
      ...textos
        .map((t) => (lum(t) + 0.05) / (lum(fundo) + 0.05))
        .map((x) => (x < 1 ? 1 / x : x)),
    );
  });
  expect(razao).toBeGreaterThanOrEqual(4.5);
});
