import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface YouTubeRevenueErrorProps {
  message?: string;
}

export default function YouTubeRevenueError({ message }: YouTubeRevenueErrorProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-lg">YouTube Revenue Access Issue</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 