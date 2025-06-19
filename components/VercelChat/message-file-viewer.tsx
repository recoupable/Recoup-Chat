import { Attachment } from "@ai-sdk/ui-utils";
import { PDFIcon } from "./icons";
import { FileIcon } from "lucide-react";

const MessageFileViewer = ({
  experimentalAttachment,
}: {
  experimentalAttachment: Attachment[] | undefined;
}) => {
  if (!experimentalAttachment || experimentalAttachment.length === 0)
    return null;
  return (
    <div className="max-w-[17rem] flex gap-2 flex-wrap justify-end ml-auto">
      {experimentalAttachment?.map((attachment) => {
        if (attachment.contentType?.startsWith("image")) {
          return (
            <div key={attachment.url} className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={attachment.url}
                src={attachment.url}
                alt={attachment.name}
                className="w-full h-full object-cover"
              />
            </div>
          );
        }
        if (attachment.contentType === "application/pdf") {
          return (
            <div key={attachment.url} className="w-16 h-16 rounded-xl">
              <PDFIcon key={attachment.url} />{" "}
            </div>
          );
        }
        return <FileIcon key={attachment.url} />;
      })}
    </div>
  );
};

export default MessageFileViewer;
