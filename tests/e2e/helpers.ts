import type { Page } from "@playwright/test";

export const nav = (page: Page) =>
  page.getByRole("navigation", { name: "Navegação principal" });

/** No celular a navegação fica atrás do botão "menu"; no computador já está aberta. */
export async function abrirNav(page: Page) {
  const menu = page.getByRole("button", { name: "menu", exact: true });
  if (await menu.isVisible()) await menu.click();
}

export const semRolagemHorizontal = (page: Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth <=
      document.documentElement.clientWidth,
  );
