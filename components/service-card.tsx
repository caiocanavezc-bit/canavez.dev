import { ArrowRight, Globe, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Servico } from "@/content/perfil";

const ICONES = { "layout-dashboard": LayoutDashboard, globe: Globe };

// atrasoMs: posição na cascata de revelação da seção.
export function ServiceCard({
  servico,
  atrasoMs = 0,
}: {
  servico: Servico;
  atrasoMs?: number;
}) {
  const Icone = ICONES[servico.icon];
  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${atrasoMs}ms` } as CSSProperties}
      className="flex flex-col rounded-2xl border border-border p-6"
    >
      <Icone
        aria-hidden="true"
        className="size-6 text-text"
        strokeWidth={1.75}
      />
      <h3 className="mt-5 text-lg font-semibold text-text">{servico.titulo}</h3>
      <p className="mt-2 flex-1 text-[15px] leading-[1.6] text-muted">
        {servico.texto}
      </p>
      <Link
        href={`/projetos/${servico.exemploSlug}`}
        className="group mt-6 inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-medium text-accent"
      >
        Ver exemplo
        <ArrowRight
          aria-hidden="true"
          className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
        />
      </Link>
    </article>
  );
}
