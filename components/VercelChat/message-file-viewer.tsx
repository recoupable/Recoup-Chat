import { Attachment } from "@ai-sdk/ui-utils";

const MessageFileViewer = ({ experimentalAttachment }: { experimentalAttachment: Attachment[] | undefined }) => {
    if (!experimentalAttachment || experimentalAttachment.length === 0) return null;
    return <div className="max-w-[21rem] flex gap-2 flex-wrap justify-end ml-auto">
        {experimentalAttachment?.map((attachment) => (
            <div key={attachment.url} className="w-40 h-40 rounded-md overflow-hidden shadow-md border">
                {/* @eslint-disable-next-line @next/next/no-img-element */}
                <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
            </div>
        ))}
    </div>;
};

export default MessageFileViewer;


