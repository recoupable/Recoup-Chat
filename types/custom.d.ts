// Type declarations for modules without type definitions
declare module 'react-syntax-highlighter' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    children?: ReactNode;
    className?: string;
    PreTag?: string | ComponentType<any>;
    [key: string]: any;
  }
  
  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export const Light: ComponentType<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  const vs: any;
  const vscDarkPlus: any;
  const atomDark: any;
  const dracula: any;
  const materialDark: any;
  const materialLight: any;
  const nord: any;
  const okaidia: any;
  const prism: any;
  const solarizedlight: any;
  const tomorrow: any;
  
  export { vs, vscDarkPlus, atomDark, dracula, materialDark, materialLight, nord, okaidia, prism, solarizedlight, tomorrow };
}

// Extend React Markdown types
declare module 'react-markdown' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface ReactMarkdownProps {
    children?: string;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    components?: {
      [key: string]: ComponentType<any>;
    };
    className?: string;
    [key: string]: any;
  }
  
  const ReactMarkdown: ComponentType<ReactMarkdownProps>;
  export default ReactMarkdown;
}

declare module 'remark-gfm' {
  const remarkGfm: any;
  export default remarkGfm;
}

declare module 'rehype-sanitize' {
  const rehypeSanitize: any;
  export default rehypeSanitize;
}

declare module 'slugify' {
  function slugify(string: string, options?: { lower?: boolean; strict?: boolean; [key: string]: any }): string;
  export default slugify;
} 