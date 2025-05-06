import { useState, useCallback } from "react";
import { Attachment } from '@ai-sdk/ui-utils';

/**
 * Hook for managing file attachments in chat
 * Handles file attachments state and pending uploads
 */
export default function useAttachments() {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    
    // Remove an attachment by its index
    const removeAttachment = useCallback((indexToRemove: number) => {
        const attachmentToRemove = attachments[indexToRemove];
        
        // If the attachment has a blob URL, revoke it to prevent memory leaks
        if (attachmentToRemove?.url?.startsWith('blob:')) {
            URL.revokeObjectURL(attachmentToRemove.url);
        }
        
        setAttachments(prevAttachments => 
            prevAttachments.filter((_, index) => index !== indexToRemove)
        );
    }, [attachments]);
    
    // Clear all attachments
    const clearAttachments = useCallback(() => {
        // Revoke any blob URLs to prevent memory leaks
        attachments.forEach(attachment => {
            if (attachment.url?.startsWith('blob:')) {
                URL.revokeObjectURL(attachment.url);
            }
        });
        
        setAttachments([]);
    }, [attachments]);

    // Filter for pending attachments (currently being uploaded)
    const pendingAttachments = attachments.filter(attachment => 
        attachment.url?.startsWith('blob:') || !attachment.url
    );
    
    // Get only the uploaded attachments (not pending)
    const uploadedAttachments = attachments.filter(attachment => 
        !attachment.url?.startsWith('blob:') && attachment.url
    );

    // Check if there are any pending uploads
    const hasPendingUploads = pendingAttachments.length > 0;

    return { 
        attachments, 
        setAttachments, 
        pendingAttachments,
        uploadedAttachments,
        removeAttachment,
        clearAttachments,
        hasPendingUploads
    };
}
