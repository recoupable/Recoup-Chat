import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { replaceLatexDelimiters } from "@/lib/chat/replaceLatexDelimiters";
import React, { memo, useMemo } from "react";
import markedKatex from "marked-katex-extension";
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';
import MermaidDiagram from '@/components/Chat/ChatMarkdown-v2/mermaid/MermaidDiagram';
import './markdown.css';

// Initialize a new Marked instance with markedHighlight
const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
  {
    breaks: true,
    gfm: true,
  }
);

// Use markedKatex with the new Marked instance
marked.use(
  markedKatex({
    throwOnError: false,
    displayMode: true,
    output: "mathml",
  })
);

// Add custom tokenizer if needed
marked.use({
  walkTokens(token) {
    if (token.type === "text") {
      token.text = token.text.replace(
        /\^\^\^(.*?)\^\^\^/g,
        '<span class="bg-yellow-300 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100 py-0.5 px-1 rounded">$1</span>'
      );
    }
  },
});

const Markdown = memo(
  ({ content }: { content: string }) => {
    const { processedContent, mermaidCharts, imagePrompts } = useMemo(() => {
      const charts: { [key: string]: string } = {};
      const prompts: { [key: string]: string } = {};
      let chartIndex = 0;
      let imageIndex = 0;

      // 1. Pre-process ```mermaid blocks
      let tempContent = content.replace(
        /^```mermaid\s*([\s\S]*?)\n```$/gm, // Match ```mermaid blocks
        "<mermaid>$1</mermaid>" // Convert to <mermaid> tags
      );

      // 2. Process <mermaid> tags
      tempContent = tempContent.replace(
        /<mermaid>([\s\S]*?)<\/mermaid>/g, // Match <mermaid> tags
        (match, chartContent) => {
          const id = `mermaid-placeholder-${chartIndex++}`;
          charts[id] = chartContent.trim();
          // Ensure the placeholder is a block element for proper parsing
          return `<div data-mermaid-id="${id}"></div>`;
        }
      );

      // 3. Process <imageN> tags
      tempContent = tempContent.replace(
        /<image(\d+)>([\s\S]*?)<\/image\1>/g, // Match <imageN>...</imageN>
        (match, _index, promptContent) => {
          const id = `image-placeholder-${imageIndex++}`;
          prompts[id] = promptContent.trim();
          return `<div data-image-prompt-id="${id}"></div>`; // Placeholder for images
        }
      );

      return { processedContent: tempContent, mermaidCharts: charts, imagePrompts: prompts };
    }, [content]);

    const parsedHtml = useMemo(() => {
      const latexProcessed = replaceLatexDelimiters(processedContent);
      return marked.parse(latexProcessed) as string;
    }, [processedContent]);

    const parserOptions: HTMLReactParserOptions = useMemo(() => ({
      replace: (domNode) => {
        if (domNode instanceof Element && domNode.attribs) {
          if (domNode.attribs['data-mermaid-id']) {
            const id = domNode.attribs['data-mermaid-id'];
            const chart = mermaidCharts[id];
            if (chart) {
              return <MermaidDiagram chart={chart} />;
            }
          }
        }
        // Return undefined to let the default parsing happen for other elements
        return undefined;
      },
    }), [mermaidCharts, imagePrompts]);

    const reactElements = useMemo(() => parse(parsedHtml, parserOptions), [parsedHtml, parserOptions]);

    return (
      <div className="prose prose-p:w-full prose-sm prose-pre:bg-transparent dark:prose-invert w-full overflow-hidden">
        {/* <div className="flex flex-wrap -mx-1"> */}
        {reactElements}
        {/* </div> */}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.content === nextProps.content;
  }
);

Markdown.displayName = "Markdown";

export default Markdown;
