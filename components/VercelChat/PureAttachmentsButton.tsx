import { PaperclipIcon } from "lucide-react";
import { Button } from "../ui/button";
import { usePureFileAttachments } from "@/hooks/usePureFileAttachments";

function PureAttachmentsButton() {
    const { fileInputRef, handleFileChange } = usePureFileAttachments();

    return (
        <>
            <input
                type="file"
                className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                tabIndex={-1}
                accept="image/jpeg,image/png,image/gif,image/webp"
            />
            <Button
                data-testid="attachments-button"
                className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
                onClick={(event) => {
                    event.preventDefault();
                    fileInputRef.current?.click();
                }}
                variant="ghost"
            >
                <PaperclipIcon size={14} />
            </Button>
        </>
    );
}

export default PureAttachmentsButton;