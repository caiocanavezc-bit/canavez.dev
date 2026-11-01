import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import {
  getAdjacentProject,
  getProject,
  getProjects,
  TIPO_PROJETO,
} from "@/lib/projects";

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
    <Shell variant="pagina" atual="projetos">
      <article className="flex flex-col gap-10">
        <header className="cv-post-head">
          <Link href="/#projetos" className="cv-back">
            ← todos os projetos
          </Link>
          <span className="cv-label">
            {TIPO_PROJETO[meta.kind]} · {meta.year}
          </span>
          <h1 className="cv-display">{meta.title}</h1>
          <p className="cv-subtitle">{meta.subtitle}</p>
          <p className="cv-meta m-0">
            {meta.role.toLowerCase()}
            <span aria-hidden="true"> · </span>
            <span className="sr-only">. Tecnologias: </span>
            {meta.stack.join(" · ").toLowerCase()}
          </p>
          {meta.liveUrl && (
            <a
              href={meta.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-pill self-start"
            >
              Ver online
              <span className="cv-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          )}
        </header>

        <figure className="cv-figure">
          <Image
            src={meta.cover}
            alt={`Tela principal do projeto ${meta.title}`}
            width={1600}
            height={1000}
            priority
            sizes="(min-width: 960px) 600px, 100vw"
          />
        </figure>

        <div className="cv-body">
          <Content />
        </div>

        {meta.gallery.length > 0 && (
          <section aria-labelledby="titulo-telas" className="flex flex-col gap-10">
            <div className="cv-section-head" style={{ marginBottom: 0 }}>
              <h2 id="titulo-telas">Telas</h2>
              <span className="cv-aside">{meta.gallery.length} capturas</span>
            </div>
            {meta.gallery.map((img) => {
              const vertical = img.height > img.width;
              return (
                <figure
                  key={img.src}
                  className="cv-figure"
                  data-vertical={vertical ? "" : undefined}
                  data-reveal
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes={vertical ? "340px" : "(min-width: 960px) 600px, 100vw"}
                  />
                  <figcaption aria-hidden="true">{img.alt.toLowerCase()}</figcaption>
                </figure>
              );
            })}
          </section>
        )}

        {proximo.slug !== meta.slug && (
          <nav aria-label="Outros projetos">
            <Link href={`/projetos/${proximo.slug}`} className="cv-next">
              <small>Próximo case →</small>
              {proximo.title}
            </Link>
          </nav>
        )}
      </article>
    </Shell>
  );
}
