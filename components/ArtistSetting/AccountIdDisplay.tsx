"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface AccountIdDisplayProps {
  accountId: string;
}

const AccountIdDisplay = ({ accountId }: AccountIdDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy account ID:", err);
    }
  };

  // Truncate account ID for display
  const truncatedId =
    accountId.length > 12
      ? `${accountId.slice(0, 6)}...${accountId.slice(-6)}`
      : accountId;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-grey-dark">Artist ID</span>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-grey-light transition-colors"
      >
        <span className="text-sm font-mono">{truncatedId}</span>
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-grey-dark" />
        )}
      </button>
    </div>
  );
};

export default AccountIdDisplay;
