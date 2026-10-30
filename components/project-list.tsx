import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, ViewTransition } from "react";
import type { ProjectMeta } from "@/lib/projects";

const ENTRADA = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function ProjectList({ projects }: { projects: ProjectMeta[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {projects.map((p, i) => (
        <li
          key={p.slug}
          data-reveal
          style={
            {
              "--reveal-delay": `${(Math.min(i, 3) + 1) * 55}ms`,
            } as CSSProperties
          }
        >
          <Link
            href={`/projetos/${p.slug}`}
            data-brilho
            className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-5 hover:bg-surface motion-safe:transition-colors motion-safe:duration-200"
          >
            <ViewTransition name={`capa-${p.slug}`} share="capa" default="none">
              <span className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border border-border sm:w-[120px]">
                <Image
                  src={p.thumb}
                  alt=""
                  fill
                  sizes="120px"
                  className={`object-cover object-top motion-safe:transition-transform motion-safe:duration-150 ${ENTRADA} motion-safe:group-hover:scale-[1.03]`}
                />
              </span>
            </ViewTransition>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-semibold text-text">
                {p.title}
              </span>
              <span className="mt-0.5 block text-[15px] leading-snug text-muted group-hover:text-[#8B98A5]">
                {p.subtitle}
              </span>
              <span className="mt-1.5 block font-mono text-[13px] text-muted group-hover:text-[#8B98A5]">
                {p.year}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className={`size-5 shrink-0 text-muted group-hover:text-text motion-safe:transition-[translate,color] motion-safe:duration-150 ${ENTRADA} motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1`}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
