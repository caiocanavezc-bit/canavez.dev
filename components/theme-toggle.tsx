"use client";

import { useSyncExternalStore } from "react";
import { CHAVE_TEMA } from "@/lib/theme-script";

type Tema = "light" | "dark";

// Sem escolha salva o site é escuro, qualquer que seja o tema do sistema.
function temaAtual(): Tema {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

// Acompanha o atributo data-theme do <html>.
function assinar(aviso: () => void) {
  const obs = new MutationObserver(aviso);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => obs.disconnect();
}

export function ThemeToggle() {
  const tema = useSyncExternalStore<Tema | null>(assinar, temaAtual, () => null);
  const proximo: Tema = tema === "dark" ? "light" : "dark";
  const nome = proximo === "dark" ? "escuro" : "claro";

  return (
    <button
      type="button"
      className="cv-btn cv-toggle"
      aria-label={`mudar para o tema ${nome}`}
      // antes da hidratação o tema ainda é desconhecido: o botão aparece sem rótulo trocado
      suppressHydrationWarning
      onClick={() => {
        document.documentElement.dataset.theme = proximo;
        try {
          localStorage.setItem(CHAVE_TEMA, proximo);
        } catch {
          // navegação privada sem armazenamento: o tema vale só nesta visita
        }
      }}
    >
      <span className="cv-toggle-glyph" aria-hidden="true" />
      <span>{tema === null ? "tema" : nome}</span>
    </button>
  );
}
