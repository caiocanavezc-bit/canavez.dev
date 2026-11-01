import type { MDXComponents } from "mdx/types";

// O visual do texto dos cases fica em .cv-body (app/globals.css); aqui só os links externos
// ganham nova aba com rel seguro.
const components: MDXComponents = {
  a: ({ href = "", ...props }) =>
    href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ) : (
      <a href={href} {...props} />
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
