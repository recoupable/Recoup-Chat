import { BookOpen, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserProvider } from "@/providers/UserProvder";

const MobileMenu = ({ toggleMenu }: { toggleMenu: () => void }) => {
  const { push } = useRouter();
  const { isPrepared } = useUserProvider();

  const goToItem = (link?: string) => {
    if (isPrepared()) push(`/${link || ""}`);
  };

  return (
    <motion.div
      className="fixed w-[80%] h-full left-0 top-0 z-[10000] px-4 py-4 border-r-gray-700 border-r-[1px]"
      style={{
        backgroundColor: 'var(--background)',
      }}
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
        <button type="button" onClick={() => goToItem()}>
          <div
            style={{
              backgroundImage: 'var(--logo-image)',
              width: '40px',
              height: '40px',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            className="rounded-md overflow-hidden"
            aria-label="Logo"
          />
        </button>
        <button type="button" onClick={toggleMenu}>
          <X />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <button
          className="flex gap-2 justify-center items-center border-gray-700 border-[1px] p-2 rounded-md bg-white text-black text-sm"
          type="button"
          onClick={() => goToItem()}
        >
          <Plus />
          New Chat
        </button>
        <button
          className="flex gap-2 items-center"
          type="button"
          onClick={() => goToItem("history")}
        >
          <BookOpen />
          Chat History
        </button>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
