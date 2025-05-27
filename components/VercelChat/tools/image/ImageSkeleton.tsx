import { Loader2 } from "lucide-react";

export function ImageSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100 animate-pulse flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">Generating image...</p>
        <div className="mt-2 text-xs text-gray-400">
          This may take a moment. The image will be revealed when complete.
        </div>
      </div>
    </div>
  );
}
