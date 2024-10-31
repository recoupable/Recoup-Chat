import { BookOpen, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserProvider } from "@/providers/UserProvder";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const MobileMenu = ({ toggleMenu }: { toggleMenu: () => void }) => {
  const { push } = useRouter();
  const { isPrepared } = useUserProvider();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const goToItem = (link?: string) => {
    if (isPrepared()) push(`/${link || ""}`);
  };

  return (
    <motion.div
      className="fixed w-[80%] bg-white dark:bg-black h-full left-0 top-0 z-[10000] px-4 py-4 border-r border-border shadow-lg"
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
          <Image
            src={resolvedTheme === 'dark' ? '/logo-light.png' : '/logo-dark.png'}
            width={45}
            height={45}
            alt="logo"
            className="rounded-md overflow-hidden"
          />
        </button>
        <button type="button" onClick={toggleMenu}>
          <X />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <button
          className="flex gap-2 justify-center items-center border border-border p-2 rounded-md bg-muted text-sm"
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
