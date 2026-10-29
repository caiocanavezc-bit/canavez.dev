# canavez.dev — Especificação de design

- **Data:** 2026-10-29
- **Autor:** Caio Canavez
- **Status:** aprovado em conversa, aguardando revisão desta spec

## 1. Objetivo

Portfólio pessoal do Caio Canavez em `canavez.dev`, voltado a dois públicos ao mesmo tempo:

- **Recrutadores:** mostrar que o Caio entrega sistemas reais, com stack, decisões técnicas e cuidados de segurança.
- **Clientes freelance:** mostrar o que ele faz, trabalhos entregues e um caminho curto até o WhatsApp.

**Sucesso significa:**

1. Um visitante entende em menos de 10 segundos quem é o Caio, o que ele faz e como falar com ele.
2. Cada case explica problema, solução e resultado sem o visitante precisar abrir o código.
3. Lighthouse ≥ 90 em Performance, Acessibilidade, Boas práticas e SEO, no desktop e no celular.
4. Texto com contraste WCAG AA em todo o site; navegação completa por teclado.
5. O código serve, ele próprio, de amostra de trabalho: limpo, tipado e testado.

## 2. Referências e o que vem de cada uma

| Referência | O que entra no canavez.dev |
|---|---|
| [sawad.framer.website](https://sawad.framer.website/) (template Framer da Templyo) | **Layout:** cartão de perfil fixo à esquerda, conteúdo rolando à direita; dock de ícones flutuante no topo; título de seção em duas linhas de cores diferentes; números no hero; dois cards de serviço; lista de projetos com miniatura e seta |
| Perfil do X em modo escuro | **Estética:** preto puro, texto branco e cinza, bordas finas, botão principal em pílula branca, azul só em links, sem cards coloridos, sem caixa alta |
| [ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com), [magicuidesign/portfolio](https://github.com/magicuidesign/portfolio), [once-ui-system/magic-portfolio](https://github.com/once-ui-system/magic-portfolio) | **Código:** Next.js App Router, conteúdo centralizado em arquivo de dados, cases em MDX, animações de entrada sutis com `motion` |

**Problemas do Sawad que não repetimos:** cinza de texto com contraste baixo; projetos sem página de detalhe; botões flutuantes tapando o conteúdo no celular; formulário de contato sem destino.

## 3. Escopo

### Entra na v1

- Página inicial com cartão de perfil, hero, serviços, projetos e contato.
- Página de case para cada projeto.
- Dock de navegação.
- 404, `sitemap.xml`, `robots.txt` e imagem Open Graph por página.

### Fica fora da v1

- Blog ou notas.
- Seção de experiência / linha do tempo e download de currículo.
- Grade de stack/ferramentas (a stack aparece dentro de cada case).
- Formulário de contato, backend, banco, login, analytics pago.
- Tema claro e versão em inglês.

## 4. Conteúdo

### 4.1 Perfil (`content/perfil.ts`)

| Campo | Valor inicial |
|---|---|
| Nome | Caio Canavez |
| Handle exibido | `@canavez` |
| Título do hero | linha 1 "Desenvolvedor", linha 2 "full-stack" |
| Bio curta (cartão) | uma frase, até 120 caracteres |
| Parágrafo do hero | até 3 linhas, sobre sistemas web sob medida |
| Cidade | Batatais, SP |
| Linha "Agora" (cartão, abaixo da bio) | dois itens curtos: ocupação atual e formação (ícone + texto) |
| Números | só valores verificáveis (ver regra abaixo) |
| Redes | WhatsApp, e-mail, LinkedIn, GitHub (`caiocanavezc-bit`) |

Os textos aprovados e os valores de cada campo estão em `docs/insumos.md`, que é a fonte para preencher `content/perfil.ts`.

**Regra dos números:** nenhum número inventado. Cada métrica em `perfil.ts` tem um campo `fonte` (texto curto dizendo de onde vem). Enquanto o Caio não confirmar outros valores, o hero mostra apenas métricas contáveis no próprio site, como a quantidade de cases publicados.

### 4.2 Serviços (2 cards)

1. **Sistemas web sob medida:** painéis, controle de acesso por perfil, relatórios em PDF, integração com banco na nuvem.
2. **Sites institucionais:** sites rápidos, responsivos e otimizados para busca, para negócios e profissionais.

Cada card: ícone (lucide), título, duas linhas de texto e link "Ver um exemplo" que aponta para o case correspondente (1 → AEB Transporte, 2 → BC Consultoria).

### 4.3 Cases (`content/projetos/<slug>.mdx`)

| Slug | Projeto | Tipo | Observação |
|---|---|---|---|
| `aeb-transporte` | AEB Transporte: chamada e embarque universitário | Sistema web (Python/FastAPI, SQLite/Turso, Vanilla JS) | Em produção no Render. Prints **somente com dados fictícios** |
| `bc-consultoria` | Bergamo & Canavez: site institucional de assessoria jurídica | Site institucional (HTML/CSS/JS) | Publicado **somente após OK por escrito do escritório**, porque mostra nomes e fotos de pessoas |

Ordem na lista: AEB Transporte primeiro, BC Consultoria depois.

**Metadados obrigatórios de cada case** (exportados do MDX como `export const meta`):

```ts
type ProjectMeta = {
  slug: string;          // igual ao nome do arquivo
  title: string;         // "AEB Transporte"
  subtitle: string;      // uma linha, aparece na lista
  year: number;
  role: string;          // ex.: "Desenvolvimento full-stack"
  kind: "sistema" | "site";
  stack: string[];       // chips
  liveUrl?: string;      // omitido quando o sistema exige login ou não é público
  cover: string;         // caminho em /public/projetos/<slug>/
  thumb: string;         // miniatura da lista (16:10)
  order: number;
  published: boolean;    // false esconde da lista, do sitemap e do build
};
```

**Corpo do case, nesta ordem:** Problema → Solução → Destaques (3 a 5 itens) → Resultado → Galeria de prints.

Conteúdo do AEB Transporte (base: README do repositório): 4 perfis de acesso (RBAC), chamada de ida e volta com sincronização a cada minuto, reset automático diário às 15:00 (America/Sao_Paulo), relatório de embarque em PDF, gestão de rotas e pontos, conformidade com LGPD (PBKDF2 600.000 iterações, JWT, consultas parametrizadas), fluxo issue → branch → PR com CI.

## 5. Arquitetura

### 5.1 Stack

- Next.js (App Router) com TypeScript estrito, todas as rotas geradas estaticamente.
- Tailwind CSS 4, com os tokens de cor e espaçamento em CSS variables.
- `geist` (Geist Sans e Geist Mono) via `next/font`.
- `motion` para animações; `lucide-react` para ícones; `@next/mdx` para os cases.
- Hospedagem: Vercel, domínio `canavez.dev`.

As versões exatas são fixadas no momento da instalação (última estável de cada pacote) e registradas no `package-lock.json`.

### 5.2 Estrutura de pastas

```
app/
  layout.tsx              fontes, metadata base, <Dock/>
  page.tsx                página inicial
  projetos/[slug]/page.tsx  página de case (generateStaticParams)
  projetos/[slug]/opengraph-image.tsx
  opengraph-image.tsx
  not-found.tsx
  sitemap.ts
  robots.ts
components/
  profile-card.tsx        cartão fixo (desktop) / topo (celular)
  dock.tsx                navegação flutuante
  section-title.tsx       título em duas linhas e duas cores
  hero.tsx                título, parágrafo, métricas
  metric.tsx              número que conta ao aparecer
  service-card.tsx
  project-list.tsx        lista de cases com miniatura
  case-header.tsx         nome, ano, papel, chips, link
  case-gallery.tsx
  contact-links.tsx       pílulas WhatsApp / e-mail / LinkedIn / GitHub
  reveal.tsx              wrapper de animação de entrada
content/
  perfil.ts
  projetos/aeb-transporte.mdx
  projetos/bc-consultoria.mdx
lib/
  projects.ts             lê os MDX, valida meta, ordena e filtra published
  links.ts                monta link do WhatsApp com mensagem pronta
public/projetos/<slug>/   capa, miniatura e prints (AVIF ou WebP)
tests/
  unit/                   Vitest
  e2e/                    Playwright
```

Cada componente tem uma única responsabilidade e recebe dados por props; só `lib/projects.ts` sabe onde os arquivos de conteúdo estão.

### 5.3 Fluxo de dados

1. No build, `lib/projects.ts` importa os MDX de `content/projetos/`, lê `meta`, valida os campos obrigatórios e **falha o build** se algum estiver ausente ou se `slug` não bater com o nome do arquivo.
2. A home recebe a lista ordenada de cases publicados; `generateStaticParams` gera uma página por case publicado.
3. `perfil.ts` alimenta o cartão, o hero, os serviços e o contato.
4. Nenhuma chamada de rede em tempo de execução.

## 6. Visual

### 6.1 Tokens

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#000000` | fundo |
| `--surface` | `#16181C` | cartão de perfil, hover de itens |
| `--border` | `#2F3336` | bordas e divisórias de 1px |
| `--text` | `#E7E9EA` | texto principal |
| `--muted` | `#71767B` | texto secundário (contraste 4,6:1 sobre preto, passa AA) |
| `--title-dim` | `#5B5F63` | 2ª linha dos títulos de seção e do hero (contraste 3,2:1, passa AA para texto grande; usado só em texto ≥ 24px) |
| `--accent` | `#1D9BF0` | links e foco |
| `--button` | `#EFF3F4` sobre texto `#0F1419` | botão principal em pílula |

### 6.2 Tipografia

- Geist Sans 700 nos títulos, sem caixa alta, `letter-spacing` levemente negativo.
- Tamanhos com `clamp()`: hero de 44px (celular) a 88px (desktop); títulos de seção de 36px a 64px.
- Geist Mono para anos, métricas e chips de stack.
- Texto corrido de 16px a 17px, altura de linha 1,6, largura máxima de 62 caracteres.

### 6.3 Layout

- **Desktop (≥ 1024px):** grade de duas colunas, cartão com `position: sticky` numa coluna de 340px; conteúdo com largura máxima de 680px.
- **Celular:** uma coluna, cartão no topo, margem lateral de 16px, sem rolagem horizontal até 320px de largura.
- **Dock:** pílula centralizada no topo, com fundo `--surface` translúcido e `backdrop-filter`. Na home os ícones levam às âncoras `#inicio`, `#servicos`, `#projetos`, `#contato` e marcam a seção visível; no case, mostram "voltar" e "contato". Áreas de toque de pelo menos 44px.

### 6.4 Movimento

| Elemento | Animação |
|---|---|
| Seções e itens | fade + 12px para cima ao entrarem na tela, uma vez, 400ms, escalonado entre itens |
| Métricas | contagem de 0 ao valor em 900ms ao entrar na tela |
| Item de projeto | miniatura escala 1,03, seta desliza 4px, fundo vira `--surface` |
| Botões e pílulas | escala 0,97 ao clicar |
| Home → case | miniatura da lista vira a capa do case (layout animation do `motion`); sem suporte, fade simples |

Com `prefers-reduced-motion: reduce`, nada se move: o conteúdo aparece já no lugar e as métricas mostram o valor final.

## 7. Contato

- **WhatsApp:** link `https://wa.me/<número>?text=<mensagem>` com mensagem pronta ("Olá, Caio! Vi seu portfólio e quero conversar sobre um projeto."), montado em `lib/links.ts`.
- **E-mail:** `mailto:` com assunto pronto.
- **LinkedIn** e **GitHub:** links externos com `rel="noopener noreferrer"`.
- Botão principal (pílula branca) = WhatsApp; os demais em pílulas com contorno.

## 8. SEO e compartilhamento

- `metadata` por página (título, descrição, canonical em `https://canavez.dev`).
- Imagem Open Graph gerada no build: nome, título e, no case, o nome do projeto.
- `sitemap.ts` lista a home e os cases publicados; `robots.ts` libera tudo e aponta o sitemap.
- Dados estruturados JSON-LD do tipo `Person` na home.
- `lang="pt-BR"`.

## 9. Privacidade e consentimento

- Prints do AEB Transporte vêm de um ambiente com **dados fictícios** criados para isso. Nenhum nome, CPF, telefone ou coordenada GPS real de aluno ou motorista aparece em imagem, texto ou alt.
- O case da BC Consultoria fica com `published: false` até o Caio confirmar o OK do escritório.
- Sem cookies e sem rastreamento de terceiros na v1.

## 10. Erros e casos-limite

- Slug inexistente → página 404 própria, com link para a home e para os projetos.
- Case sem `liveUrl` → o botão "Ver online" não aparece (sem botão desabilitado).
- Imagem ausente → o teste unitário e o build falham antes do deploy.
- Nenhum case publicado → a seção Projetos não é renderizada e o item some do dock.

## 11. Testes e validação

| Camada | Ferramenta | O que verifica |
|---|---|---|
| Tipos e lint | `tsc --noEmit`, ESLint | código compila e segue as regras |
| Conteúdo | Vitest | cada case tem todos os campos de `ProjectMeta`; `slug` = nome do arquivo; `cover` e `thumb` existem em `public/`; `order` sem repetição; métricas têm `fonte` |
| Links | Vitest | `lib/links.ts` gera URL de WhatsApp e `mailto:` corretamente codificadas |
| Ponta a ponta | Playwright (desktop 1440px e celular 390px) | home carrega com nome e seções; cada item da lista abre o case certo; 404 funciona; sem rolagem horizontal em 320px e 390px; dock navega até as âncoras |
| Acessibilidade | `@axe-core/playwright` | zero violações sérias ou críticas na home e nos cases |
| Movimento reduzido | Playwright com `reducedMotion: 'reduce'` | conteúdo visível sem esperar animação; métricas já com valor final |
| Build | `next build` | todas as rotas estáticas geradas sem erro |
| Desempenho | Lighthouse (manual antes do deploy) | ≥ 90 nas 4 categorias |

CI no GitHub Actions roda lint, tipos, Vitest, build e Playwright em cada PR.

## 12. Insumos que o Caio fornece

| Insumo | Enquanto não chegar |
|---|---|
| Foto para o avatar | avatar com as iniciais "CC" em Geist Mono |
| Número de WhatsApp e e-mail públicos | o botão correspondente não é renderizado |
| URL do LinkedIn | o botão não é renderizado |
| Métricas confirmadas | só a contagem de cases (regra da seção 4.1) |
| Prints do AEB com dados fictícios | o case usa a capa gerada com nome e stack do projeto |
| OK do escritório BC + URL publicada | case fica `published: false` |
| Posse do domínio `canavez.dev` | deploy na URL `*.vercel.app` da Vercel |

## 13. Depois da v1

- Carrossel de lançamento do canavez.dev e do case AEB Transporte com a skill `/carrossel` (LinkedIn e Instagram).
- Avaliar blog, linha do tempo de experiência e versão em inglês conforme o uso.
