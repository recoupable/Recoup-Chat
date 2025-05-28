import { Loader2 } from "lucide-react";

export function MermaidDiagramSkeleton() {
  return (
    <div className="relative flex flex-col items-center justify-center p-4 border rounded-md shadow-sm w-full max-w-md min-h-96 mx-auto overflow-hidden">
      {/* Pulsing background placeholder */}
      <div className="absolute inset-0 bg-muted/30 animate-pulse"></div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Please wait, diagram is generating...
        </p>
      </div>
    </div>
  );
}
