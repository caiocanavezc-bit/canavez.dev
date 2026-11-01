import { expect, type Page, test } from "@playwright/test";
import { abrirNav, nav } from "./helpers";

// Destino real da rolagem: topo da seção menos a margem de rolagem, limitado ao fim da página.
const destino = (page: Page, seletor: string) =>
  page.locator(seletor).evaluate((el) =>
    Math.min(
      el.getBoundingClientRect().top +
        window.scrollY -
        (parseFloat(getComputedStyle(el).scrollMarginTop) || 0),
      document.documentElement.scrollHeight - window.innerHeight,
    ),
  );

test("clicar na navegação desce suavemente até a seção", async ({ page }) => {
  await page.goto("/");
  const alvo = await destino(page, "#contato");
  await abrirNav(page);
  await nav(page).getByRole("link", { name: "contato" }).click();
  await page.waitForTimeout(350);
  const noMeio = await page.evaluate(() => window.scrollY);
  // ainda descendo: já saiu do topo, mas não chegou
  expect(noMeio).toBeGreaterThan(0);
  expect(noMeio).toBeLessThan(alvo - 20);
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 })
    .toBeGreaterThan(alvo - 5);
  await expect(page).toHaveURL(/#contato$/);
});

test("pelo teclado o salto é imediato", async ({ page }) => {
  await page.goto("/");
  await abrirNav(page);
  const link = nav(page).getByRole("link", { name: "contato" });
  await link.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(120);
  const y = await page.evaluate(() => window.scrollY);
  expect(Math.abs(y - (await destino(page, "#contato")))).toBeLessThan(40);
});

test("itens da linha do tempo entram em cascata", async ({ page }) => {
  await page.goto("/");
  const atrasos = await page
    .locator("#experiencia li")
    .evaluateAll((els) =>
      els.map((el) =>
        getComputedStyle(el).getPropertyValue("--reveal-delay").trim(),
      ),
    );
  expect(atrasos).toEqual(["70ms", "140ms", "210ms"]);
});

test("revelação é discreta: só sobe 8px e aparece, sem desfoque", async ({
  page,
}) => {
  await page.goto("/");
  const estilo = await page
    .locator("#contato [data-reveal]")
    .first()
    .evaluate((el) => {
      const s = getComputedStyle(el);
      return { filter: s.filter, transform: s.transform };
    });
  expect(estilo.filter).toBe("none");
  expect(estilo.transform).toContain("8");
});

test.describe("com 'reduzir movimento' ligado no sistema", () => {
  test.use({ reducedMotion: "reduce" });

  // O clique no menu desce suave mesmo com a preferência ligada
  // (comum no Windows com "Efeitos de animação" desligado).
  test("clicar na navegação ainda desce suavemente", async ({ page }) => {
    await page.goto("/");
    await abrirNav(page);
    await nav(page).getByRole("link", { name: "projetos" }).click();
    await page.waitForTimeout(350);
    const noMeio = await page.evaluate(() => window.scrollY);
    const alvo = await destino(page, "#projetos");
    expect(noMeio).toBeGreaterThan(0);
    expect(noMeio).toBeLessThan(alvo - 120);
  });
});
