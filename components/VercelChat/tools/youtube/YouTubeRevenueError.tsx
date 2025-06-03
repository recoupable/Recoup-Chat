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
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Common Solutions:</strong>
            </p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1 ml-4">
              <li>• Ensure your channel is monetized and part of YouTube Partner Program</li>
              <li>• Re-authenticate with all YouTube Analytics permissions</li>
              <li>• Check if your channel meets monetization requirements</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 