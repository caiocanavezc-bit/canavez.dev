"use client";

import { ArrowLeft, Briefcase, FolderOpen, Home, type LucideIcon, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { href: string; label: string; icon: LucideIcon; secao?: string };

function itens(variant: "home" | "case", hasProjects: boolean): Item[] {
  if (variant === "case") {
    return [
      { href: "/#projetos", label: "Voltar", icon: ArrowLeft },
      { href: "/#contato", label: "Contato", icon: Send },
    ];
  }
  return [
    { href: "#inicio", label: "Início", icon: Home, secao: "inicio" },
    { href: "#servicos", label: "Serviços", icon: Briefcase, secao: "servicos" },
    ...(hasProjects ? [{ href: "#projetos", label: "Projetos", icon: FolderOpen, secao: "projetos" }] : []),
    { href: "#contato", label: "Contato", icon: Send, secao: "contato" },
  ];
}

// Marca a seção que ocupa a faixa central da tela; no fim da página, a última seção
// (curta demais para chegar ao centro).
function useSecaoAtiva(ids: string[]) {
  const [ativa, setAtiva] = useState<string | null>(null);
  const chave = ids.join(",");
  useEffect(() => {
    const alvos = chave
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!alvos.length) return;
    const naFaixa = new Set<string>();
    // Uma única regra para os dois gatilhos: no fim da página vence a última seção;
    // senão, a última seção (na ordem da página) que cruza a faixa central.
    const atualizar = () => {
      const fim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (fim) return setAtiva(alvos[alvos.length - 1].id);
      const atual = alvos.findLast((el) => naFaixa.has(el.id));
      if (atual) setAtiva(atual.id);
    };
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) naFaixa.add(e.target.id);
          else naFaixa.delete(e.target.id);
        }
        atualizar();
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    alvos.forEach((el) => obs.observe(el));
    window.addEventListener("scroll", atualizar, { passive: true });
    atualizar();
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", atualizar);
    };
  }, [chave]);
  return ativa;
}

export function Dock({ variant, hasProjects = true }: { variant: "home" | "case"; hasProjects?: boolean }) {
  const lista = itens(variant, hasProjects);
  const ativa = useSecaoAtiva(lista.flatMap((i) => (i.secao ? [i.secao] : [])));

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-surface/80 px-1.5 py-1 backdrop-blur-md"
    >
      <ul className="flex items-center gap-0.5">
        {lista.map(({ href, label, icon: Icone, secao }) => {
          const atual = secao !== undefined && secao === ativa;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                aria-current={atual ? "true" : undefined}
                title={label}
                className={`grid size-11 place-items-center rounded-full hover:bg-white/5 hover:text-text motion-safe:transition-colors ${
                  atual ? "text-text" : "text-muted"
                }`}
              >
                <Icone aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
