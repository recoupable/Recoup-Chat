import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Loader } from "lucide-react";

export default function YouTubeRevenueSkeleton() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>YouTube Revenue Analytics</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Loader className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading revenue data...</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Total Revenue</span>
            </div>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-7 w-20 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-7 w-18 mb-1" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>

        {/* Date Range Skeleton */}
        <div className="flex items-center justify-between text-sm border-t pt-4">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Recent Daily Revenue Skeleton */}
        <div>
          <Skeleton className="h-5 w-48 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note Skeleton */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <Skeleton className="h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  );
} 