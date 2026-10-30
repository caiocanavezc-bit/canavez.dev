"use client";

import { type RefObject, useEffect, useState } from "react";
import { countUpValue } from "./count-up";

/**
 * Conta de 0 até o alvo quando o elemento entra na tela.
 * O HTML do servidor já traz o valor final; se o elemento estiver visível no carregamento
 * ou o usuário preferir movimento reduzido, nada se move (sem animar no mount).
 */
export function useCountUp(
  target: number,
  ref: RefObject<HTMLElement | null>,
  durationMs = 900,
): number {
  const [valor, setValor] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;

    let frame = 0;
    setValor(0);
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        obs.disconnect();
        const inicio = performance.now();
        const passo = (agora: number) => {
          const p = (agora - inicio) / durationMs;
          setValor(countUpValue(p, target));
          if (p < 1) frame = requestAnimationFrame(passo);
        };
        frame = requestAnimationFrame(passo);
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(frame);
      setValor(target);
    };
  }, [target, ref, durationMs]);

  return valor;
}
