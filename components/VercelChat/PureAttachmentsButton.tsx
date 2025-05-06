import { PaperclipIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useVercelChatContext } from "@/providers/VercelChatProvider";
import { Attachment } from "@ai-sdk/ui-utils";
import { useRef } from "react";

function PureAttachmentsButton() {
    const { setAttachments } = useVercelChatContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const MAX_FILES = 10;

    const uploadFile = async (file: File) => {
        // Only allow image files for now
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            console.error('File type not supported:', file.type);
            return;
        }

        // Create a pending attachment with temporary URL for immediate preview
        const tempUrl = URL.createObjectURL(file);
        const pendingAttachment: Attachment = {
            name: file.name,
            contentType: file.type,
            url: tempUrl, // Temporary URL for initial preview
        };

        // Add the pending attachment to the state
        setAttachments((prev: Attachment[]) => [...prev, pendingAttachment]);

        try {
            // Upload the file to Arweave
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Upload failed');
            }

            // Update the attachment with the Arweave URL
            setAttachments((prev: Attachment[]) =>
                prev.map((attachment: Attachment) =>
                    // Compare by URL since object references won't match
                    attachment.url === tempUrl
                        ? {
                            name: data.fileName,
                            contentType: data.mimetype,
                            url: data.url,
                            id: data.id, // Store the Arweave transaction ID
                        }
                        : attachment
                )
            );

            // Revoke the temporary object URL to avoid memory leaks
            URL.revokeObjectURL(tempUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
            // Remove the failed attachment
            setAttachments((prev: Attachment[]) =>
                prev.filter((a: Attachment) => a.url !== tempUrl)
            );
            // Revoke the temporary object URL
            URL.revokeObjectURL(tempUrl);
        }
    };

    const handleFileChange = () => {
        const files = Array.from(fileInputRef.current?.files || []);
        
        // Limit to MAX_FILES
        const filesToUpload = files.slice(0, MAX_FILES);
        
        if (files.length > MAX_FILES) {
            console.warn(`Only the first ${MAX_FILES} files will be uploaded`);
        }
        
        filesToUpload.forEach(uploadFile);
        
        // Reset the input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <input
                type="file"
                className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                tabIndex={-1}
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