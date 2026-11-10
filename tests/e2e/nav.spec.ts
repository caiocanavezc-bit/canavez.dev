import { expect, test } from "@playwright/test";
import { abrirNav, nav } from "./helpers";

test("navegação leva à seção de projetos", async ({ page }) => {
  await page.goto("/");
  await abrirNav(page);
  await nav(page).getByRole("link", { name: "projetos" }).click();
  await expect(page).toHaveURL(/#projetos$/);
  await expect(page.locator("#projetos")).toBeInViewport();
});

test("item da seção visível fica marcado", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await abrirNav(page);
  await expect(
    nav(page).getByRole("link", { name: "contato" }),
  ).toHaveAttribute("aria-current", "true");
});

test("no topo, sobre fica marcado e leva de volta ao topo", async ({ page }) => {
  await page.goto("/");
  await abrirNav(page);
  const sobre = nav(page).getByRole("link", { name: "sobre" });
  await expect(sobre).toHaveAttribute("aria-current", "true");
  await page.keyboard.press("Escape");
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await abrirNav(page);
  await sobre.click();
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 })
    .toBeLessThan(5);
});

test("no case, projetos fica marcado e contato leva ao contato da home", async ({
  page,
}) => {
  await page.goto("/projetos/aeb-transporte");
  await abrirNav(page);
  await expect(
    nav(page).getByRole("link", { name: "projetos" }),
  ).toHaveAttribute("aria-current", "page");
  await nav(page).getByRole("link", { name: "contato" }).click();
  await expect(page).toHaveURL(/\/#contato$/);
  await expect(page.locator("#contato")).toBeInViewport();
});

test.describe("no celular", () => {
  test.skip(({ isMobile }) => !isMobile, "menu só no celular");

  test("menu abre, fecha e tem área de toque de 44px", async ({ page }) => {
    await page.goto("/");
    await expect(nav(page)).toBeHidden();
    const menu = page.getByRole("button", { name: "menu", exact: true });
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await menu.click();
    await expect(nav(page)).toBeVisible();
    for (const link of await nav(page).getByRole("link").all()) {
      const caixa = await link.boundingBox();
      expect(caixa!.height).toBeGreaterThanOrEqual(44);
      // o item está mesmo na frente, não cortado pela barra do topo nem coberto pelo conteúdo
      const naFrente = await link.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return document
          .elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
          ?.closest("a") === el;
      });
      expect(naFrente).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(nav(page)).toBeHidden();
  });

  test("clicar numa seção fecha o menu", async ({ page }) => {
    await page.goto("/");
    await abrirNav(page);
    await nav(page).getByRole("link", { name: "serviços" }).click();
    await expect(nav(page)).toBeHidden();
    await expect(page).toHaveURL(/#servicos$/);
  });
});

test("foto de perfil aparece na barra, também no celular", async ({ page }) => {
  await page.goto("/");
  const foto = page.getByTestId("barra-lateral").locator(".cv-avatar");
  await expect(foto).toBeVisible();
  await expect(foto).toBeInViewport();
});
