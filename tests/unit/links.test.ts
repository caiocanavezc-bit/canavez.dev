import { describe, expect, test } from "vitest";
import { mailtoUrl, whatsappUrl } from "@/lib/links";

describe("whatsappUrl", () => {
  test("monta o link wa.me com a mensagem codificada", () => {
    expect(
      whatsappUrl(
        "5516992647064",
        "Olá, Caio! Vi seu portfólio e quero conversar sobre um projeto.",
      ),
    ).toBe(
      "https://wa.me/5516992647064?text=Ol%C3%A1%2C%20Caio!%20Vi%20seu%20portf%C3%B3lio%20e%20quero%20conversar%20sobre%20um%20projeto.",
    );
  });
});

describe("mailtoUrl", () => {
  test("monta o mailto com o assunto codificado", () => {
    expect(mailtoUrl("caiocanavezc@gmail.com", "Contato pelo portfólio")).toBe(
      "mailto:caiocanavezc@gmail.com?subject=Contato%20pelo%20portf%C3%B3lio",
    );
  });
});
