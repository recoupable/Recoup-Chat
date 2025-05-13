import type { Attachment } from 'ai';
import { Loader2, FileIcon } from 'lucide-react';

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2">
      <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center overflow-hidden">
        {contentType ? (
          contentType.startsWith('image') ? (
            <img
              key={url}
              src={url}
              alt={name ?? 'An image attachment'}
              className="rounded-md size-full object-cover"
            />
          ): (
            // Generic file icon
            <div className="flex items-center justify-center text-zinc-500">
              <FileIcon size={24} />
            </div>
          )
        ) : (
          // Fallback for unknown type
          <div className="flex items-center justify-center text-zinc-500">
            <FileIcon size={24} />
          </div>
        )}

        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center"
          >
            <Loader2 className="animate-spin text-white" size={20} />
          </div>
        )}
      </div>
      <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
    </div>
  );
};
