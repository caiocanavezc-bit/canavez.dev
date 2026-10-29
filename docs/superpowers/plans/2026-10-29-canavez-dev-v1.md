# canavez.dev v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar o portfólio estático do Caio Canavez (home + 2 páginas de case) em Next.js, com estética "X dark", testado e pronto para a Vercel.

**Architecture:** Next.js App Router com todas as rotas estáticas. O perfil vive em `content/perfil.ts`; cada case é um MDX com `export const meta`, registrado num índice explícito em `lib/projects.ts`, que valida tudo e derruba o build se algo faltar. Prints dos cases são gerados por scripts Playwright a partir de cópias locais dos repositórios, com dados fictícios.

**Tech Stack:** Node 24, Next.js 16.4.3, React 19.3.1, Tailwind CSS 4.3.3, `geist` 1.8.2, `lucide-react` 1.64.0, `@next/mdx` 16.4.3, Vitest 5.0.5 + `@mdx-js/rollup` 3.1.1, `@playwright/test` 1.64.1, `@axe-core/playwright` 4.14.0, `sharp` 0.35.5 (dev, só scripts).

**Spec:** `docs/superpowers/specs/2026-10-29-canavez-dev-design.md`. Valores de conteúdo: `docs/insumos.md`.

## Global Constraints

- Idioma de todo texto visível: pt-BR; `<html lang="pt-BR">`.
- Tokens (spec 6.1): `--bg #000000`, `--surface #16181C`, `--border #2F3336`, `--text #E7E9EA`, `--muted #71767B`, `--title-dim #5B5F63` (só em texto ≥ 24px), `--accent #1D9BF0`, botão `#EFF3F4` com texto `#0F1419`.
- Fontes: Geist Sans 700 nos títulos (sem caixa alta, `letter-spacing: -0.02em`), Geist Mono em anos, métricas e chips; texto corrido 16–17px, `line-height: 1.6`, `max-width: 62ch`.
- Hero `clamp(44px, 8vw, 88px)`; títulos de seção `clamp(36px, 6vw, 64px)`.
- Layout: ≥ 1024px duas colunas (cartão sticky 340px + conteúdo máx. 680px); celular uma coluna, gutter 16px, sem rolagem horizontal até 320px.
- Áreas de toque ≥ 44px; foco visível em `--accent`; contraste AA.
- Sem cookies, analytics, backend, formulário ou chamadas de rede em runtime.
- Todo `target="_blank"` leva `rel="noopener noreferrer"`.
- Movimento desligado com `prefers-reduced-motion: reduce`.
- **Nenhum dado real de aluno, motorista ou responsável** em print, texto ou `alt`.
- Commits: Conventional Commits em pt-BR, terminando com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Trabalho na branch `feat/v1-site`; PR para `main` no fim. Nunca `git add .`/`-A` (a pasta `insumos/` tem a foto bruta).

**Desvios deliberados da spec** (registrar na descrição do PR):

1. **URL canônica:** a spec fixa `https://canavez.dev`, mas o domínio ainda não foi comprado. `lib/site.ts` resolve a URL por ambiente (Task 2) e passa a usar canavez.dev quando `NEXT_PUBLIC_SITE_URL` for definida.
2. **Sem a lib `motion`:** as revelações usam CSS + IntersectionObserver, que funciona sem JS e com reduced-motion de graça; a contagem usa `requestAnimationFrame`; a transição home → case usa a View Transitions API pelo React (Task 8). Uma dependência a menos.
3. **Ícones de marca:** `lucide-react` 1.x não tem mais ícones de marcas, então GitHub, LinkedIn e WhatsApp são SVGs em `components/icons.tsx`.

## Review Focus

1. **Sem JavaScript ou com o JS quebrado, o conteúdo precisa aparecer.** A animação de entrada não pode deixar seções invisíveis → teste com `javaScriptEnabled: false` (Task 8).
2. **Navegação por teclado:** o primeiro Tab foca "Pular para o conteúdo" e todos os links do dock e dos cases são alcançáveis → teste na Task 5.
3. **Textos longos em 320px** (nome do case, chips de stack, e-mail) não podem estourar a largura → teste de rolagem horizontal também nas páginas de case (Task 6).
4. **Links externos seguros:** todo `target="_blank"` com `rel` correto → teste na Task 6.
5. **Imagens quebradas ou sem `alt`** depois de um deploy → teste de `naturalWidth > 0` e `alt` não vazio (Task 6).

---

### Task 1: Esqueleto do projeto, tokens e infraestrutura de testes

**Files:**
- Create (via create-next-app): `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `vitest.config.ts`, `playwright.config.ts`, `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`, `.github/workflows/ci.yml`, `README.md`
- Modify: `.gitignore` (manter a linha `insumos/`)

**Interfaces:**
- Produces: scripts npm `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `test:e2e` (`playwright test`); alias `@/*` → raiz; classes Tailwind `bg-bg`, `bg-surface`, `border-border`, `text-text`, `text-muted`, `text-title-dim`, `text-accent` via `@theme`; `font-sans`/`font-mono` = Geist.

- [ ] **Step 1: Criar a branch e gerar o app**

```bash
cd /d/canavez.dev && git checkout -b feat/v1-site
npx create-next-app@16.4.3 app-tmp --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack --skip-install
```
Mover o conteúdo de `app-tmp/` para a raiz (sem sobrescrever `docs/` e `.gitignore`; mesclar o `.gitignore` gerado ao existente) e apagar `app-tmp/`. Depois `npm install`.

- [ ] **Step 2: Instalar as dependências com versões exatas**

```bash
npm i -E geist@1.8.2 lucide-react@1.64.0 @next/mdx@16.4.3 @mdx-js/loader @mdx-js/react @types/mdx
npm i -D -E vitest@5.0.5 @mdx-js/rollup@3.1.1 @playwright/test@1.64.1 @axe-core/playwright@4.14.0 sharp@0.35.5
npx playwright install chromium
```

- [ ] **Step 3: Escrever os testes de fumaça**

`tests/unit/smoke.test.ts`: `expect(1 + 1).toBe(2)` (só prova que o Vitest roda; é apagado na Task 2).

`tests/e2e/smoke.spec.ts`:
```ts
test("html em pt-BR com fundo preto", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(0, 0, 0)");
});
```

- [ ] **Step 4: Configurar Vitest e Playwright**

- `vitest.config.ts`: plugin `mdx()` de `@mdx-js/rollup`; `resolve.alias` `@` → raiz; `test.include: ["tests/unit/**/*.test.ts"]`; `environment: "node"`.
- `playwright.config.ts`: `testDir: "tests/e2e"`; `webServer: { command: "npm run build && npm run start -- -p 3100", port: 3100, reuseExistingServer: !process.env.CI, timeout: 180_000 }`; `use.baseURL: "http://localhost:3100"`; projetos `desktop` (Chromium 1440×900) e `mobile` (Chromium 390×844, `isMobile: true`, `hasTouch: true`).

- [ ] **Step 5: Rodar os testes e confirmar que o e2e falha**

Run: `npm test && npm run test:e2e -- --project=desktop`
Expected: Vitest PASS; e2e FAIL (lang `en` e fundo branco do template).

- [ ] **Step 6: Tokens, fontes e layout base**

- `app/globals.css`: `@import "tailwindcss";` + bloco `@theme` com os tokens das Global Constraints (`--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-muted`, `--color-title-dim`, `--color-accent`, `--color-button`, `--color-button-text`) e `--font-sans: var(--font-geist-sans)`, `--font-mono: var(--font-geist-mono)`; `body { background: var(--color-bg); color: var(--color-text); }`; `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`. Apagar os estilos do template.
- `app/layout.tsx`: `GeistSans` e `GeistMono` de `geist/font/sans` e `geist/font/mono` aplicados em `<html lang="pt-BR" className={...variables}>`; `metadata` provisória com título "Caio Canavez".
- `app/page.tsx`: um `<main>` com o texto "Caio Canavez" (é substituído na Task 5).
- `next.config.ts`: ainda sem MDX (entra na Task 4).

- [ ] **Step 7: Rodar e confirmar que passa**

Run: `npm run lint && npm run typecheck && npm test && npm run test:e2e`
Expected: tudo PASS nos dois projetos.

- [ ] **Step 8: CI e README**

- `.github/workflows/ci.yml`: em `pull_request` e `push` na `main`; Node 24; `npm ci`; `npm run lint`; `npm run typecheck`; `npm test`; `npx playwright install --with-deps chromium`; `npm run test:e2e`; upload do `playwright-report/` quando falhar.
- `README.md`: o que é o projeto, comandos acima, onde ficam conteúdo (`content/`) e imagens (`public/`), link para a spec.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts eslint.config.mjs postcss.config.mjs app vitest.config.ts playwright.config.ts tests .github README.md .gitignore public
git commit -m "chore: esqueleto Next.js com tokens, Geist e testes"
```

---

### Task 2: Configuração do site, links de contato e conteúdo do perfil

**Files:**
- Create: `lib/site.ts`, `lib/links.ts`, `content/perfil.ts`
- Test: `tests/unit/site.test.ts`, `tests/unit/links.test.ts`, `tests/unit/perfil.test.ts`
- Delete: `tests/unit/smoke.test.ts`

**Interfaces:**
- Produces:
  - `siteUrl(env?: Record<string, string | undefined>): string`: usa `NEXT_PUBLIC_SITE_URL`; senão `https://${VERCEL_PROJECT_PRODUCTION_URL}`; senão `http://localhost:3000`. Sem barra final.
  - `whatsappUrl(phoneE164Digits: string, message: string): string` → `https://wa.me/<dígitos>?text=<encodeURIComponent(message)>`.
  - `mailtoUrl(email: string, subject: string): string` → `mailto:<email>?subject=<encodeURIComponent(subject)>`.
  - Em `content/perfil.ts`, os tipos e o objeto `perfil: Perfil`:

```ts
export type Metric = { value: number; prefix?: string; suffix?: string; label: string; fonte: string };
export type Servico = { icon: "layout-dashboard" | "globe"; titulo: string; texto: string; exemploSlug: string };
export type AgoraItem = { icon: "briefcase" | "graduation-cap"; texto: string };
export type Perfil = {
  nome: string; handle: string; bio: string; cidade: string;
  avatar: { src: string; alt: string } | null;
  agora: AgoraItem[];
  heroTitulo: [string, string]; heroParagrafo: string;
  metricas: Metric[]; servicos: Servico[];
  contato: { whatsapp?: string; email?: string; linkedin?: string; github?: string;
             mensagemWhatsapp: string; assuntoEmail: string };
};
```

- [ ] **Step 1: Escrever os testes que falham**

`tests/unit/links.test.ts`:
```ts
expect(whatsappUrl("5516992647064", "Olá, Caio! Vi seu portfólio e quero conversar sobre um projeto."))
  .toBe("https://wa.me/5516992647064?text=Ol%C3%A1%2C%20Caio!%20Vi%20seu%20portf%C3%B3lio%20e%20quero%20conversar%20sobre%20um%20projeto.");
expect(mailtoUrl("caiocanavezc@gmail.com", "Contato pelo portfólio"))
  .toBe("mailto:caiocanavezc@gmail.com?subject=Contato%20pelo%20portf%C3%B3lio");
```

`tests/unit/site.test.ts`:
```ts
expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "https://canavez.dev/" })).toBe("https://canavez.dev");
expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "canavez-dev.vercel.app" })).toBe("https://canavez-dev.vercel.app");
expect(siteUrl({})).toBe("http://localhost:3000");
```

`tests/unit/perfil.test.ts`:
- toda métrica tem `fonte.trim().length > 0`;
- `perfil.bio.length <= 120`;
- `perfil.heroTitulo` é `["Desenvolvedor", "full-stack"]`;
- `perfil.servicos.map(s => s.exemploSlug)` é `["aeb-transporte", "bc-consultoria"]`;
- `perfil.contato.whatsapp === "5516992647064"` e `perfil.contato.email === "caiocanavezc@gmail.com"`.

- [ ] **Step 2: Rodar e confirmar que falham**

Run: `npm test`
Expected: FAIL ("Cannot find module '@/lib/links'" etc.).

- [ ] **Step 3: Implementar `lib/site.ts`, `lib/links.ts` e `content/perfil.ts`**

Valores de `perfil` (copiar exatamente; origem `docs/insumos.md`):

| Campo | Valor |
|---|---|
| nome | `Caio Canavez` |
| handle | `@canavez` |
| bio | `Desenvolvo sistemas web para problemas reais, da prefeitura ao ônibus da faculdade.` |
| cidade | `Batatais, SP` |
| avatar | `{ src: "/perfil/avatar.webp", alt: "Caio Canavez" }` (o arquivo nasce na Task 3) |
| agora | `[{ icon: "briefcase", texto: "Estagiário de TI · Prefeitura de Batatais" }, { icon: "graduation-cap", texto: "Engenharia de Computação · Unaerp · 2025–2030" }]` |
| heroTitulo | `["Desenvolvedor", "full-stack"]` |
| heroParagrafo | `Estudo Engenharia de Computação na Unaerp e sou estagiário de TI na Prefeitura de Batatais, onde trabalho com dados orçamentários, relatórios e sistemas de RH. Por fora, já entreguei mais de 10 sistemas web, do controle de embarque de estudantes ao site de um escritório de advocacia.` |
| metricas | `{ value: 10, prefix: "+", label: "sistemas entregues", fonte: "Informado pelo Caio em 2026-10-29" }`, `{ value: 1, suffix: " ano", label: "de TI no setor público", fonte: "LinkedIn: estágio na Prefeitura de Batatais desde out/2025" }` |
| servicos[0] | `layout-dashboard`, `Sistemas web sob medida`, `Painéis, controle de acesso por perfil, relatórios em PDF e banco de dados na nuvem.`, `aeb-transporte` |
| servicos[1] | `globe`, `Sites institucionais`, `Sites rápidos, responsivos e prontos para o Google, para negócios e profissionais.`, `bc-consultoria` |
| contato | whatsapp `5516992647064`, email `caiocanavezc@gmail.com`, linkedin `https://www.linkedin.com/in/caio-canavez-b1427b427`, github `https://github.com/caiocanavezc-bit`, mensagemWhatsapp `Olá, Caio! Vi seu portfólio e quero conversar sobre um projeto.`, assuntoEmail `Contato pelo portfólio` |

- [ ] **Step 4: Rodar e confirmar que passam**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git rm tests/unit/smoke.test.ts
git add lib/site.ts lib/links.ts content/perfil.ts tests/unit
git commit -m "feat: perfil, links de contato e URL do site"
```

---

### Task 3: Imagens: avatar e prints dos cases com dados fictícios

**Files:**
- Create: `scripts/avatar.mjs`, `scripts/aeb/seed_ficticio.py`, `scripts/aeb/capturar.mjs`, `scripts/aeb/README.md`, `scripts/bc/capturar.mjs`
- Create (gerados): `public/perfil/avatar.webp`, `public/projetos/aeb-transporte/{capa,thumb,chamada,rotas,celular,pdf}.webp`, `public/projetos/bc-consultoria/{capa,thumb,servicos,celular}.webp`
- Test: `tests/unit/assets.test.ts`

**Interfaces:**
- Produces: os arquivos acima. Capa 1600×1000 e thumb 640×400 (16:10); prints com no máximo 1600px de largura; tudo WebP com qualidade 82.

- [ ] **Step 1: Escrever o teste que falha**

`tests/unit/assets.test.ts`: para cada caminho da lista acima, `fs.existsSync(path.join("public", p))` é `true`; com `sharp(...).metadata()`, `capa` tem 1600×1000, `thumb` tem 640×400 e `avatar.webp` tem 512×512.

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test -- assets`
Expected: FAIL (arquivos inexistentes).

- [ ] **Step 3: `scripts/avatar.mjs`**

Lê `insumos/foto-espelho.png` (960×1280) com `sharp`: `extract({ left: 200, top: 120, width: 560, height: 560 })` (do topo da cabeça até a cintura), `modulate({ brightness: 0.8, saturation: 0.55 })`, `resize(512, 512)`, `webp({ quality: 82 })` → `public/perfil/avatar.webp`. Abrir o resultado e conferir o enquadramento; se cortar a cabeça ou o celular, ajustar `left`/`top` e registrar os valores finais no script.

- [ ] **Step 4: Ambiente isolado do AEB (proteção do banco de produção)**

O `database.py` do AEB lê `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` do arquivo `.env` quando as variáveis não estão definidas. Por isso:

```bash
T="$TEMP/aeb-capturas"; rm -rf "$T"; mkdir -p "$T/app"
git -C /d/aeb-transporte archive HEAD | tar -x -C "$T/app"
test ! -e "$T/app/.env" || { echo "ABORTAR: .env na cópia"; exit 1; }
```

O `scripts/aeb/README.md` documenta esse passo e as variáveis abaixo. O servidor sobe com:
```bash
cd "$T/app" && python -m venv .venv && .venv/Scripts/pip install -r requirements.txt pymupdf
ENVIRONMENT=development SQLITE_DB_PATH="$T/aeb.db" ADMIN_PASSWORD="Demo-Portfolio-2026!" \
JWT_SECRET="jwt-local-capturas-portfolio-0123456789abcdef" \
  .venv/Scripts/python -m uvicorn app:app --port 8765
```
sem `TURSO_*` no ambiente.

- [ ] **Step 5: `scripts/aeb/seed_ficticio.py`**

Executado com o Python do venv a partir de `$T/app` (`.venv/Scripts/python /d/canavez.dev/scripts/aeb/seed_ficticio.py`), **antes** de subir o servidor. Primeira linha útil: `import database; database._get_turso_config = lambda: (None, None)` (mesma blindagem do `conftest.py` do AEB). Depois afirma `database.DB_PATH` dentro de `$TEMP` (senão aborta) e roda `database.init_db()`. Cria:
- 2 faculdades fictícias: `("FACEX", "Faculdade Exemplo", "#1D9BF0")`, `("UNIDEMO", "Universidade Demo", "#7856FF")`;
- 1 rota "Rota Demo · Noite" com 5 pontos de ida e 5 de volta, de nomes genéricos (`Praça Central`, `Rodoviária`, `Avenida Principal`, `Escola Estadual`, `Terminal Norte`) e coordenadas inventadas perto de `(-20.89, -47.58)`;
- 18 alunos com nomes inventados e comuns, todos com o sobrenome "Exemplo" (ex.: `Ana Exemplo`, `Bruno Exemplo`…), com CPF `NULL`. Se o schema exigir CPF, usar `000000000` seguido de dois dígitos sequenciais (`00000000001`, `00000000002`…), que não são CPFs válidos;
- logins de demo: representante `guia.demo` e motorista `motorista.demo`.

Usar as mesmas tabelas e colunas que o `seed_data.py` do AEB (`faculdades`, `pontos`, `alunos`) e, para usuários, a função de criação existente em `database.py` (procurar `hash_password` e `INSERT INTO usuarios`).

- [ ] **Step 6: `scripts/aeb/capturar.mjs` (Playwright)**

Com o servidor em `http://localhost:8765`: faz login como admin (`ADMIN_PASSWORD` acima), marca cerca de 60% das presenças da ida para a tela parecer em uso, e captura:
- `chamada`: checklist de presença (1440×900);
- `rotas`: gestão de rotas e pontos (1440×900);
- `celular`: visão do representante (390×844, `deviceScaleFactor: 2`);
- `pdf`: gera o relatório de embarque pela interface, salva o PDF e renderiza a página 1 com PyMuPDF (`fitz`) para PNG.

Converte tudo para WebP com `sharp`; `capa` = `chamada` recortada para 16:10 e redimensionada para 1600×1000; `thumb` = capa em 640×400. Ao terminar, **abrir cada imagem e conferir que só aparecem nomes "Exemplo"**.

- [ ] **Step 7: `scripts/bc/capturar.mjs`**

```bash
B="$TEMP/bc-capturas"; rm -rf "$B"
gh repo clone caiocanavezc-bit/bc_consultoria "$B" -- --depth 1
```
Servir `$B` com `npx serve -l 8766 "$B"` e capturar: `capa` (hero, 1440×900 → 1600×1000), `servicos` (rolar até o h2 "Soluções jurídicas para diferentes necessidades." e capturar o viewport), `celular` (390×844, `deviceScaleFactor: 2`), `thumb` (640×400 a partir da capa). Esperar `document.fonts.ready` e rolar a página inteira antes, para disparar as animações `.reveal`.

- [ ] **Step 8: Rodar e confirmar que passa**

Run: `npm test -- assets`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add scripts public/perfil public/projetos tests/unit/assets.test.ts
git commit -m "feat: avatar e prints dos cases com dados fictícios"
```

---

### Task 4: Pipeline de cases em MDX

**Files:**
- Create: `lib/projects.ts`, `lib/validate-projects.ts`, `mdx-components.tsx`, `content/projetos/aeb-transporte.mdx`, `content/projetos/bc-consultoria.mdx`
- Modify: `next.config.ts` (envolver com `createMDX()` de `@next/mdx`; `pageExtensions: ["ts", "tsx", "mdx"]`)
- Test: `tests/unit/validate-projects.test.ts`, `tests/unit/projects.test.ts`

**Interfaces:**
- Consumes: imagens da Task 3.
- Produces:
  - `type ProjectMeta` como na spec 4.3 (`slug, title, subtitle, year, role, kind: "sistema" | "site", stack, liveUrl?, cover, thumb, order, published`) mais `gallery: { src: string; alt: string }[]` (prints exibidos pelo layout do case; cada `src` validado como as outras imagens). A galeria fica nos metadados, e não no corpo do MDX, para o layout controlar a apresentação.
  - `validateProjects(entries: { fileSlug: string; meta: unknown }[], publicDir: string): ProjectMeta[]`: lança `Error` com **todas** as falhas numa mensagem (uma por linha, prefixada pelo slug).
  - `getProjects(): ProjectMeta[]`: publicados, ordenados por `order`.
  - `getProject(slug: string): { meta: ProjectMeta; Content: React.ComponentType } | null`: só publicados.
  - `getAdjacentProject(slug: string): ProjectMeta`: o próximo da lista, voltando ao primeiro depois do último.
  - Registro em `lib/projects.ts`: `import * as aeb from "@/content/projetos/aeb-transporte.mdx"` (idem bc) num array `{ fileSlug, mod }`. A validação roda no carregamento do módulo, ou seja, no build.

- [ ] **Step 1: Escrever os testes que falham**

`tests/unit/validate-projects.test.ts` (com um `meta` válido de base, modificado caso a caso, e `publicDir` apontando para `public/`):
- meta válido → retorna 1 item;
- sem `title` → erro contém `"aeb-transporte: campo obrigatório ausente: title"`;
- `slug: "outro"` com `fileSlug: "aeb-transporte"` → erro contém `"slug \"outro\" difere do arquivo"`;
- `cover: "/projetos/x/nao-existe.webp"` → erro contém `"imagem não encontrada: /projetos/x/nao-existe.webp"`;
- dois itens com `order: 1` → erro contém `"order 1 repetido"`;
- `kind: "app"` → erro contém `"kind inválido"`;
- `gallery: [{ src: "/projetos/x/falta.webp", alt: "x" }]` → erro contém `"imagem não encontrada: /projetos/x/falta.webp"`;
- item de galeria com `alt: ""` → erro contém `"alt vazio"`;
- dois problemas juntos → a mensagem tem as duas linhas.

`tests/unit/projects.test.ts` (com os MDX reais, importados via `@mdx-js/rollup`):
- `getProjects().map(p => p.slug)` é `["aeb-transporte", "bc-consultoria"]`;
- `getProject("nao-existe")` é `null`;
- `getAdjacentProject("bc-consultoria").slug` é `"aeb-transporte"`;
- todo arquivo `.mdx` em `content/projetos/` está no registro (compara `fs.readdirSync` com os `fileSlug`s).

- [ ] **Step 2: Rodar e confirmar que falham**

Run: `npm test -- projects`
Expected: FAIL (módulos inexistentes).

- [ ] **Step 3: Implementar a validação, o registro e o MDX**

`mdx-components.tsx` exporta `useMDXComponents` mapeando `h2` (Geist 700, `clamp(24px,3vw,32px)`, `mt-12`), `p` (`text-text`, 17px, `max-w-[62ch]`), `ul/li` (marcador em `--border`), `a` (`text-accent`; externo com `target="_blank" rel="noopener noreferrer"`) e `strong`.

- [ ] **Step 4: Escrever os dois cases**

Ordem obrigatória do corpo: `## Problema`, `## Solução`, `## Destaques` (lista de 3 a 5 itens), `## Resultado`. A galeria não entra no corpo (vem de `meta.gallery`).

`aeb-transporte.mdx`: fonte = `D:\aeb-transporte\README.md`. meta: `title "AEB Transporte"`, `subtitle "Chamada e embarque do ônibus universitário de Batatais"`, `year 2026`, `role "Desenvolvimento full-stack"`, `kind "sistema"`, `stack ["Python", "FastAPI", "SQLite", "Turso", "JavaScript", "JWT"]`, sem `liveUrl` (exige login), `order 1`, `published true`, galeria `chamada`, `rotas`, `celular`, `pdf`, com `alt` descritivo dizendo "dados fictícios". Fatos que o texto precisa cobrir: associação de estudantes que leva universitários de Batatais às faculdades da região; 4 perfis (administrador, representante, motorista, aluno); chamada de ida e volta sincronizada a cada minuto; reset automático diário às 15:00 (horário de Brasília); relatório de embarque em PDF agrupado por ponto; gestão de rotas, pontos e faculdades; LGPD (PBKDF2 com 600.000 iterações, JWT com expiração de 24h, consultas parametrizadas); fluxo issue → branch → PR com CI; no ar desde outubro de 2026. Não inventar números de uso.

`bc-consultoria.mdx`: fonte = repositório `bc_consultoria` (`index.html`). meta: `title "Bergamo & Canavez"`, `subtitle "Site institucional de assessoria e consultoria jurídica"`, `year 2026`, `role "Design e desenvolvimento"`, `kind "site"`, `stack ["HTML", "CSS", "JavaScript"]`, sem `liveUrl`, `order 2`, `published true`, galeria `servicos`, `celular`. Fatos: escritório de Batatais/SP que também atende on-line; seções de áreas de atuação, sobre os sócios, atendimento on-line e contato; tipografia Playfair Display + DM Sans; animações de entrada; página de política de privacidade. Autorização do escritório registrada em `docs/insumos.md`.

- [ ] **Step 5: Rodar e confirmar que passam**

Run: `npm test && npm run build`
Expected: PASS; build sem erros.

- [ ] **Step 6: Commit**

```bash
git add lib/projects.ts lib/validate-projects.ts mdx-components.tsx content/projetos next.config.ts tests/unit
git commit -m "feat: cases em MDX com validação no build"
```

---

### Task 5: Página inicial (cartão, hero, serviços, contato)

**Files:**
- Create: `components/icons.tsx`, `components/profile-card.tsx`, `components/section-title.tsx`, `components/hero.tsx`, `components/metric.tsx`, `components/service-card.tsx`, `components/contact-links.tsx`, `components/skip-link.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx` (inserir `<SkipLink/>` como primeiro filho do `<body>`)
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `perfil`, `whatsappUrl`, `mailtoUrl`, `getProjects`.
- Produces:
  - `SectionTitle({ id, linhas: [string, string], as?: "h1" | "h2" })`: linha 1 em `text-text`, linha 2 em `text-title-dim`, em blocos.
  - `Metric({ metric }: { metric: Metric })`: renderiza `prefix + value + suffix` e o label; recebe animação na Task 8.
  - `ContactLinks({ contato })`: pílula branca do WhatsApp (botão principal) e pílulas com contorno para e-mail, LinkedIn e GitHub; não renderiza o canal ausente.
  - Âncoras: `#inicio` (hero), `#servicos`, `#projetos`, `#contato`; `<main id="conteudo">`.
  - `icons.tsx`: `GithubIcon`, `LinkedinIcon`, `WhatsappIcon` (SVG 24×24, `currentColor`, `aria-hidden`).

- [ ] **Step 1: Escrever os testes que falham** (`tests/e2e/home.spec.ts`, rodam nos dois projetos)

- `getByRole("heading", { level: 1 })` contém "Desenvolvedor" e "full-stack";
- `getByText("Caio Canavez").first()` visível; `getByText("Estagiário de TI · Prefeitura de Batatais")` visível;
- `#servicos` contém "Sistemas web sob medida" e "Sites institucionais";
- link "WhatsApp" com `href` começando por `https://wa.me/5516992647064?text=`;
- link de e-mail com `href` começando por `mailto:caiocanavezc@gmail.com`;
- métricas "+10" e "1 ano" visíveis;
- primeiro `Tab` foca o link "Pular para o conteúdo"; `Enter` leva o foco ao `#conteudo`;
- sem rolagem horizontal em 320×640 e em 390×844: `scrollWidth <= clientWidth` de `document.documentElement`;
- no projeto desktop, o cartão de perfil continua visível depois de `window.scrollTo(0, 1500)` (sticky).

- [ ] **Step 2: Rodar e confirmar que falham**

Run: `npm run test:e2e -- home`
Expected: FAIL.

- [ ] **Step 3: Implementar os componentes e montar `app/page.tsx`**

- Grade: `lg:grid lg:grid-cols-[340px_minmax(0,680px)] lg:gap-16 lg:justify-center`, `px-4` no celular; cartão com `lg:sticky lg:top-24 lg:self-start`.
- Cartão (`bg-surface`, `border border-border`, `rounded-2xl`, `p-6`): avatar redondo de 96px (`next/image`, `priority`) ou iniciais "CC" em Geist Mono quando `avatar` é `null`; nome (Geist 700, 22px); handle e cidade em `text-muted`; bio; lista "Agora" com ícones lucide `Briefcase` e `GraduationCap` e um ponto verde `#00BA7C` antes do primeiro item; linha de ícones de redes (44×44).
- Hero: `SectionTitle as="h1"` com `heroTitulo`, parágrafo `text-muted` e `Metric`s em linha (Geist Mono 40px para o número).
- Serviços: 2 `ServiceCard`s (grid de 2 colunas a partir de `sm`), com ícones lucide `LayoutDashboard`/`Globe`, título, texto e link "Ver um exemplo →" para `/projetos/<exemploSlug>`.
- Projetos: placeholder `<section id="projetos">` com `SectionTitle linhas={["Projetos", "recentes"]}`, preenchido na Task 6; a seção não renderiza se `getProjects()` vier vazio.
- Contato: `SectionTitle linhas={["Vamos", "conversar"]}`, uma frase (`Tem um sistema ou site em mente? Me chama no WhatsApp ou por e-mail.`) e `ContactLinks`.
- Títulos das outras seções: `["O que", "eu faço"]` para serviços.

- [ ] **Step 4: Rodar e confirmar que passam**

Run: `npm run test:e2e -- home`
Expected: PASS nos dois projetos.

- [ ] **Step 5: Commit**

```bash
git add components app tests/e2e/home.spec.ts
git commit -m "feat: página inicial com cartão de perfil, hero, serviços e contato"
```

---

### Task 6: Lista de projetos, página de case e 404

**Files:**
- Create: `components/project-list.tsx`, `components/case-header.tsx`, `components/case-gallery.tsx`, `app/projetos/[slug]/page.tsx`, `app/not-found.tsx`
- Modify: `app/page.tsx` (seção `#projetos` usa `ProjectList`)
- Test: `tests/e2e/cases.spec.ts`, `tests/e2e/integridade.spec.ts`

**Interfaces:**
- Consumes: `getProjects`, `getProject`, `getAdjacentProject`, `ProjectMeta`.
- Produces: `ProjectList({ projects }: { projects: ProjectMeta[] })`; rota `/projetos/[slug]` com `generateStaticParams` (slugs de `getProjects()`) e `dynamicParams = false`; `CaseHeader({ meta })`; `CaseGallery({ images })`.

- [ ] **Step 1: Escrever os testes que falham**

`tests/e2e/cases.spec.ts`:
- na home, clicar no link "AEB Transporte" leva a `/projetos/aeb-transporte`, com `h1` "AEB Transporte" e headings "Problema", "Solução", "Destaques", "Resultado";
- `/projetos/bc-consultoria` não tem link "Ver online";
- "Próximo case" em `/projetos/bc-consultoria` aponta para `/projetos/aeb-transporte`;
- `/projetos/nao-existe` responde 404, mostra "Página não encontrada" e tem links para `/` e `/#projetos`;
- sem rolagem horizontal em 320×640 nas duas páginas de case.

`tests/e2e/integridade.spec.ts` (home e os dois cases):
- todo `a[target=_blank]` tem `rel` contendo `noopener` e `noreferrer`;
- toda `img` tem `alt` não vazio e, depois de rolar a página inteira, `naturalWidth > 0`.

- [ ] **Step 2: Rodar e confirmar que falham**

Run: `npm run test:e2e -- cases integridade`
Expected: FAIL.

- [ ] **Step 3: Implementar**

- `ProjectList`: `<ul>` com divisórias `border-border`; cada item é um link de bloco inteiro: miniatura 16:10 de 120px (`next/image`, `sizes="120px"`), título (Geist 600, 18px), subtítulo `text-muted`, ano em Geist Mono e ícone `ArrowUpRight` à direita.
- Página de case: `generateMetadata` com `title: "<title> · Caio Canavez"` e `description: subtitle`. Layout de coluna única com máx. 760px: `CaseHeader` (link "← Voltar" para `/#projetos`, h1, subtítulo, linha com ano · papel em Geist Mono, chips de stack com borda `--border` e Geist Mono 13px, botão pílula "Ver online" só com `liveUrl`), capa (`next/image`, `priority`, `rounded-2xl border border-border`), `<Content/>` do MDX, `CaseGallery` (prints empilhados com legenda = `alt`) e o bloco "Próximo case" com a thumb do próximo.
- `not-found.tsx`: título em dois tons `["Página não", "encontrada"]`, uma frase e duas pílulas ("Ir para o início", "Ver projetos").

- [ ] **Step 4: Rodar e confirmar que passam**

Run: `npm run test:e2e`
Expected: PASS em todos os specs.

- [ ] **Step 5: Commit**

```bash
git add components app tests/e2e
git commit -m "feat: lista de projetos, página de case e 404"
```

---

### Task 7: Dock de navegação

**Files:**
- Create: `components/dock.tsx` (client)
- Modify: `app/page.tsx`, `app/projetos/[slug]/page.tsx` (renderizar o dock)
- Test: `tests/e2e/dock.spec.ts`

**Interfaces:**
- Produces: `Dock({ variant, hasProjects }: { variant: "home" | "case"; hasProjects?: boolean })`.
  - `home`: Início (`#inicio`, `Home`), Serviços (`#servicos`, `Briefcase`), Projetos (`#projetos`, `FolderOpen`; omitido se `hasProjects === false`), Contato (`#contato`, `Send`).
  - `case`: Voltar (`/#projetos`, `ArrowLeft`), Contato (`/#contato`, `Send`).
  - Cada item tem `aria-label` com o nome; o item da seção visível recebe `aria-current="true"` (IntersectionObserver com `rootMargin: "-40% 0px -55% 0px"`).

- [ ] **Step 1: Escrever os testes que falham**

- na home, clicar em "Projetos" no dock leva a URL a terminar em `#projetos` e deixa `#projetos` no viewport;
- depois de rolar até `#contato`, o item "Contato" tem `aria-current="true"`;
- no case, "Contato" leva a `/#contato`, com a seção de contato visível;
- o dock fica visível no topo depois de rolar 2000px (`position: fixed`);
- cada item tem caixa de pelo menos 44×44 (`boundingBox()`).

- [ ] **Step 2: Rodar e confirmar que falham**

Run: `npm run test:e2e -- dock`
Expected: FAIL.

- [ ] **Step 3: Implementar**

Pílula `fixed top-4 left-1/2 -translate-x-1/2 z-50`, `bg-surface/80 backdrop-blur-md border border-border rounded-full px-2`, itens de 44×44 com ícone de 20px em `text-muted` (`text-text` quando ativo ou em hover). Adicionar `scroll-margin-top: 96px` nas seções e `html { scroll-behavior: smooth }` dentro de `@media (prefers-reduced-motion: no-preference)`. O conteúdo da página ganha `pt-24` para não ficar sob o dock.

- [ ] **Step 4: Rodar e confirmar que passam**

Run: `npm run test:e2e`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/dock.tsx app tests/e2e/dock.spec.ts
git commit -m "feat: dock de navegação com seção ativa"
```

---

### Task 8: Movimento

**Files:**
- Create: `components/reveal.tsx` (client), `components/reveal-script.tsx`, `lib/use-count-up.ts`
- Modify: `app/globals.css`, `app/layout.tsx`, `components/metric.tsx`, `components/project-list.tsx`, `components/case-header.tsx`, `next.config.ts`
- Test: `tests/e2e/movimento.spec.ts`, `tests/unit/count-up.test.ts`

**Interfaces:**
- Produces:
  - `Reveal({ children, delay?: number, as?: keyof JSX.IntrinsicElements })`: coloca `data-reveal` e `style="--reveal-delay: <delay>ms"`.
  - `RevealScript`: `<script>` inline no `<head>` que adiciona a classe `js` ao `<html>`. Um único IntersectionObserver (em `Reveal`, compartilhado via módulo) adiciona `data-revealed` e para de observar.
  - `countUpValue(progress: number, target: number): number` (pura, com easing `1 - (1 - p)^3`, arredondada) e o hook `useCountUp(target: number, durationMs = 900): number`.

- [ ] **Step 1: Escrever os testes que falham**

`tests/unit/count-up.test.ts`: `countUpValue(0, 10) === 0`; `countUpValue(1, 10) === 10`; `countUpValue(0.5, 10) === 9` (`1 - 0.5³ = 0.875` → 8,75 → 9); valores intermediários nunca passam do alvo.

`tests/e2e/movimento.spec.ts`:
- **sem JS** (`test.use({ javaScriptEnabled: false })`): na home, "Caio Canavez", o h1, "Sistemas web sob medida" e "AEB Transporte" estão visíveis e com `opacity` computada `"1"`;
- **reduced motion** (`page.emulateMedia({ reducedMotion: "reduce" })`): logo após o `goto`, a métrica mostra "+10" sem esperar e nenhum `[data-reveal]` tem `opacity` diferente de `"1"`;
- **padrão:** depois de rolar até `#contato`, os `[data-reveal]` daquela seção têm `data-revealed`.

- [ ] **Step 2: Rodar e confirmar que falham**

Run: `npm test -- count-up && npm run test:e2e -- movimento`
Expected: FAIL.

- [ ] **Step 3: Implementar**

CSS (em `globals.css`):
```css
@media (prefers-reduced-motion: no-preference) {
  .js [data-reveal]:not([data-revealed]) { opacity: 0; transform: translateY(12px); }
  .js [data-reveal] { transition: opacity 400ms ease-out var(--reveal-delay, 0ms), transform 400ms ease-out var(--reveal-delay, 0ms); }
}
```
- Aplicar `Reveal` em cada seção da home, em cada item da `ProjectList` (`delay = index * 60`, máx. 300) e nos blocos do case.
- `Metric`: usa `useCountUp` só depois de entrar na tela e só sem reduced-motion (`matchMedia`); o HTML do servidor já traz o valor final.
- Hover do item de projeto: miniatura `scale(1.03)`, seta `translate(4px, -4px)`, fundo `--surface`, tudo em 200ms; pílulas `active:scale-[0.97]`. Tudo dentro de `motion-safe:`.
- **Transição home → case:** ativar `experimental: { viewTransition: true }` no `next.config.ts` e envolver a thumb (na lista) e a capa (no case) com o componente de View Transition do React, com `name={\`capa-${slug}\`}`. O React 19.3.1 exporta esse componente como `ViewTransition` ou `unstable_ViewTransition`; conferir com `node -e "console.log(Object.keys(require('react')).filter(k=>/ViewTransition/.test(k)))"` e usar o que existir. Se nenhum existir, não fazer a transição e registrar isso no PR. Navegadores sem suporte navegam normalmente.

- [ ] **Step 4: Rodar e confirmar que passam**

Run: `npm test && npm run test:e2e`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components lib/use-count-up.ts app next.config.ts tests
git commit -m "feat: animações de entrada, contagem e transição para o case"
```

---

### Task 9: SEO e compartilhamento

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/projetos/[slug]/opengraph-image.tsx`, `lib/og.tsx`, `components/person-jsonld.tsx`
- Modify: `app/layout.tsx` (`metadataBase: new URL(siteUrl(process.env))`, título padrão `Caio Canavez · Desenvolvedor full-stack`, `template: "%s"`, descrição = `perfil.bio`, `openGraph.locale: "pt_BR"`), `app/page.tsx` (`alternates.canonical: "/"` e `<PersonJsonLd/>`), `app/projetos/[slug]/page.tsx` (`alternates.canonical`)
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `siteUrl`, `getProjects`, `perfil`.
- Produces: `ogImage({ titulo, subtitulo }): ImageResponse` (1200×630, fundo `#000`, título em Geist Bold `#E7E9EA` 72px, subtítulo `#71767B` 32px, rodapé "canavez" em Geist Mono). A fonte é lida de `node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf` (confirmar o caminho no pacote instalado).

- [ ] **Step 1: Escrever os testes que falham**

- `/sitemap.xml` contém `<loc>` da home, de `/projetos/aeb-transporte` e de `/projetos/bc-consultoria`;
- `/robots.txt` contém `Allow: /` e `Sitemap: ` seguido da URL que termina em `/sitemap.xml`;
- a home tem `meta[property="og:image"]` cujo `content` responde 200 com `content-type` `image/png`; idem no case AEB;
- a home tem `script[type="application/ld+json"]` cujo JSON tem `@type: "Person"`, `name: "Caio Canavez"` e `sameAs` com os URLs do LinkedIn e do GitHub;
- o `<title>` do case AEB é `AEB Transporte · Caio Canavez`.

- [ ] **Step 2: Rodar e confirmar que falham**

Run: `npm run test:e2e -- seo`
Expected: FAIL.

- [ ] **Step 3: Implementar**

`sitemap.ts` e `robots.ts` usam `siteUrl(process.env)`. As imagens OG são geradas estaticamente no build (`generateStaticParams` também no `opengraph-image.tsx` do case).

- [ ] **Step 4: Rodar e confirmar que passam**

Run: `npm run test:e2e`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app lib/og.tsx components/person-jsonld.tsx tests/e2e/seo.spec.ts
git commit -m "feat: metadata, Open Graph, sitemap, robots e JSON-LD"
```

---

### Task 10: Portão de qualidade, PR e Vercel

**Files:**
- Create: `tests/e2e/a11y.spec.ts`
- Modify: `README.md` (seção "Publicação")

- [ ] **Step 1: Escrever o teste de acessibilidade**

Para `/`, `/projetos/aeb-transporte` e `/projetos/bc-consultoria`, nos dois projetos: `new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()` → zero violações com `impact` `serious` ou `critical`. Rolar a página inteira antes de analisar, para que tudo esteja revelado.

- [ ] **Step 2: Rodar, corrigir o que aparecer e rodar de novo**

Run: `npm run test:e2e -- a11y`
Expected: PASS. As correções entram no componente de origem, nunca com regra desligada no axe.

- [ ] **Step 3: Rodar a suíte inteira**

Run: `npm run lint && npm run typecheck && npm test && npm run test:e2e`
Expected: tudo PASS.

- [ ] **Step 4: Lighthouse**

Run: `npm run build && npm run start -- -p 3100` e, em outro terminal, `npx lighthouse@latest http://localhost:3100 --preset=desktop --output=json --output-path=./lh-desktop.json --chrome-flags="--headless"` e o mesmo sem `--preset` (celular) em `lh-mobile.json`; repetir para `/projetos/aeb-transporte`.
Expected: Performance, Acessibilidade, Boas práticas e SEO ≥ 90 nos quatro relatórios. Não commitar os JSON (adicionar `lh-*.json` ao `.gitignore`). Colar as notas no PR.

- [ ] **Step 5: Conferência visual**

Capturar home e case AEB em 1440×900 e 390×844 com Playwright, abrir as imagens e conferir: nada cortado, nada colado na borda, dock sem cobrir títulos e prints só com nomes "Exemplo".

- [ ] **Step 6: README, commit e PR**

README "Publicação": importar `caiocanavezc-bit/canavez.dev` em vercel.com/new (framework Next.js, sem variáveis de ambiente). Quando o domínio for comprado, adicionar `canavez.dev` em Settings → Domains e definir `NEXT_PUBLIC_SITE_URL=https://canavez.dev`.

```bash
git add tests/e2e/a11y.spec.ts README.md .gitignore
git commit -m "test: acessibilidade com axe e instruções de publicação"
git push -u origin feat/v1-site
gh pr create --base main --title "feat: canavez.dev v1" --body "<tipo, resumo, desvios deliberados da spec, notas do Lighthouse, checklist de testes>"
```
A descrição do PR termina com `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

- [ ] **Step 7: Vercel (depende do Caio)**

Com a conta da Vercel criada, o Caio importa o repositório. O deploy de preview do PR precisa abrir a home e os dois cases sem erro; depois do merge na `main`, o deploy de produção fica em `https://<projeto>.vercel.app`.
