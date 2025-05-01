'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import MermaidErrorFallback from './MermaidErrorFallback'; // Import the fallback component
// Remove Script import
// import Script from 'next/script';

// Define a type for the global mermaid object, or use any if types aren't installed
declare global {
  interface Window { 
    mermaid?: {
      run: (options: { nodes: HTMLElement[] }) => void;
      initialize: (config: any) => void;
      // Add other methods you might use
    };
  } 
}

// Define Mermaid type structure (or import from @types/mermaid if installed)
type MermaidApi = {
  run: (options: { nodes: HTMLElement[] }) => void;
  initialize: (config: any) => void;
  // Add other methods as needed
};

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
const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
    console.log('chart', chart);
  const containerRef = useRef<HTMLPreElement>(null);
  const uniqueId = id || `mermaid-diagram-${React.useId()}`;
  // Use a ref to hold the dynamically imported mermaid instance
  const mermaidRef = useRef<MermaidApi | null>(null);
  // State to trigger re-render after import completes
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [hasError, setHasError] = useState(false); // State to track rendering errors
  const [isRendered, setIsRendered] = useState(false); // State to track if rendering was successful

  useEffect(() => {
    // Flag to prevent import if already loaded or component unmounted
    let didCancel = false;

    const loadMermaid = async () => {
      console.log('Attempting to dynamically import Mermaid...', uniqueId);
      try {
        // Use the specific ESM build path
        // @ts-ignore - TypeScript cannot analyze remote modules
        const mermaidModule = await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
        // The actual API might be on the default export
        const mermaid = mermaidModule.default || mermaidModule;
        
        if (!didCancel) {
            console.log('Mermaid library imported successfully:', uniqueId, mermaid);
             // Initialize Mermaid (optional, can be done once globally if preferred)
            // mermaid.initialize({ startOnLoad: false });
            mermaidRef.current = mermaid;
            setIsLibraryLoaded(true);
            setHasError(false); // Reset error state on successful load
        }
      } catch (error) {
          if (!didCancel) {
             console.error('Failed to dynamically import Mermaid:', error, uniqueId);
             // Optionally set error state here too if library load fails critically
             // setHasError(true);
          }
      }
    };

    // Only attempt import if not already loaded
    if (!mermaidRef.current) {
        loadMermaid();
    }

    // Cleanup function to set flag if component unmounts during import
    return () => {
      didCancel = true;
    };
  }, [uniqueId]); // Run only once on mount

  useEffect(() => {
    // Render/re-render the chart when the library is loaded and the chart changes
    if (isLibraryLoaded && mermaidRef.current && containerRef.current) {
        console.log('Rendering Mermaid diagram with imported library:', uniqueId);
        const mermaid = mermaidRef.current;
        const element = containerRef.current;

        // Reset states before attempting to render
        setHasError(false);
        setIsRendered(false);

        // Ensure the container is clean before rendering
        element.innerHTML = chart; // Set content for mermaid to process
        element.removeAttribute('data-processed');

        try {
          mermaid.run({ nodes: [element] });
          // Ensure visibility is set correctly after successful render
          element.style.visibility = 'visible';
          setIsRendered(true); // Mark rendering as successful
        } catch (error) {
          console.error('Mermaid rendering failed:', error, uniqueId);
          // Set error state to true on failure
          setHasError(true);
          setIsRendered(false); // Mark rendering as failed
          // Clear the container content on error to prevent showing raw code or old diagrams
          element.innerHTML = '';
          // Hide the container to avoid empty space if needed, or let fallback handle layout
          element.style.visibility = 'hidden';
        }
    } else if (isLibraryLoaded && !containerRef.current) {
        // Handle case where ref might be null unexpectedly after load
        console.warn('Mermaid container ref not available after library load:', uniqueId);
        setHasError(true); // Indicate an error state
        setIsRendered(false);
    }
  }, [isLibraryLoaded, chart, uniqueId]); // Depend on load state and chart content

  // Download handler
  const handleDownload = useCallback(() => {
    if (!containerRef.current || !isRendered) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) {
      console.error('Could not find SVG element to download.');
      // Optionally, show a user-facing error message
      return;
    }

    // Serialize the SVG
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    // Add XML declaration and potentially namespace if missing (often needed for standalone SVGs)
    if (!svgString.startsWith('<?xml')) {
      svgString = '<?xml version="1.0" standalone="no"?>\n' + svgString;
    }
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
        // Add namespace if it's missing from the root svg tag
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }


    // Create a Blob
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

    // Create an object URL
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uniqueId}.svg`; // Or a more user-friendly name
    document.body.appendChild(a); // Append to body to ensure click works in all browsers
    a.click();

    // Clean up: remove anchor and revoke URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  }, [isRendered, uniqueId]); // Depend on render status and id

  // Conditional rendering: Show fallback on error, otherwise the diagram container
  if (hasError) {
    return <MermaidErrorFallback />;
  }

  // Render the container pre element (initially hidden, made visible on success)
  return (
    <div className="relative group"> {/* Added relative positioning wrapper */}
        <pre
          ref={containerRef}
          id={uniqueId}
          className="mermaid" // Ensure mermaid class is present for mermaid.run()
          // Hide until library loaded and rendered successfully
          style={{ visibility: (isLibraryLoaded && !hasError) ? 'visible' : 'hidden' }}
        >
          {/* Keep chart content here only initially for mermaid.run() to process,
              It gets replaced by the SVG during mermaid.run */}
          {chart}
        </pre>
        {/* Download Button - shown only when rendered successfully */}
        {isRendered && !hasError && (
            <button
                onClick={handleDownload}
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Download SVG"
                aria-label="Download diagram as SVG"
            >
               {/* Simple download icon (replace with SVG icon component if available) */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
            </button>
        )}
        {/* Optional: Show loading indicator */}
        { !isLibraryLoaded && !hasError && <div className="text-center p-4">Loading Diagram...</div> }
     </div>
  );
};

export default MermaidDiagram; 