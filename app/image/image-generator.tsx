"use client";

import type React from "react";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useGenerateImage } from "@/hooks/useGenerateImage";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const {
    generateImage,
    isGenerating,
    generatedImage,
    error,
    arweaveUri,
    smartAccount,
    transactionHash,
  } = useGenerateImage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await generateImage(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <div className="space-y-8">
      {!isGenerating && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="A salamander at sunrise in a forest pond in the Seychelles..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-24"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={!prompt.trim()}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Image
          </Button>
        </form>
      )}

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {isGenerating && (
        <Card>
          <CardContent className="p-2">
            <div className="relative aspect-square max-h-[600px] w-full overflow-hidden rounded-md bg-gray-100 animate-pulse flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm">Generating image...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isGenerating && generatedImage && (
        <Card>
          <CardContent className="p-2">
            <div className="relative aspect-square max-h-[600px] w-full overflow-hidden rounded-md">
              <Image
                src={generatedImage}
                alt={prompt}
                fill
                className="object-contain"
                priority
              />
            </div>
            {arweaveUri && (
              <div className="mt-4 text-center">
                <p className="text-sm">Stored permanently on Arweave:</p>
                <a
                  href={arweaveUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {arweaveUri}
                </a>
              </div>
            )}
            {smartAccount && (
              <div className="mt-4 text-center">
                <p className="text-sm">Smart Account:</p>
                <p>{smartAccount.address}</p>
              </div>
            )}
            {transactionHash && (
              <div className="mt-4 text-center">
                <p className="text-sm">Transaction Hash:</p>
                <a
                  href={`https://basescan.org/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {transactionHash}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
