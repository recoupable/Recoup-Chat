import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Using lucide-react for icons

/**
 * Fallback component displayed when a Mermaid diagram fails to render due to syntax errors.
 */
const MermaidErrorFallback: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md text-sm my-4">
      <AlertTriangle className="w-6 h-6 mb-2" />
      <p className="font-semibold">Diagram Rendering Error</p>
      <p className="text-center text-xs mt-1">
        There was an issue rendering this diagram, likely due to invalid syntax.
        Please check the syntax or try regenerating the response.
      </p>
    </div>
  );
};

MermaidErrorFallback.displayName = 'MermaidErrorFallback';

export default MermaidErrorFallback; 