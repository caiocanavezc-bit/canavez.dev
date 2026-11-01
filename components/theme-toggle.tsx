"use client";

import { useSyncExternalStore } from "react";
import { CHAVE_TEMA } from "@/lib/theme-script";

type Tema = "light" | "dark";

const escuroNoSistema = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function temaAtual(): Tema {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark") return t;
  return escuroNoSistema() ? "dark" : "light";
}

// Acompanha o atributo data-theme do <html> e a preferência do sistema.
function assinar(aviso: () => void) {
  const obs = new MutationObserver(aviso);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", aviso);
  return () => {
    obs.disconnect();
    mq.removeEventListener("change", aviso);
  };
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
