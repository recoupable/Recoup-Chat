import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PencilEditIcon } from "./icons";

interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, className }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-testid="message-edit-button"
            variant="ghost"
            className={`px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100 ${className || ""}`}
            onClick={onClick}
          >
            <PencilEditIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit message</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EditButton;
