import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

const MessageMediaDownloadButton = ({ onClick, overrideButtonClassName, overrideIconClassName, isReady = true, isDownloading = false }: { onClick: () => void, overrideButtonClassName?: string, overrideIconClassName?: string, isReady?: boolean, isDownloading?: boolean }) => {
    return <TooltipProvider delayDuration={100}>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("absolute top-2 right-2 z-20 md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-200/50", overrideButtonClassName)}
                    onClick={onClick}
                    disabled={isDownloading}
                    aria-label="Download image"
                >
                    <Download className={cn("h-4 w-4 text-gray-700", isDownloading ? "animate-pulse" : "", overrideIconClassName)} />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{isReady ? 'Download' : 'Preparing download...'}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
};

export default MessageMediaDownloadButton;
