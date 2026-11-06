# canavez.dev

Portfólio pessoal de Caio Canavez, desenvolvedor full-stack. Site estático em Next.js com estética editorial: barra lateral fixa, títulos em serifa leve (Spectral), texto em Hanken Grotesk e rótulos em IBM Plex Mono, com tema claro e escuro.

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm test             # Vitest (conteúdo e funções)
npm run test:e2e     # Playwright (desktop e celular)
npm run build
```

Antes do primeiro `test:e2e`, instale o navegador: `npx playwright install chromium`.

## Onde fica cada coisa

- `content/perfil.ts`: nome, bio, números, serviços e contatos.
- `content/projetos/*.mdx`: um arquivo por case, com `export const meta`. Um case novo também entra no registro de `lib/projects.ts` e em `lib/project-slugs.ts` (os testes avisam se faltar).
- `public/`: avatar e prints dos cases.
- `scripts/`: geração do avatar e captura dos prints com dados fictícios.
- `docs/superpowers/specs/`: especificação de design; `docs/insumos.md`: conteúdo aprovado.

## Qualidade

- CI (GitHub Actions) roda lint, tipos, Vitest e Playwright (desktop e celular, incluindo axe para acessibilidade) em cada PR.
- Lighthouse local (2026-10-29): desktop 100 nas quatro categorias; mobile 90–93 em performance e 100 em acessibilidade, boas práticas e SEO.
