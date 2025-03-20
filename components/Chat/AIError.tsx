import { useRouter } from "next/navigation";
import Icon from "../Icon";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import { v4 as uuidV4 } from "uuid";

const AIError = () => {
  const { push } = useRouter();
  const { setQuotaExceeded } = useConversationsProvider();

  return (
    <div className="grow h-screen overflow-hidden w-full p-4 bg-grey-light-3">
      <div className="size-full bg-white rounded-xl p-6">
        <div className="flex gap-2 items-start">
          <div className="border border-grey rounded-full p-2">
            <Icon name="logo-xs" />
          </div>
          <p className="text-sm">
            {`There's too many musicians creating TikTok reports right now.`}{" "}
            <br />
            During peak hours, we are limit TikTok Report generation to paid
            users. <br />
            Please reach out to{" "}
            <a
              href="mailto:sidney@recoupable.com"
              className="underline text-purple-dark"
            >
              sidney@recoupable.com
            </a>{" "}
            to upgrade your account or{" "}
            <a
              className="underline text-purple-dark cursor-pointer"
              onClick={() => {
                setQuotaExceeded(false);
                push(`/${uuidV4()}`);
              }}
            >
              try again
            </a>{" "}
            later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIError;
