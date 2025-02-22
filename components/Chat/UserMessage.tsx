import { UserMessage as UserMessageType } from "@/types/ChatMessage";

interface UserMessageProps {
  message: UserMessageType;
}

const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="grow flex justify-end max-w-[90%]">
      <section>
        <div
          className="text-sm font-sans max-w-[500px] text-pretty break-words bg-grey px-4 p-2 rounded-full"
          dangerouslySetInnerHTML={{
            __html: decodeURIComponent(
              message.content.replaceAll("%", "&#37;") || ""
            ),
          }}
        />
      </section>
    </div>
  );
};

export default UserMessage;
