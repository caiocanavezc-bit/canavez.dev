import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { CaseGallery } from "@/components/case-gallery";
import { CaseHeader } from "@/components/case-header";
import { Dock } from "@/components/dock";
import { getAdjacentProject, getProject, getProjects } from "@/lib/projects";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const projeto = getProject(slug);
  if (!projeto) return {};
  return {
    title: `${projeto.meta.title} · Caio Canavez`,
    description: projeto.meta.subtitle,
    alternates: { canonical: `/projetos/${slug}` },
  };
}

export default async function CasePage({
  params,
}: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const projeto = getProject(slug);
  if (!projeto) notFound();
  const { meta, Content } = projeto;
  const proximo = getAdjacentProject(slug);

  return (
    <>
      <Dock variant="case" />
      <main
        id="conteudo"
        tabIndex={-1}
        className="@container mx-auto max-w-[760px] px-4 pt-24 pb-24 outline-none"
      >
        <CaseHeader meta={meta} />

        <ViewTransition name={`capa-${meta.slug}`} share="capa" default="none">
          <Image
            src={meta.cover}
            alt={`Tela principal do projeto ${meta.title}`}
            width={1600}
            height={1000}
            priority
            sizes="(min-width: 800px) 760px, 100vw"
            className="mt-10 h-auto w-full rounded-2xl border border-border"
          />
        </ViewTransition>

        <article className="mt-6">
          <Content />
        </article>

        <CaseGallery images={meta.gallery} />

        {proximo.slug !== meta.slug && (
          <nav
            aria-label="Outros projetos"
            className="mt-20 border-t border-border pt-10"
          >
            <Link
              href={`/projetos/${proximo.slug}`}
              className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-4 hover:bg-surface motion-safe:transition-colors"
            >
              <span className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg border border-border">
                <Image
                  src={proximo.thumb}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover object-top"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] text-muted">
                  Próximo case
                </span>
                <span className="block text-lg font-semibold text-text">
                  {proximo.title}
                </span>
              </span>
            </Link>
          </nav>
        )}
      </main>
    </>
  );
}
