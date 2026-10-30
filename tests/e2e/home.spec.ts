import { expect, type Page, test } from "@playwright/test";

const semRolagemHorizontal = (page: Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth <=
      document.documentElement.clientWidth,
  );

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("hero com título em duas linhas", async ({ page }) => {
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toContainText("Desenvolvedor");
  await expect(h1).toContainText("full-stack");
});

test("cartão de perfil com nome e ocupação atual", async ({ page }) => {
  await expect(page.getByText("Caio Canavez").first()).toBeVisible();
  await expect(
    page.getByText("Estagiário de TI · Prefeitura de Batatais"),
  ).toBeVisible();
});

test("seção de serviços", async ({ page }) => {
  const servicos = page.locator("#servicos");
  await expect(servicos).toContainText("Sistemas web sob medida");
  await expect(servicos).toContainText("Sites institucionais");
});

test("links de contato", async ({ page }) => {
  const contato = page.locator("#contato");
  await expect(contato.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/5516992647064\?text=/,
  );
  await expect(contato.getByRole("link", { name: "E-mail" })).toHaveAttribute(
    "href",
    /^mailto:caiocanavezc@gmail\.com/,
  );
});

test("métricas", async ({ page }) => {
  // No celular as métricas ficam abaixo da dobra e só contam até o valor final ao entrar na tela.
  await page.getByText("sistemas entregues").scrollIntoViewIfNeeded();
  await expect(page.getByText("+10", { exact: true })).toBeVisible();
  await expect(page.getByText("1 ano", { exact: true })).toBeVisible();
});

test("primeiro Tab foca o link de pular para o conteúdo", async ({ page }) => {
  await page.keyboard.press("Tab");
  const pular = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(pular).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#conteudo$/);
});

for (const viewport of [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
]) {
  test(`sem rolagem horizontal em ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    expect(await semRolagemHorizontal(page)).toBe(true);
  });
}

test("cartão fica fixo ao rolar no desktop", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "sticky só no desktop");
  await page.evaluate(() => window.scrollTo(0, 1500));
  await expect(page.getByTestId("profile-card")).toBeInViewport();
});
