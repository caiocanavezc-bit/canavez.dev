import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";

export function ProjectList({ projects }: { projects: ProjectMeta[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/projetos/${p.slug}`}
            className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-5 hover:bg-surface motion-safe:transition-colors"
          >
            <span className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border border-border sm:w-[120px]">
              <Image
                src={p.thumb}
                alt=""
                fill
                sizes="120px"
                className="object-cover object-top motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-[1.03]"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-semibold text-text">{p.title}</span>
              <span className="mt-0.5 block text-[15px] leading-snug text-muted">{p.subtitle}</span>
              <span className="mt-1.5 block font-mono text-[13px] text-muted">{p.year}</span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-5 shrink-0 text-muted motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 group-hover:text-text"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
