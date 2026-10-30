"use client";

import { useEffect } from "react";

// Um único ouvinte para a página: grava a posição do mouse em --mx/--my no card
// [data-brilho] sob o cursor (o desenho do brilho fica no globals.css).
export function Brilho() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const mover = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-brilho]",
      );
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
      card.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
    };
    document.addEventListener("pointermove", mover, { passive: true });
    return () => document.removeEventListener("pointermove", mover);
  }, []);
  return null;
}
