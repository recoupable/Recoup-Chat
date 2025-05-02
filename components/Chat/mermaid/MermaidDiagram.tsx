'use client';

import React from 'react';
import MermaidErrorFallback from './MermaidErrorFallback'; // Import the fallback component
import { GenerateMermaidDiagramResult } from '@/lib/tools/generateMermaidDiagram';
import { useMermaid } from '@/hooks/useMermaid';

// Define a type for the global mermaid object, or use any if types aren't installed
declare global {
  interface Window {
    mermaid?: {
      run: (options: { nodes: HTMLElement[] }) => void;
      initialize: (config: Record<string, unknown>) => void;
      // Add other methods you might use
    };
  }
}

interface MermaidDiagramProps {
  /** The Mermaid diagram definition string. */
  chart: string;
  /** Optional unique ID for the diagram wrapper. */
  id?: string;
}

/**
 * Renders a Mermaid diagram from a definition string.
 * Dynamically imports the Mermaid library on mount.
 */
const MermaidDiagramInternal: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
  const { isLibraryLoaded, hasError, containerRef, uniqueId } = useMermaid({
    id,
    chart
  });

  // Conditional rendering: Show fallback on error, otherwise the diagram container
  if (hasError) {
    return <MermaidErrorFallback />;
  }

  // Render the container pre element (initially hidden, made visible on success)
  return (
    <pre
      ref={containerRef}
      id={uniqueId}
      className="mermaid"
      // Hide until library loaded and rendered successfully
      style={{ visibility: (isLibraryLoaded && !hasError) ? 'visible' : 'hidden', backgroundColor: 'white', border: 'none', padding: '0' }}
    >
      {chart}
    </pre>
  );
};

const MermaidDiagram = ({ result }: { result: GenerateMermaidDiagramResult }) => {
  const { content, isError } = result;

  if (isError) {
    return <MermaidErrorFallback />;
  }
  const chart = content[0].text;
  const mermaidDiagramWithoutCodeBlock = chart.replace(/```mermaid\n([\s\S]*?)```/g, '$1').trim();

  return <MermaidDiagramInternal chart={mermaidDiagramWithoutCodeBlock} />
}

export default MermaidDiagram; 