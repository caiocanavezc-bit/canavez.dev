# canavez.dev

Portfólio pessoal de Caio Canavez, desenvolvedor full-stack. Site estático em Next.js com estética inspirada no modo escuro do X.

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
- `content/projetos/*.mdx`: um arquivo por case, com `export const meta`.
- `public/`: avatar e prints dos cases.
- `scripts/`: geração do avatar e captura dos prints com dados fictícios.
- `docs/superpowers/specs/`: especificação de design; `docs/insumos.md`: conteúdo aprovado.
