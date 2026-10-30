import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-12 mb-4 text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text" {...props} />
  ),
  p: (props) => <p className="my-4 max-w-[62ch] text-[17px] leading-[1.6] text-text" {...props} />,
  ul: (props) => <ul className="my-4 max-w-[62ch] space-y-2 pl-5 text-[17px] leading-[1.6] marker:text-border list-disc" {...props} />,
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold text-text" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline" {...props} />
    ) : (
      <a href={href} className="text-accent hover:underline" {...props} />
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
