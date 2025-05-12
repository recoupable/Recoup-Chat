import React, { useState, useEffect } from "react";
import { TxtFileGenerationResult } from "@/lib/tools/createTxtFile";

interface TxtFileResultProps {
  result: TxtFileGenerationResult;
}

export function TxtFileResult({ result }: TxtFileResultProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (result.arweaveUrl && !fileContent) {
      setLoading(true);
      setFetchError(null);
      fetch(result.arweaveUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch file from Arweave");
          return res.text();
        })
        .then((text) => {
          setFileContent(text);
          setLoading(false);
        })
        .catch((err) => {
          setFetchError(err.message || "Error fetching file");
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.arweaveUrl]);

  if (!result.success) {
    return (
      <div className="w-full max-w-md mx-auto p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-sm font-medium text-red-600">
          Error generating TXT file
        </p>
        <p className="text-sm text-red-500">
          {result.error || "Unknown error occurred"}
        </p>
      </div>
    );
  }

  const handleDownload = () => {
    if (result.arweaveUrl) {
      window.open(result.arweaveUrl, "_blank");
      return;
    }
  };

  let displayText: string | JSX.Element = "TXT file generated.";
  if (result.arweaveUrl) {
    if (loading) {
      displayText = (
        <span className="text-gray-400">Loading file contents...</span>
      );
    } else if (fetchError) {
      displayText = <span className="text-red-500">{fetchError}</span>;
    } else if (fileContent) {
      displayText = fileContent;
    }
  } else if (result.message) {
    displayText = result.message;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-md bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-gray-700">
              Generated TXT File
            </span>
            <button
              className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleDownload}
              disabled={!result.arweaveUrl}
            >
              Download
            </button>
          </div>
          <div className="max-h-64 overflow-auto whitespace-pre-wrap text-sm font-mono bg-white border rounded p-2">
            {displayText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TxtFileResult;
