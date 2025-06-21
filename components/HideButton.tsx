"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EyeOff, Eye } from "lucide-react";
import { type TimelineMoment } from "@/types/Timeline";

interface HideButtonProps {
  moment: TimelineMoment;
  onVisibilityChange?: (moment: TimelineMoment, isHidden: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const HideButton = ({ 
  moment, 
  onVisibilityChange,
  className,
  disabled = false 
}: HideButtonProps) => {
  const [isHidden, setIsHidden] = useState(
    moment.metadata?.visibility === 'hidden'
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleVisibility = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    const newHiddenState = !isHidden;

    try {
      // API call to update visibility
      const response = await fetch(`/api/timeline/${moment.id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visibility: newHiddenState ? 'hidden' : 'public'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update visibility');
      }

      setIsHidden(newHiddenState);
      
      // Trigger callback if provided
      if (onVisibilityChange) {
        const updatedMoment: TimelineMoment = {
          ...moment,
          metadata: {
            ...moment.metadata,
            visibility: newHiddenState ? 'hidden' : 'public'
          }
        };
        onVisibilityChange(updatedMoment, newHiddenState);
      }
    } catch (error) {
      console.error('Error updating moment visibility:', error);
      // Could add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const tooltipText = isHidden ? 'Show moment' : 'Hide moment';
  const Icon = isHidden ? Eye : EyeOff;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-testid="hide-button"
            variant="ghost"
            size="sm"
            className={`px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/moment:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground ${className || ""}`}
            onClick={handleToggleVisibility}
            disabled={disabled || isLoading}
            aria-label={tooltipText}
          >
            <Icon className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLoading ? 'Updating...' : tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HideButton;