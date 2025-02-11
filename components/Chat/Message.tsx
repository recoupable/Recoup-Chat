import Icon from "../Icon";

// eslint-disable-next-line
const Message = ({ message }: { message: any; index: number }) => {
  return (
    <div className="p-3 rounded-lg flex w-full gap-2">
      {message.role === "assistant" && (
        <div className="border border-grey w-7 h-7 rounded-full flex items-center justify-center">
          <Icon name="logo-xs" />
        </div>
      )}
      <div
        className={`grow ${message.role === "user" && "flex justify-end"} max-w-[90%]`}
      >
        <section>
          <div
            className={`text-sm font-sans max-w-[500px] text-pretty break-words ${message.role === "user" ? "bg-grey px-4 p-2 rounded-full" : ""}`}
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(
                message.content.replaceAll("%", "&#37;") || "",
              ),
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default Message;
