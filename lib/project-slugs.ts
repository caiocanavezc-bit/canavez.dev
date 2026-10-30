// Slugs dos cases publicados, em ordem. Usado pelo proxy, que não deve importar os MDX.
// tests/unit/projects.test.ts falha se esta lista sair de sincronia com lib/projects.ts.
export const PUBLISHED_SLUGS = ["aeb-transporte", "bc-consultoria"] as const;
