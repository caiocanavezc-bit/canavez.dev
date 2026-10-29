import { expect, type Page, test } from "@playwright/test";

const semRolagemHorizontal = (page: Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth <=
      document.documentElement.clientWidth,
  );

test("lista da home abre o case do AEB", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("#projetos")
    .getByRole("link", { name: /AEB Transporte/ })
    .click();
  await expect(page).toHaveURL(/\/projetos\/aeb-transporte$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "AEB Transporte",
  );
  for (const titulo of ["Problema", "Solução", "Destaques", "Resultado"]) {
    await expect(
      page.getByRole("heading", { level: 2, name: titulo }),
    ).toBeVisible();
  }
});

test("case sem liveUrl não mostra Ver online", async ({ page }) => {
  await page.goto("/projetos/bc-consultoria");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Bergamo & Canavez",
  );
  await expect(page.getByRole("link", { name: "Ver online" })).toHaveCount(0);
});

test("próximo case volta ao primeiro", async ({ page }) => {
  await page.goto("/projetos/bc-consultoria");
  await expect(
    page.getByRole("link", { name: /Próximo case/ }),
  ).toHaveAttribute("href", "/projetos/aeb-transporte");
});

test("slug inexistente mostra 404", async ({ page }) => {
  const resp = await page.goto("/projetos/nao-existe");
  expect(resp?.status()).toBe(404);
  await expect(page.getByText("Página não encontrada")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Ir para o início" }),
  ).toHaveAttribute("href", "/");
  await expect(
    page.getByRole("link", { name: "Ver projetos" }),
  ).toHaveAttribute("href", "/#projetos");
});

for (const slug of ["aeb-transporte", "bc-consultoria"]) {
  test(`case ${slug} sem rolagem horizontal em 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(`/projetos/${slug}`);
    expect(await semRolagemHorizontal(page)).toBe(true);
  });
}
