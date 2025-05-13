import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { PreviewAttachment } from "./preview-attachment";

function AttachmentsPreview() {
    const { attachments, pendingAttachments, removeAttachment } = useVercelChatContext();

    if (attachments.length === 0) return null;

    return (
        <div className="flex gap-2 mb-2 overflow-visible">
            {attachments.map((attachment, index) => (
                <div key={index} className="relative group">
                    <PreviewAttachment
                        attachment={attachment}
                        isUploading={pendingAttachments.includes(attachment)}
                    />
                    <button
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 size-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove attachment"
                    >
                        <span className="text-xs">&times;</span>
                    </button>
                </div>
            ))}
        </div>
    );
}

export default AttachmentsPreview;