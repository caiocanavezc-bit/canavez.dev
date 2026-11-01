"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useEffect, useState } from "react";
import type { Perfil } from "@/content/perfil";
import { mailtoUrl, whatsappUrl } from "@/lib/links";
import { scrollSuave } from "@/lib/smooth-scroll";
import { ThemeToggle } from "./theme-toggle";

export type Secao = "sobre" | "experiencia" | "projetos" | "servicos" | "contato";

const SECOES: { id: Secao; label: string }[] = [
  { id: "sobre", label: "sobre" },
  { id: "experiencia", label: "experiência" },
  { id: "projetos", label: "projetos" },
  { id: "servicos", label: "serviços" },
  { id: "contato", label: "contato" },
];

// Marca a seção que ocupa a faixa central da tela; no topo, a primeira; no fim da página,
// a última (curta demais para chegar ao centro).
function useSecaoAtiva(ids: string[], ligado: boolean) {
  const [ativa, setAtiva] = useState<string | null>(null);
  const chave = ids.join(",");
  useEffect(() => {
    if (!ligado) return;
    const alvos = chave
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!alvos.length) return;
    const naFaixa = new Set<string>();
    const atualizar = () => {
      const fim =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (fim) return setAtiva(alvos[alvos.length - 1].id);
      if (window.scrollY < 50) return setAtiva(alvos[0].id);
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
  }, [chave, ligado]);
  return ativa;
}

// Âncoras da própria página descem suavemente ao clicar — inclusive com "reduzir movimento"
// ligado (pedido do Caio: no Windows sem efeitos de animação o menu pulava).
// Pelo teclado (detail 0) fica o salto nativo, que também leva o ponto de navegação por Tab.
function descerSuave(evento: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#") || evento.detail === 0) return;
  const alvo = document.querySelector<HTMLElement>(href);
  if (!alvo) return;
  evento.preventDefault();
  history.replaceState(null, "", href);
  const margem = parseFloat(getComputedStyle(alvo).scrollMarginTop) || 0;
  const topo = href === "#sobre" ? 0 : alvo.getBoundingClientRect().top + window.scrollY - margem;
  scrollSuave(topo);
}

export function Sidebar({
  perfil,
  variant,
  atual,
  hasProjects = true,
}: {
  perfil: Perfil;
  /** "home" acompanha a rolagem; "pagina" leva às seções da home e marca `atual`. */
  variant: "home" | "pagina";
  atual?: Secao;
  hasProjects?: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const secoes = SECOES.filter((s) => hasProjects || s.id !== "projetos");
  const ativa = useSecaoAtiva(
    secoes.map((s) => s.id),
    variant === "home",
  );
  const { contato } = perfil;

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [aberto]);

  const redes = [
    contato.github && { href: contato.github, label: "github", externo: true },
    contato.linkedin && { href: contato.linkedin, label: "linkedin", externo: true },
    contato.instagram && { href: contato.instagram, label: "instagram", externo: true },
    contato.email && {
      href: mailtoUrl(contato.email, contato.assuntoEmail),
      label: "e-mail",
      externo: false,
    },
    contato.whatsapp && {
      href: whatsappUrl(contato.whatsapp, contato.mensagemWhatsapp),
      label: "whatsapp",
      externo: true,
    },
  ].filter((r): r is { href: string; label: string; externo: boolean } => !!r);

  return (
    <aside className="cv-side" data-open={aberto ? "" : undefined} data-testid="barra-lateral">
      <Link href="/" className="cv-profile" aria-label={`${perfil.nome}, início`}>
        {perfil.avatar && (
          <Image
            src={perfil.avatar.src}
            alt=""
            width={56}
            height={56}
            priority
            quality={100}
            className="cv-avatar"
          />
        )}
        <span className="cv-name">{perfil.nome}</span>
        <span className="cv-role">{perfil.papel}</span>
      </Link>

      <button
        type="button"
        className="cv-btn cv-menu"
        aria-expanded={aberto}
        aria-controls="cv-navegacao"
        onClick={() => setAberto((a) => !a)}
      >
        {aberto ? "fechar" : "menu"}
      </button>

      <nav id="cv-navegacao" className="cv-nav" aria-label="Navegação principal">
        {secoes.map(({ id, label }) => {
          const href = variant === "home" ? `#${id}` : `/#${id}`;
          const marcado = variant === "home" ? ativa === id : atual === id;
          return (
            <Link
              key={id}
              href={href}
              aria-current={marcado ? (variant === "home" ? "true" : "page") : undefined}
              onClick={(e) => {
                setAberto(false);
                descerSuave(e, href);
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="cv-side-foot">
        <ThemeToggle />
        <ul aria-label="Redes e contato">
          {redes.map((r) => (
            <li key={r.label}>
              <a
                href={r.href}
                {...(r.externo
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {r.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="cv-copy">{perfil.cidade.toLowerCase()}</span>
      </div>
    </aside>
  );
}
