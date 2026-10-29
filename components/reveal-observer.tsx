"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Um único observer para a página: marca [data-reveal] com data-revealed quando entra na tela.
// O CSS só esconde os elementos quando <html> tem a classe "js" (posta no <head>),
// então sem JavaScript tudo aparece normalmente.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pendentes = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not([data-revealed])",
    );
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          obs.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    pendentes.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pathname]);

  return null;
}
