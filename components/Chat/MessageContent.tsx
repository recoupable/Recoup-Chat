import { MessageSegment } from "@/lib/chat/assistant/messageSegmentation";
import FormattedText from "./FormattedText";
import ProfilePictureCircles from "./ProfilePictureCircles";
import { FanData } from "@/lib/chat/assistant/messageParser";

interface MessageContentProps {
  segments: MessageSegment[];
}

export const MessageContent = ({ segments }: MessageContentProps) => {
  return (
    <section className="flex flex-col gap-5">
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <div key={`text-${index}`} className="message-content-segment">
            <FormattedText content={segment.content as string} />
          </div>
        ) : (
          <div key={`fans-${index}`} className="message-content-segment mt-2 mb-3">
            <ProfilePictureCircles fans={(segment.content as FanData).fans} />
          </div>
        )
      )}
    </section>
  );
};

export default MessageContent;
