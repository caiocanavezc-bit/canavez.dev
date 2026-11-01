import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { type LinkItem, LinkList } from "@/components/link-list";
import { PersonJsonLd } from "@/components/person-jsonld";
import { SectionHead } from "@/components/section-head";
import { Shell } from "@/components/shell";
import { perfil } from "@/content/perfil";
import { mailtoUrl, whatsappUrl } from "@/lib/links";
import { getProjects, TIPO_PROJETO } from "@/lib/projects";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const atraso = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

export default function Home() {
  const projetos = getProjects();
  const { contato } = perfil;
  const anos = projetos.map((p) => p.year);

  const servicos: LinkItem[] = perfil.servicos.map((s) => ({
    href: `/projetos/${s.exemploSlug}`,
    titulo: s.titulo,
    descricao: s.texto,
  }));

  const candidatos: (LinkItem | false | "" | undefined)[] = [
    contato.whatsapp && {
      href: whatsappUrl(contato.whatsapp, contato.mensagemWhatsapp),
      marcador: "whatsapp",
      titulo: contato.whatsappExibicao ?? contato.whatsapp,
      descricao: "o jeito mais rápido de falar comigo",
      externo: true,
      ariaLabel: "WhatsApp",
    },
    contato.email && {
      href: mailtoUrl(contato.email, contato.assuntoEmail),
      marcador: "e-mail",
      titulo: contato.email,
      descricao: "para propostas e orçamentos",
      ariaLabel: "E-mail",
    },
    contato.linkedin && {
      href: contato.linkedin,
      marcador: "linkedin",
      titulo: "caio canavez",
      descricao: "trajetória e recomendações",
      externo: true,
      ariaLabel: "LinkedIn",
    },
    contato.github && {
      href: contato.github,
      marcador: "github",
      titulo: "caiocanavezc-bit",
      descricao: "código e projetos abertos",
      externo: true,
      ariaLabel: "GitHub",
    },
    contato.instagram && {
      href: contato.instagram,
      marcador: "instagram",
      titulo: "@canavezz",
      descricao: "bastidores e dia a dia",
      externo: true,
      ariaLabel: "Instagram",
    },
  ];
  const contatos = candidatos.filter((c): c is LinkItem => !!c);

  return (
    <>
      <PersonJsonLd perfil={perfil} />
      <Shell variant="home" hasProjects={projetos.length > 0}>
        <section id="sobre" aria-labelledby="titulo-sobre">
          <div className="cv-about-head">
            <h1 id="titulo-sobre" className="cv-display">
              sobre mim
            </h1>
            <div className="cv-pills">
              {perfil.disponibilidade && contato.whatsapp && (
                <a
                  className="cv-pill"
                  data-testid="selo-disponivel"
                  href={whatsappUrl(contato.whatsapp, contato.mensagemWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="cv-dot" aria-hidden="true" />
                  <span>{perfil.disponibilidade}</span>
                  <span className="cv-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              )}
              {projetos[0] && (
                <Link className="cv-pill" href={`/projetos/${projetos[0].slug}`}>
                  <span>último case: {projetos[0].title}</span>
                  <span className="cv-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>

          <div className="cv-prose">
            {perfil.sobre.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="cv-stats">
            {perfil.metricas.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.valor}</dd>
              </div>
            ))}
          </dl>

          <ul className="cv-tags" aria-label="Áreas">
            {perfil.areas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>

        <section id="experiencia" aria-labelledby="titulo-experiencia">
          <div data-reveal>
            <SectionHead
              id="titulo-experiencia"
              titulo="experiência"
              aside={`${perfil.experiencia.length} frentes · desde 2025`}
            />
          </div>
          <ol className="cv-timeline">
            {perfil.experiencia.map((e, i) => (
              <li
                key={e.papel}
                className="cv-tl-item"
                data-status={e.status}
                data-reveal
                style={atraso((i + 1) * 70)}
              >
                <span className="cv-tl-dot" aria-hidden="true" />
                <p className="cv-tl-role">{e.papel}</p>
                <span className="cv-tl-when">{e.quando}</span>
                <span className="cv-tl-org">{e.org}</span>
                {e.detalhe && <span className="cv-tl-detail">{e.detalhe}</span>}
              </li>
            ))}
          </ol>
        </section>

        {projetos.length > 0 && (
          <section id="projetos" aria-labelledby="titulo-projetos">
            <div data-reveal>
              <SectionHead
                id="titulo-projetos"
                titulo="projetos"
                aside={`${projetos.length} · ${Math.min(...anos)}${
                  Math.max(...anos) !== Math.min(...anos) ? `–${Math.max(...anos)}` : ""
                }`}
              />
            </div>
            <ul className="cv-entries">
              {projetos.map((p, i) => (
                <li
                  key={p.slug}
                  className="cv-entry"
                  data-reveal
                  style={atraso((i + 1) * 70)}
                >
                  <span className="cv-label">
                    {TIPO_PROJETO[p.kind]} · {p.year}
                  </span>
                  <h3>
                    <Link href={`/projetos/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p>{p.subtitle}</p>
                  <span className="cv-meta">
                    {p.stack.join(" · ").toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="servicos" aria-labelledby="titulo-servicos">
          <div data-reveal>
            <SectionHead id="titulo-servicos" titulo="serviços" aside="com exemplo real" />
          </div>
          <LinkList itens={servicos} />
        </section>

        <section id="contato" aria-labelledby="titulo-contato">
          <div data-reveal>
            <SectionHead id="titulo-contato" titulo="contato" />
          </div>
          <div className="cv-prose" data-reveal style={atraso(60)}>
            <p>
              Tem um sistema ou site em mente? Me chama no WhatsApp ou por
              e-mail.
            </p>
          </div>
          <div style={{ marginTop: 16 }}>
            <LinkList itens={contatos} />
          </div>
        </section>
      </Shell>
    </>
  );
}
