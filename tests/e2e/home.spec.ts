import { expect, test } from "@playwright/test";
import { semRolagemHorizontal } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("título principal e texto de apresentação", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("sobre mim");
  await expect(page.locator("#sobre")).toContainText(
    "estagiário de TI na Prefeitura de Batatais",
  );
});

test("barra lateral com nome e papel", async ({ page }, info) => {
  const barra = page.getByTestId("barra-lateral");
  await expect(barra.getByText("Caio Canavez")).toBeVisible();
  // no celular o papel some para a barra caber no topo
  if (info.project.name === "desktop")
    await expect(barra.getByText("desenvolvedor full-stack")).toBeVisible();
});

test("linha do tempo com o trabalho atual", async ({ page }) => {
  const atual = page.locator("#experiencia li[data-status=atual]").first();
  await expect(atual).toContainText("Estagiário de TI");
  await expect(atual).toContainText("Prefeitura Municipal de Batatais");
});

test("seção de serviços aponta para os cases", async ({ page }) => {
  const servicos = page.locator("#servicos");
  await expect(
    servicos.getByRole("link", { name: /Sistemas web sob medida/ }),
  ).toHaveAttribute("href", "/projetos/aeb-transporte");
  await expect(
    servicos.getByRole("link", { name: /Sites institucionais/ }),
  ).toHaveAttribute("href", "/projetos/bc-consultoria");
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
  await expect(
    contato.getByRole("link", { name: "Instagram" }),
  ).toHaveAttribute("href", "https://www.instagram.com/canavezz/");
});

test("pílula de disponibilidade leva ao WhatsApp", async ({ page }) => {
  const selo = page.getByTestId("selo-disponivel");
  await expect(selo).toContainText("disponível para projetos");
  await expect(selo).toBeInViewport();
  await expect(selo).toHaveAttribute("href", /^https:\/\/wa\.me\//);
});

test("métricas", async ({ page }) => {
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

test("barra lateral fica visível ao rolar", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 1500));
  await expect(page.getByTestId("barra-lateral")).toBeInViewport();
});
