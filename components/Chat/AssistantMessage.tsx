import type { Message } from "@ai-sdk/react";
import Icon from "../Icon";

interface AssistantMessageProps {
  message: Message;
}

const AssistantMessage = ({ message }: AssistantMessageProps) => {
  return (
    <div className="flex w-full gap-2">
      <div className="border border-grey w-7 h-7 rounded-full flex items-center justify-center">
        <Icon name="logo-xs" />
      </div>
      <div className="grow max-w-[90%]">
        <section>
          <div
            className="text-sm font-sans max-w-[500px] text-pretty break-words"
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(
                message.content.replaceAll("%", "&#37;") || ""
              ),
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default AssistantMessage;
