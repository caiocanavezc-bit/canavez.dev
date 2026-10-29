// Os cases exportam `meta` além do componente padrão (tipado em @types/mdx).
declare module "*.mdx" {
  export const meta: unknown;
}
