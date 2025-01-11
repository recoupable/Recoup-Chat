"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function StartButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://143.198.164.177:3000/api/agentkit/run",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="px-12 py-6 text-lg font-semibold hover:scale-105 transition-transform"
      disabled={isLoading}
    >
      {isLoading ? "Running..." : "Start"}
    </Button>
  );
}
