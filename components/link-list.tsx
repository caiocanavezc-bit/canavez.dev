import Link from "next/link";
import type { CSSProperties } from "react";

export type LinkItem = {
  href: string;
  titulo: string;
  descricao: string;
  /** Rótulo curto à esquerda (ex.: "whatsapp"); se algum item tiver, a lista ganha a coluna. */
  marcador?: string;
  externo?: boolean;
  /** Nome acessível do link, quando o título sozinho não basta. */
  ariaLabel?: string;
};

// Lista com fio entre os itens: título, descrição e uma seta que aparece no hover.
export function LinkList({ itens }: { itens: LinkItem[] }) {
  const marcada = itens.some((i) => i.marcador);
  return (
    <ul className="cv-links" data-marked={marcada ? "" : undefined}>
      {itens.map((item, i) => {
        const conteudo = (
          <>
            {marcada && <span className="cv-link-marker">{item.marcador}</span>}
            <span className="cv-link-title">{item.titulo}</span>
            <span className="cv-arrow" aria-hidden="true">
              →
            </span>
            <span className="cv-link-desc">{item.descricao}</span>
          </>
        );
        return (
          <li
            key={item.href}
            data-reveal
            style={{ "--reveal-delay": `${Math.min(i, 4) * 60}ms` } as CSSProperties}
          >
            {item.externo || !item.href.startsWith("/") ? (
              <a
                className="cv-link"
                href={item.href}
                aria-label={item.ariaLabel}
                {...(item.externo
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {conteudo}
              </a>
            ) : (
              <Link className="cv-link" href={item.href} aria-label={item.ariaLabel}>
                {conteudo}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
