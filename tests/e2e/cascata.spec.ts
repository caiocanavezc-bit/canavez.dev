import { expect, test } from "@playwright/test";

const dock = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Navegação principal" });

test("clicar no dock desce suavemente até a seção", async ({ page }) => {
  await page.goto("/");
  const destino = await page.locator("#contato").evaluate((el) =>
    // limitado à rolagem máxima: o Contato fica no fim da página
    Math.min(
      el.getBoundingClientRect().top + window.scrollY - 96,
      document.documentElement.scrollHeight - window.innerHeight,
    ),
  );
  await dock(page).getByRole("link", { name: "Contato" }).click();
  await page.waitForTimeout(350);
  const noMeio = await page.evaluate(() => window.scrollY);
  // ainda descendo: já saiu do topo, mas não chegou
  expect(noMeio).toBeGreaterThan(0);
  expect(noMeio).toBeLessThan(destino - 20);
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 })
    .toBeGreaterThan(destino - 5);
  await expect(page).toHaveURL(/#contato$/);
});

test("pelo teclado o salto é imediato", async ({ page }) => {
  await page.goto("/");
  const link = dock(page).getByRole("link", { name: "Contato" });
  await link.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(120);
  const y = await page.evaluate(() => window.scrollY);
  const destino = await page.locator("#contato").evaluate((el) =>
    // limitado à rolagem máxima: o Contato fica no fim da página
    Math.min(
      el.getBoundingClientRect().top + window.scrollY - 96,
      document.documentElement.scrollHeight - window.innerHeight,
    ),
  );
  expect(Math.abs(y - destino)).toBeLessThan(40);
});

test("cards de serviço entram em cascata", async ({ page }) => {
  await page.goto("/");
  const atrasos = await page
    .locator("#servicos article")
    .evaluateAll((els) =>
      els.map((el) =>
        getComputedStyle(el).getPropertyValue("--reveal-delay").trim(),
      ),
    );
  expect(atrasos).toEqual(["85ms", "170ms"]);
});

test("revelação usa subida com desfoque leve, como no site da BC", async ({
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
  expect(estilo.filter).toContain("blur(3px)");
  expect(estilo.transform).toContain("14");
});

test.describe("com 'reduzir movimento' ligado no sistema", () => {
  test.use({ reducedMotion: "reduce" });

  // Igual ao site da BC: o clique no menu desce suave mesmo com a preferência ligada
  // (comum no Windows com "Efeitos de animação" desligado).
  test("clicar no dock ainda desce suavemente", async ({ page }) => {
    await page.goto("/");
    await dock(page).getByRole("link", { name: "Projetos" }).click();
    await page.waitForTimeout(350);
    const noMeio = await page.evaluate(() => window.scrollY);
    const destino = await page
      .locator("#projetos")
      .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    expect(noMeio).toBeGreaterThan(0);
    expect(noMeio).toBeLessThan(destino - 120);
  });
});
