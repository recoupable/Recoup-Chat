import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";

const SearchWebSkeleton: React.FC = () => {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Loader className="h-3 w-3 animate-spin text-primary" />
          <p className="text-sm font-medium">Searching web...</p>
        </div>
        <div className="space-y-1">
          <div className="h-4 bg-muted rounded-full w-full animate-pulse" />
          <div className="h-4 bg-muted rounded-full w-5/6 animate-pulse" />
          <div className="h-4 bg-muted rounded-full w-4/5 animate-pulse" />
          <div className="h-4 bg-muted rounded-full w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded-full w-2/3 animate-pulse" />
          <div className="h-4 bg-muted rounded-full w-1/2 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchWebSkeleton; 