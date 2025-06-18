import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatMarkdown from "@/components/Chat/ChatMarkdown";

export interface SearchWebResultType {
  content: {
    text: string;
    type: string;
  }[];
  isError: boolean;
}

const SearchWebResult= ({ result }: { result: SearchWebResultType }) => {
  if (result.isError) {
    return (
      <Card className="w-full bg-destructive/10 border-destructive/30">
        <CardContent className="pt-6">
          <p className="text-destructive font-medium">Error retrieving search results</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-4 p-4">
        <h3 className="text-lg font-medium mb-2">Web Search Results</h3>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {result.content.map((item, index) => (
            <div key={index} className="mb-4 [&_p]:text-xs [&_li]:text-xs [&_td]:text-xs [&_th]:text-xs [&_h2]:text-sm">
              {item.type === "text" && (
                <ChatMarkdown>{item.text}</ChatMarkdown>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchWebResult; 