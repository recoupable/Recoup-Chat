import React from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CommentDetailsDialogActionsProps {
  onNavigate: (direction: "prev" | "next") => void;
  currentIndex: number;
  totalComments: number;
}

const CommentDetailsDialogActions: React.FC<CommentDetailsDialogActionsProps> = ({
  onNavigate,
  currentIndex,
  totalComments,
}) => {
  return (
    <div className="flex justify-between items-center border-t pt-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate("prev")}
        disabled={currentIndex === 0}
        className="rounded-xl text-xs h-8 px-2"
      >
        <ChevronLeft className="h-3 w-3 mr-1" /> Previous
      </Button>

      <DialogClose asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl text-xs h-8 px-2"
        >
          Close
        </Button>
      </DialogClose>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate("next")}
        disabled={currentIndex === totalComments - 1}
        className="rounded-xl text-xs h-8 px-2"
      >
        Next <ChevronRight className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
};

export default CommentDetailsDialogActions; 