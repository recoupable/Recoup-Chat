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
  import { ReactNode } from 'react';
  
  export interface ReactMarkdownProps {
    node?: {
      properties?: {
        className?: string[] | string;
      };
    };
    children?: ReactNode;
    [key: string]: any;
  }
} 