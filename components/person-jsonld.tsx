import type { Perfil } from "@/content/perfil";
import { siteUrl } from "@/lib/site";

// Dados estruturados para buscadores: quem é a pessoa e onde mais ela está.
export function PersonJsonLd({ perfil }: { perfil: Perfil }) {
  const dados = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: perfil.nome,
    url: siteUrl(),
    jobTitle: "Desenvolvedor full-stack",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Batatais",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidade de Ribeirão Preto (Unaerp)",
    },
    sameAs: [perfil.contato.linkedin, perfil.contato.github].filter(Boolean),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify não escapa "<"; troca para não fechar a tag <script> por acidente.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(dados).replace(/</g, "\\u003c"),
      }}
    />
  );
}
