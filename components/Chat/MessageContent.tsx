import { MessageSegment } from "@/lib/chat/assistant/messageSegmentation";
import FormattedText from "./FormattedText";
import ProfilePictureCircles from "./ProfilePictureCircles";
import { FanData } from "@/lib/chat/assistant/messageParser";

interface MessageContentProps {
  segments: MessageSegment[];
}

export const MessageContent = ({ segments }: MessageContentProps) => {
  return (
    <section className="flex flex-col gap-4">
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <FormattedText
            key={`text-${index}`}
            content={segment.content as string}
            className={index > 0 ? "mt-2" : ""}
          />
        ) : (
          <ProfilePictureCircles
            key={`fans-${index}`}
            fans={(segment.content as FanData).fans}
          />
        )
      )}
    </section>
  );
};

export default MessageContent;
