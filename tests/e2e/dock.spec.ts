import { expect, test } from "@playwright/test";

const dock = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Navegação principal" });

test("dock leva à seção de projetos", async ({ page }) => {
  await page.goto("/");
  await dock(page).getByRole("link", { name: "Projetos" }).click();
  await expect(page).toHaveURL(/#projetos$/);
  await expect(page.locator("#projetos")).toBeInViewport();
});

test("item da seção visível fica marcado", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await expect(
    dock(page).getByRole("link", { name: "Contato" }),
  ).toHaveAttribute("aria-current", "true");
});

test("no case, Contato leva ao contato da home", async ({ page }) => {
  await page.goto("/projetos/aeb-transporte");
  await dock(page).getByRole("link", { name: "Contato" }).click();
  await expect(page).toHaveURL(/\/#contato$/);
  await expect(page.locator("#contato")).toBeInViewport();
});

test("dock continua visível depois de rolar", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 2000));
  await expect(dock(page)).toBeInViewport();
});

test("itens do dock têm área de toque de 44px", async ({ page }) => {
  await page.goto("/");
  const links = await dock(page).getByRole("link").all();
  expect(links.length).toBeGreaterThan(0);
  for (const link of links) {
    const caixa = await link.boundingBox();
    expect(caixa!.width).toBeGreaterThanOrEqual(44);
    expect(caixa!.height).toBeGreaterThanOrEqual(44);
  }
});
