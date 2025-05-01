import Image from "next/image";
import { ImageGenerationResult } from "@/lib/tools/generateImage";

interface ImageResultProps {
  result: ImageGenerationResult;
}

export function ImageResult({ result }: ImageResultProps) {
  if (!result.success) {
    return (
      <div className="w-full max-w-md mx-auto p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-sm font-medium text-red-600">
          Error generating image
        </p>
        <p className="text-sm text-red-500">
          {result.error || "Unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {result.arweaveUrl ? (
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-md border border-gray-200">
            <Image
              src={result.arweaveUrl}
              alt="Generated image"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : (
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            {result.message || "Image generated but storage URL not available."}
          </p>
        </div>
      )}
    </div>
  );
}
