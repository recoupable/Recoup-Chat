import { useChatProvider } from "@/providers/ChatProvider";
import { useRouter } from "next/navigation";

const AIError = () => {
  const { push } = useRouter();
  const { setQuotaExceeded } = useChatProvider();

  return (
    <div className="grow h-screen overflow-hidden w-full p-4 bg-background">
      <div className="size-full bg-white rounded-xl p-6">
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
              push("/");
            }}
          >
            try again
          </a>{" "}
          later.
        </p>
      </div>
    </div>
  );
};

export default AIError;
