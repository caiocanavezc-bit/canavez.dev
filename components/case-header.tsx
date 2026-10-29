import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";

export function CaseHeader({ meta }: { meta: ProjectMeta }) {
  return (
    <header>
      <Link
        href="/#projetos"
        className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[15px] text-muted hover:text-text"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Voltar
      </Link>
      <h1 className="mt-6 text-[clamp(36px,9cqi,64px)] font-bold leading-[0.95] tracking-[-0.03em] text-text">
        {meta.title}
      </h1>
      <p className="mt-4 max-w-[62ch] text-[19px] leading-[1.5] text-muted">{meta.subtitle}</p>
      <p className="mt-5 text-[15px] text-muted">
        <span className="font-mono">{meta.year}</span>
        <span className="mx-2 text-border" aria-hidden="true">
          /
        </span>
        {meta.role}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tecnologias">
        {meta.stack.map((t) => (
          <li key={t} className="rounded-full border border-border px-3 py-1 font-mono text-[13px] text-text">
            {t}
          </li>
        ))}
      </ul>
      {meta.liveUrl && (
        <a
          href={meta.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-button px-5 text-[15px] font-semibold text-button-text hover:bg-white"
        >
          Ver online
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      )}
    </header>
  );
}
