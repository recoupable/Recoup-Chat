"use client";

import { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimelineMoment } from '@/types/Timeline';
import { useTimelineApi } from '@/hooks/useTimelineApi';

interface HideButtonProps {
  moment: TimelineMoment; // Using TimelineMoment instead of Moment
  onToggle?: (momentId: string, isVisible: boolean) => void;
  className?: string;
}

export const HideButton = ({ moment, onToggle, className }: HideButtonProps) => {
  const { hideMoment, showMoment } = useTimelineApi();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (moment.isVisible) {
        await hideMoment(moment.id);
      } else {
        await showMoment(moment.id);
      }
      
      // Call optional callback
      onToggle?.(moment.id, !moment.isVisible);
    } catch (error) {
      console.error('Failed to toggle moment visibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 hover:bg-gray-100 transition-colors ${className || ''}`}
      title={moment.isVisible ? 'Hide moment' : 'Show moment'}
    >
      {moment.isVisible ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
};