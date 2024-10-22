import { BookOpen, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useChatProvider } from "@/providers/ChatProvider";

const MobileMenu = ({ toggleMenu }: { toggleMenu: () => void }) => {
  const { push } = useRouter();
  const { createNewConversation } = useChatProvider();

  const goToNewChat = () => {
    push("/");
    createNewConversation();
    toggleMenu();
  };

  return (
    <motion.div
      className="fixed w-[80%] !bg-[#0a0a0a] h-full left-0 top-0 z-[10000] px-4 py-4 border-r-gray-700 border-r-[1px]"
      initial={{
        x: "-80%",
      }}
      animate={{
        x: "0%",
      }}
      exit={{
        x: "0%",
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <div className="flex justify-between mb-6">
        <button type="button" onClick={goToNewChat}>
          <Image src="/logo.png" width={40} height={40} alt="not found icon" />
        </button>
        <button type="button" onClick={toggleMenu}>
          <X />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <button
          className="flex gap-2 justify-center items-center border-gray-700 border-[1px] p-2 rounded-md bg-gray-900 text-sm"
          type="button"
          onClick={goToNewChat}
        >
          <Plus />
          New Chat
        </button>
        <button
          className="flex gap-2 items-center"
          type="button"
          onClick={() => {
            push("/history");
            toggleMenu();
          }}
        >
          <BookOpen />
          Chat History
        </button>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
