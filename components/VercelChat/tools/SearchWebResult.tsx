import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatMarkdown from "@/components/Chat/ChatMarkdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import useContainerHeight from "@/hooks/useContainerHeight";

export interface SearchWebResultType {
  content: {
    text: string;
    type: string;
  }[];
  isError: boolean;
}

const SearchWebResult= ({ result }: { result: SearchWebResultType }) => {
  const [expanded, setExpanded] = useState(false);
  const [showTopExpandButton, setShowTopExpandButton] = useState(false);
  const { containerRef, containerHeight } = useContainerHeight();

  useEffect(() => {
    setShowTopExpandButton(containerHeight ? containerHeight > 400 : false);
  }, [expanded, containerHeight]);

  if (result.isError) {
    return (
      <Card className="w-full bg-destructive/10 border-destructive/30">
        <CardContent className="pt-6">
          <p className="text-destructive font-medium">Error retrieving search results</p>
        </CardContent>
      </Card>
    );
  }

  const expandButton = () => (
    <div className="flex justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="rounded-full"
      >
        {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        <span className="text-xs hidden sm:block">{expanded ? "Collapse" : "Expand"}</span>
      </Button>
    </div>
  );

  return (
    <Card className="w-full">
      <CardContent className="pt-4 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium mb-2">Web Search Results</h3>
          {showTopExpandButton ? (expanded ? expandButton() : null) : null}
        </div>
        <div className={"prose prose-sm dark:prose-invert max-w-none relative"}>
          {result.content.map((item, index) => (
            <div ref={containerRef} key={index} className={cn("mb-4 [&_p]:text-xs [&_li]:text-xs [&_td]:text-xs [&_th]:text-xs [&_h2]:text-sm overflow-hidden")}
              style={{
                transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                maxHeight: expanded ? 5000 : 200,
              }}
            >
              {item.type === "text" && <ChatMarkdown>{item.text}</ChatMarkdown>}
            </div>
          ))}
          {!expanded && <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />}
        </div>
        {expandButton()}
      </CardContent>
    </Card>
  );
};

export default SearchWebResult;
