import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import slugify from 'slugify';

interface FormattedTextProps {
  content: string;
  className?: string;
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

// Custom component for expandable sections
const ExpandableSection = ({ summary, children }: { summary: string; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border rounded-md my-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center font-medium"
      >
        <span>{summary}</span>
        <span className="text-gray-500">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
};

export const FormattedText = ({
  content,
  className = "",
}: FormattedTextProps) => {
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [showToc, setShowToc] = useState(false);
  const [processedContent, setProcessedContent] = useState(content);
  
  // Process custom syntax for callouts and expandable sections
  useEffect(() => {
    let newContent = content;
    
    // Process callouts: :::info|warning|error|success This is a callout :::
    newContent = newContent.replace(
      /:::(info|warning|error|success)\s+([\s\S]+?):::/g,
      (_, type, content) => {
        return `<div class="${type}-callout custom-callout">\n\n${content.trim()}\n\n</div>`;
      }
    );
    
    // Process expandable sections: :::details Summary \n Content :::
    newContent = newContent.replace(
      /:::details\s+(.*?)\s*\n([\s\S]+?):::/g,
      (_, summary, content) => {
        return `<details><summary>${summary}</summary>\n\n${content.trim()}\n\n</details>`;
      }
    );
    
    setProcessedContent(newContent);
  }, [content]);
  
  // Extract headings for table of contents
  useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: TableOfContentsItem[] = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = slugify(text, { lower: true, strict: true });
      
      headings.push({ id, text, level });
    }
    
    // Only show TOC if we have at least 3 headings
    setShowToc(headings.length >= 3);
    setTableOfContents(headings);
  }, [content]);

  // Copy to clipboard functionality
  const CopyButton = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    };
    
    return (
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 text-xs font-mono transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    );
  };

  return (
    <div className={`text-sm font-sans max-w-[500px] text-pretty break-words formatted-content ${className}`}>
      {/* Table of Contents */}
      {showToc && (
        <div className="mb-6 p-3 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="text-sm font-semibold mb-2">Table of Contents</h4>
          <nav>
            <ul className="space-y-1">
              {tableOfContents.map((item) => (
                <li 
                  key={item.id} 
                  className="hover:underline cursor-pointer"
                  style={{ marginLeft: `${(item.level - 1) * 16}px` }}
                >
                  <a 
                    href={`#${item.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({children, ...props}) => {
            const id = children ? slugify(children.toString(), { lower: true, strict: true }) : '';
            return (
              <h1 id={id} className="text-2xl font-bold mt-6 mb-4 scroll-mt-16" {...props}>
                <a href={`#${id}`} className="anchor-link">
                  {children}
                </a>
              </h1>
            );
          },
          h2: ({children, ...props}) => {
            const id = children ? slugify(children.toString(), { lower: true, strict: true }) : '';
            return (
              <h2 id={id} className="text-xl font-semibold mt-5 mb-3 scroll-mt-16" {...props}>
                <a href={`#${id}`} className="anchor-link">
                  {children}
                </a>
              </h2>
            );
          },
          h3: ({children, ...props}) => {
            const id = children ? slugify(children.toString(), { lower: true, strict: true }) : '';
            return (
              <h3 id={id} className="text-lg font-semibold mt-4 mb-2 scroll-mt-16" {...props}>
                <a href={`#${id}`} className="anchor-link">
                  {children}
                </a>
              </h3>
            );
          },
          p: ({...props}) => <p className="my-3" {...props} />,
          strong: ({...props}) => <strong className="font-semibold" {...props} />,
          em: ({...props}) => <em className="italic" {...props} />,
          code: ({inline, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const code = String(children).replace(/\n$/, '');
            
            if (!inline) {
              return (
                <div className="relative">
                  {/* @ts-ignore */}
                  <SyntaxHighlighter
                    style={vs}
                    language={language || 'text'}
                    PreTag="div"
                    className="bg-gray-100 p-3 rounded my-3 overflow-x-auto"
                  >
                    {code}
                  </SyntaxHighlighter>
                  <CopyButton code={code} />
                </div>
              );
            }
            
            return (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          hr: ({...props}) => <hr className="my-4 border-t border-gray-200" {...props} />,
          ul: ({...props}) => <ul className="list-disc pl-5 my-3 space-y-1" {...props} />,
          ol: ({...props}) => <ol className="list-decimal pl-5 my-3 space-y-1" {...props} />,
          li: ({...props}) => <li className="ml-2" {...props} />,
          table: ({...props}) => (
            <div className="overflow-x-auto my-4 -mx-4 px-4">
              <table className="min-w-full border-collapse text-sm" {...props} />
            </div>
          ),
          thead: ({...props}) => <thead {...props} />,
          tbody: ({...props}) => <tbody {...props} />,
          tr: ({...props}) => <tr className="border-b border-gray-100" {...props} />,
          th: ({...props}) => <th className="py-2 px-3 text-left font-semibold border-b border-gray-200" {...props} />,
          td: ({...props}) => <td className="py-2 px-3" {...props} />,
          // Add support for callouts/admonitions
          blockquote: ({node, children, ...props}) => {
            // Check if this is a custom callout
            // @ts-ignore
            const className = node?.properties?.className;
            const classArray = className ? (Array.isArray(className) ? className : [className]) : [];
            const isCustomCallout = classArray.some((c) => 
              typeof c === 'string' && c.includes('custom-callout')
            );
            
            if (isCustomCallout) {
              const type = classArray.find((c) => 
                typeof c === 'string' && c.includes('-callout') && !c.includes('custom')
              ) as string || '';
              
              const icon = {
                'info-callout': 'ℹ️',
                'warning-callout': '⚠️',
                'error-callout': '❌',
                'success-callout': '✅',
              }[type] || 'ℹ️';
              
              return (
                <div className={`border-l-4 p-4 my-4 rounded-r ${type}`}>
                  <div className="flex items-start">
                    <span className="mr-2">{icon}</span>
                    <div>{children}</div>
                  </div>
                </div>
              );
            }
            
            // Regular blockquote
            return (
              <blockquote className="border-l-4 border-gray-300 bg-gray-50 p-4 my-4 rounded-r" {...props}>
                {children}
              </blockquote>
            );
          },
          // Support for details/summary (expandable sections)
          details: ({children}) => {
            // Extract summary and content
            let summary = 'Details';
            let content: ReactNode = null;
            
            if (children) {
              // @ts-ignore
              React.Children.forEach(children, (child) => {
                // @ts-ignore
                if (child && typeof child === 'object' && 'type' in child && child.type === 'summary') {
                  // @ts-ignore
                  summary = child.props.children;
                } else {
                  content = child;
                }
              });
            }
            
            return <ExpandableSection summary={summary}>{content}</ExpandableSection>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default FormattedText;
